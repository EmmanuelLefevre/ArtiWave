/*============================================*/
/*============ usersController.js ============*/
/*============================================*/


/*============ IMPORT USED MODULES ============*/
const argon2 = require('argon2');

// Repositories
const ArticleRepository = require('../repositories/articleRepository');
const UserRepository = require('../repositories/userRepository');

// Response validation
const { UserResponseValidationRoleAdmin,
        UserResponseValidationBase,
        UsersResponseValidationRoleAdmin,
        UsersResponseValidationRoleCertified,
        UserUpdatedResponseValidationRoleAdmin,
        UserUpdatedResponseValidationBase,
        UserRegisterResponseValidation } =
    require('../_validation/responses/userResponseValidation');

// Errors
const AccountAlreadyExistsError = require('../_errors/accountAlreadyExistsError');
const CreationResponseObjectError = require('../_errors/creationResponseObjectError');
const InternalServerError = require('../_errors/internalServerError');
const NicknameAlreadyUsedError = require('../_errors/nicknameAlreadyUsedError');
const ResponseValidationError = require('../_errors/responseValidationError');
const UnknownUserRoleError = require('../_errors/unknownUserRoleError');
const UserNotFoundError = require('../_errors/userNotFoundError');

// Models
const User = require('../models/IUser');
const Article = require('../models/IArticle');


/*============ USERS ============*/

class UserController {

    /*=== REGISTER ===*/
    static async register(req, res) {
        // Argon2
        const timeCost = parseInt(process.env.ARGON2_TIME_COST);
        const memoryCost = parseInt(process.env.ARGON2_MEMORY_COST);

        // Extract email && nickname && password properties from request
        const { email, nickname, password } = req.body;

        try {
            // Password Hash
            const hash = await argon2.hash(password, {
                saltLength: 8,
                timeCost: timeCost,
                memoryCost: memoryCost
            });

            // Create User model instance
            const newUser = new User({
                email: email,
                nickname: nickname,
                password: hash,
                registeredAt: new Date()
            });

            // Save user in database
            let user = await newUser.save();

            // Set response
            const response = {
                email: user.email,
                nickname: user.nickname,
                registeredAt: user.registeredAt
            }

            // Validate response format
            try {
                await UserRegisterResponseValidation.validate(response, { abortEarly: false });
            }
            catch (validationError) {
                throw new ResponseValidationError();
            }

            // Return created user
            return res.status(201).json(response);
        }
        catch (err) {
            if (err.code === 11000) {
                if (err.keyPattern.email) {
                    throw new AccountAlreadyExistsError();
                } else if (err.keyPattern.nickname) {
                    throw new NicknameAlreadyUsedError();
                }
            }

            throw new InternalServerError();
        }
    }

