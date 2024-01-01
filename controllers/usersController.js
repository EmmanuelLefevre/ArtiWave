/*============================================*/
/*============ usersController.js ============*/
/*============================================*/


/*============ IMPORT USED MODULES ============*/
const argon2 = require('argon2');

// Repositories
const UserRepository = require('../repositories/userRepository');

// Response validation
const { UserResponseValidationRoleAdmin,
        UserResponseValidationBase,
        UsersResponseValidationRoleAdmin,
        UsersResponseValidationRoleCertified,
        UserUpdatedResponseValidationRoleAdmin,
        UserUpdatedResponseValidationBase,
        UserRegisterResponseValidation } = require('../_validation/responses/userResponseValidation');

// Errors
const AccountAlreadyExistsError = require('../_errors/accountAlreadyExistsError');
const CreationFailedError = require('../_errors/creationFailedError');
const CreationResponseObjectError = require('../_errors/creationResponseObjectError');
const DeletionFailedError = require('../_errors/deletionFailedError');
const InternalServerError = require('../_errors/internalServerError');
const NicknameAlreadyUsedError = require('../_errors/nicknameAlreadyUsedError');
const NoPropertiesModifiedError = require('../_errors/noPropertiesModifiedError');
const RecoveryFailedError = require('../_errors/recoveryFailedError');
const ResponseValidationError = require('../_errors/responseValidationError');
const UpdateFailedError = require('../_errors/updateFailedError');
const UnknownUserRoleError = require('../_errors/unknownUserRoleError');
const UserNotFoundError = require('../_errors/userNotFoundError');

// Models
const User = require('../models/IUser');


/*============ USERS ============*/

class UserController {