    /*=== GET ALL USERS ===*/
    static async getAllUsers(req, res) {
        try {
            let users = await User.find({}, 'id email nickname roles registeredAt updatedAt');

            if (users === 0) {
                throw new UserNotFoundError();
            }

            // Count users
            const usersCount = users.length;

            // Set response and determine the response validation schema based on user role
            let responseValidationSchema;
            let responseObject;

            switch (req.userRole) {
                case 'admin':
                    responseValidationSchema = UsersResponseValidationRoleAdmin;
                    responseObject = {
                        data: users.map(user => this.#createResponseUserObject(user, req.userRole))
                    };
                    break;
                case 'certified':
                    responseValidationSchema = UsersResponseValidationRoleCertified;
                    responseObject = {
                        data: users.map(user => this.#createResponseUserObject(user, req.userRole))
                    };
                    break;
            }

            // Add dataCount to the responseObject
            responseObject.dataCount = usersCount;

            // Validate response format
            try {
                await responseValidationSchema.validate(responseObject, { abortEarly: false });
            }
            catch (validationError) {
                throw new ResponseValidationError();
            }

            // Return all users
            return res.status(200).json(responseObject);
        }
        catch (err) {
            throw new InternalServerError();
        }
    }

    /*=== GET SINGLE USER ===*/
    static async getUser(req, res) {
        const userId = req.params.id;

        try {
            let user = await User.findById(userId);

            if (!user) {
                throw new UserNotFoundError();
            }

            // Set response and determine the response validation schema based on user role
            let responseValidationSchema;
            let responseObject;

            switch (req.userRole) {
                case 'admin':
                    responseValidationSchema = UserResponseValidationRoleAdmin;
                    responseObject = this.#createResponseUserObject(user, req.userRole);
                    break;
                default:
                    responseValidationSchema = UserResponseValidationBase;
                    responseObject = this.#createResponseUserObject(user, req.userRole);
                    break;
            }

            // Check if userId in JWT matches userId in URL
            if (req.userId === userId) {
                if (req.userRole !== "admin") {
                    // Add user email to the responseObject
                    responseObject.email = user.email;
                }
            }

            // Validate response format
            try {
                await responseValidationSchema.validate(responseObject, { abortEarly: false });
            }
            catch (validationError) {
                throw new ResponseValidationError();
            }

            // Return single user
            return res.status(200).json(responseObject);
        }
        catch (err) {
            throw new InternalServerError();
        }
    }

    /*=== UPDATE USER ===*/
    static async updateUser(req, res) {
        const userId = req.params.id;

        try {
            let user = await User.findById(userId);

            if (!user) {
                throw new UserController();
            }

            // Save original user data
            const originalUserData = user.toObject();

            // If password parameter hash it before insert
            if ('password' in req.body) {
                req.body.password = await argon2.hash(req.body.password, {
                    saltLength: 8,
                    timeCost: timeCost,
                    memoryCost: memoryCost
                });
            }

            // Set updatedAt to the current date
            req.body.updatedAt = new Date();

            // Check if user matches userId making request
            if (user._id.toString() !== req.userId) {
                // Check if user is admin
                if (req.isAdmin) {
                    // Allow admin to update any user
                    await User.updateOne({ _id: userId }, req.body);
                }
                else {
                    return res.status(403).json({ message: 'You are not allowed to update a user other than yourself!' });
                }
            }
            else {
                // If user matches, save user
                await User.updateOne({ _id: userId }, req.body);
            }

            // Fetch the updated user by its ID
            const updatedUser = await User.findById(userId);

            // Identify modified properties from req.body
            const modifiedProperties = Object.keys(req.body).reduce((acc, key) => {
                // Do not include the password in the modified properties
                if (key !== 'password' && originalUserData[key] !== updatedUser[key]) {
                    acc[key] = updatedUser[key];
                }
                return acc;
            }, {});

            // Set response and determine the response validation schema based on user role
            let responseValidationSchema;
            let responseObject;

            switch (req.userRole) {
                case 'admin':
                    responseValidationSchema = UserUpdatedResponseValidationRoleAdmin;
                    responseObject = {
                        data: [this.#createResponseUserObject(user, req.userRole)]
                    };
                    break;
                default:
                    responseValidationSchema = UserUpdatedResponseValidationBase;
                    responseObject = {
                        data: [this.#createResponseUserObject(user, req.userRole)]
                    };
                    break;
            }

            // Role user and certified
            if (req.userRole !== "admin") {
                // Add user email to the responseObject
                responseObject.data[0].email = user.email;
            }

            // Add modified property to the responseObject
            responseObject.modifiedProperties = modifiedProperties;

            // Validate response format
            try {
                await responseValidationSchema.validate(responseObject, { abortEarly: false });
            }
            catch (validationError) {
                throw new ResponseValidationError();
            }

            // Return updated user
            return res.status(200).json(responseObject);
        }
        catch (err) {
            if (err.code === 11000 && err.keyPattern.nickname) {
                throw new NicknameAlreadyUsedError();
            }

            throw new InternalServerError();
        }
    }

    /*=== DELETE USER ===*/
    static async deleteUser(req, res) {
        const userId = req.params.id;

        try {
            let user = await User.findById(userId);

            if (!user) {
                throw new UserNotFoundError();
            }

            // Check if user matches userId making request
            if (user._id.toString() !== req.userId) {
                // Check if user is admin
                if (req.isAdmin) {
                    // Allow admin to delete any user
                    await User.deleteOne({ _id: userId });

                    return res.sendStatus(204);
                }
                else {
                    return res.status(403).json({ message: 'You are not allowed to delete a user other than yourself!' });
                }
            }

            // If user matches delete user
            await User.deleteOne({ _id: userId });

            // Cascade delete articles owned by user
            await Article.deleteMany({ author: userId });

            return res.sendStatus(204);
        }
        catch (err) {
            throw new InternalServerError();
        }
    }

    /*============ FUNCTIONS ============*/

    /*=== CREATE RESPONSE USER OBJECT BASED ON ROLE ===*/
    static async #createResponseUserObject(user, userRole) {
        try {
            const commonFields = {
                nickname: user.nickname,
                registeredAt: user.registeredAt,
                updatedAt: user.updatedAt
            };

            switch (userRole) {
                case 'admin':
                    return {
                        _id: user._id,
                        email: user.email,
                        nickname: user.nickname,
                        roles: user.roles,
                        registeredAt: user.registeredAt,
                        updatedAt: user.updatedAt
                    };
                case 'certified':
                case 'user':
                    return commonFields;
                default:
                    throw new UnknownUserRoleError();
            }
        }
        catch (err) {
            throw new CreationResponseObjectError();
        }
    }

}


/*============ EXPORT MODULE ============*/
module.exports = UserController;