    /*=== REGISTER USER ===*/
    static async register(req, res, next) {
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
            const registeredUser = await UserRepository.registerUser(newUser);

            // Validate response format
            try {
                await UserRegisterResponseValidation.validate(registeredUser, { abortEarly: false });
            }
            catch (validationError) {
                throw new ResponseValidationError();
            }

            // Return created user
            if (registeredUser) {
                return res.status(201).json(registeredUser);
            }
            else {
                throw new CreationFailedError();
            }
        }
        catch (err) {
            if (err instanceof CreationResponseObjectError ||
                err instanceof CreationFailedError ||
                err instanceof ResponseValidationError ||
                err instanceof AccountAlreadyExistsError ||
                err instanceof NicknameAlreadyUsedError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*=== GET ALL USERS ===*/
    static async getAllUsers(req, res, next) {
        try {
            let users = await UserRepository.getAllUsers();
            if (users.length === 0) {
                throw new UserNotFoundError();
            }

            // Create response
            users = await Promise.all(users.map(user => this.#createResponseUserObject(user, req.userRole)));

            // Count users
            const usersCount = users.length;

            // Set response and determine the response validation schema based on user role
            let responseValidationSchema;
            let responseObject;

            switch (req.userRole) {
                case 'admin':
                    responseValidationSchema = UsersResponseValidationRoleAdmin;
                    responseObject = {
                        data: users
                    };
                    break;
                case 'certified':
                    responseValidationSchema = UsersResponseValidationRoleCertified;
                    responseObject = {
                        data: users
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
            if (usersCount > 0) {
                return res.status(200).json(responseObject);
            }
            else {
                throw new RecoveryFailedError();
            }
        }
        catch (err) {
            if (err instanceof CreationResponseObjectError ||
                err instanceof RecoveryFailedError ||
                err instanceof ResponseValidationError ||
                err instanceof UserNotFoundError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*=== GET SINGLE USER ===*/
    static async getUser(req, res, next) {
        const userId = req.params.id;

        try {
            let user = await UserRepository.getUserById(userId);
            if (!user) {
                throw new UserNotFoundError();
            }

            // Create response
            user = await this.#createResponseUserObject(user, req.userRole, req.userId);

            // Set response and determine the response validation schema based on user role
            let responseValidationSchema;
            let responseObject;

            switch (req.userRole) {
                case 'admin':
                    responseValidationSchema = UserResponseValidationRoleAdmin;
                    responseObject = user
                    break;
                default:
                    responseValidationSchema = UserResponseValidationBase;
                    responseObject = user
                    break;
            }

            // Validate response format
            try {
                await responseValidationSchema.validate(responseObject, { abortEarly: false });
            }
            catch (validationError) {
                throw new ResponseValidationError();
            }

            // Return single user
            if (user) {
                return res.status(200).json(responseObject);
            }
            else {
                throw new RecoveryFailedError();
            }
        }
        catch (err) {
            if (err instanceof CreationResponseObjectError ||
                err instanceof RecoveryFailedError ||
                err instanceof UserNotFoundError ||
                err instanceof ResponseValidationError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*=== UPDATE USER ===*/
    static async updateUser(req, res, next) {
        // Argon2
        const timeCost = parseInt(process.env.ARGON2_TIME_COST);
        const memoryCost = parseInt(process.env.ARGON2_MEMORY_COST);

        const userId = req.params.id;

        try {
            let user = await UserRepository.getUserById(userId);
            if (!user) {
                throw new UserNotFoundError();
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

            let updatedUser;

            // Check if property have been modified
            const checkIfPropertiesModified = UserController.#checkIfPropertiesModified(originalUserData, req.body);

            // Check if user matches userId making request
            if (user._id.toString() !== req.userId) {
                // Check if user is admin
                if (req.isAdmin) {
                    if (!checkIfPropertiesModified) {
                        throw new NoPropertiesModifiedError();
                    }

                    // Allow admin to update any user
                    updatedUser = await UserRepository.updateUserById({ _id: userId }, req.body);
                }
                else {
                    return res.status(403).json({ message: 'You are not allowed to update a user other than yourself!' });
                }
            }
            else {
                if (!checkIfPropertiesModified) {
                    throw new NoPropertiesModifiedError();
                }

                // If user matches, save user
                updatedUser = await UserRepository.updateUserById({ _id: userId }, req.body);
            }

            // Identify modified properties from req.body
            const modifiedProperties = Object.keys(req.body).reduce((acc, key) => {
                // Do not include the password in the modified properties
                if (key !== 'password' && originalUserData[key] !== updatedUser[key]) {
                    acc[key] = updatedUser[key];
                }

                // Check if the password has been modified
                if (key === 'password' && originalUserData[key] !== updatedUser[key]) {
                    acc[key] = 'Password successfully modified!';
                }

                return acc;
            }, {});

            // Create response
            user = await this.#createResponseUserObject(user, req.userRole, req.userId);

            // Set response and determine the response validation schema based on user role
            let responseValidationSchema;
            let responseObject;

            switch (req.userRole) {
                case 'admin':
                    responseValidationSchema = UserUpdatedResponseValidationRoleAdmin;
                    responseObject = {
                        data: user
                    };
                    break;
                default:
                    responseValidationSchema = UserUpdatedResponseValidationBase;
                    responseObject = {
                        data: user
                    };
                    break;
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
            if (user) {
                return res.status(200).json(responseObject);
            }
            else {
                throw new UpdateFailedError();
            }
        }
        catch (err) {
            if (err instanceof UserNotFoundError ||
                err instanceof CreationResponseObjectError ||
                err instanceof UpdateFailedError ||
                err instanceof ResponseValidationError ||
                err instanceof NoPropertiesModifiedError ||
                err instanceof AccountAlreadyExistsError ||
                err instanceof NicknameAlreadyUsedError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*=== DELETE USER ===*/
    static async deleteUser(req, res, next) {
        const userId = req.params.id;

        try {
            let user = await UserRepository.getUserById(userId);
            if (!user) {
                throw new UserNotFoundError();
            }

            let deletedCount;

            // Check if user matches userId making request
            if (user._id.toString() !== req.userId) {
                // Check if user is admin
                if (req.isAdmin) {
                    // Allow admin to delete any user
                    deletedCount = await UserRepository.deleteUserById(userId);

                    // Delete article
                    if (deletedCount > 0) {
                        return res.sendStatus(204);
                    }
                    else {
                        throw new DeletionFailedError();
                    }
                }
                else {
                    return res.status(403).json({ message: 'You are not allowed to delete a user other than yourself!' });
                }
            }

            // If user matches delete user
            deletedCount = await UserRepository.deleteUserById(userId);

            // Delete article
            if (deletedCount > 0) {
                return res.sendStatus(204);
            }
            else {
                throw new DeletionFailedError();
            }
        }
        catch (err) {
            if (err instanceof UserNotFoundError ||
                err instanceof DeletionFailedError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*============ PRIVATE METHODS ============*/

    /*=== CREATE RESPONSE USER OBJECT BASED ON ROLE ===*/
    static async #createResponseUserObject(user, userRole, reqUserId) {
        try {
            const commonFields = {
                // If requested user is the one making request, add email to response
                email: reqUserId === user._id.toString() ? user.email : undefined,
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
            if (err instanceof UnknownUserRoleError) {
                return next(err);
            }
            throw new CreationResponseObjectError();
        }
    }

    /*=== CHECK IF PROPERTIES HAVE BEEN MODIFIED ===*/
    static #checkIfPropertiesModified(originalUserData, reqBody) {
        for (const key of Object.keys(reqBody)) {
            // Check if property is same to current value in database
            if (originalUserData[key] === reqBody[key]) {
                return false;
            }
        }

        return true;
    }
}


/*============ EXPORT MODULE ============*/
module.exports = UserController;
