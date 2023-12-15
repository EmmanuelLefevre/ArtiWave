/*============ IMPORT USED MODULES ============*/
const argon2 = require('argon2');

const User = require('../_models/IUser');
const Article = require('../_models/IArticle');
const ErrorHandler = require('../_errors/errorHandler');

const { userResponseValidationRoleAdmin,
        userResponseValidationBase,
        usersResponseValidationRoleAdmin,
        usersResponseValidationRoleCertified,
        userUpdatedResponseValidationRoleAdmin,
        userUpdatedResponseValidationBase } = require('../_validation/responses/userResponseValidation');


/*============ USERS ============*/

/*=== ARGON2 ===*/
const timeCost = parseInt(process.env.ARGON2_TIME_COST);
const memoryCost = parseInt(process.env.ARGON2_MEMORY_COST);

/*=== REGISTER ===*/
exports.register = async (req, res) => {
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
            registeredAt: user.registeredAt,
            updatedAt: user.updatedAt
        }

        // Validate response format
        try {
            await userResponseValidationBase.validate(response, { abortEarly: false });
        }
        catch (validationError) {
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return created user
        return res.status(201).json(response);
    }
    catch (err) {
        if (err.code === 11000) {
            if (err.keyPattern.email) {
                return res.status(409).json({ message: 'Account already exists!' });
            } else if (err.keyPattern.nickname) {
                return res.status(409).json({ message: 'Nickname is already used!' });
            }
        }

        return ErrorHandler.sendDatabaseError(res, err);
    }
}

/*=== GET ALL USERS ===*/
exports.getAllUsers = async (req, res) => {
    try {
        let users = await User.find({}, 'id email nickname registeredAt updatedAt');

        if (users === 0) {
            return ErrorHandler.handleUserNotFound(res);
        }

        // Count users
        const usersCount = users.length;

        let responseValidationSchema;
        let responseObject;

        // Set response and determine the response validation schema based on user role
        switch (req.userRole) {
            case 'admin':
                responseValidationSchema = usersResponseValidationRoleAdmin;
                responseObject = {
                    data: users.map(user => createResponseUserObject(user, req.userRole))
                };
                break;
            case 'certified':
                responseValidationSchema = usersResponseValidationRoleCertified;
                responseObject = {
                    data: users.map(user => createResponseUserObject(user, req.userRole))
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
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return all users
        return res.status(200).json(responseObject);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== GET SINGLE USER ===*/
exports.getUser = async (req, res) => {
    let userId = req.params.id;

    try {
        let user = await User.findById(userId);

        if (!user) {
            return ErrorHandler.handleUserNotFound(res);
        }

        let responseValidationSchema;
        let responseObject;

        // Set response and determine the response validation schema based on user role
        switch (req.userRole) {
            case 'admin':
                responseValidationSchema = userResponseValidationRoleAdmin;
                responseObject = createResponseUserObject(user, req.userRole);
                break;
            case 'certified':
                responseValidationSchema = userResponseValidationBase;
                responseObject = createResponseUserObject(user, req.userRole);
                break;
            case 'user':
                responseValidationSchema = userResponseValidationBase;
                responseObject = createResponseUserObject(user, req.userRole);
                break;
        }

        // Validate response format
        try {
            await responseValidationSchema.validate(responseObject, { abortEarly: false });
        }
        catch (validationError) {
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return single user
        return res.status(200).json(responseObject);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== UPDATE USER ===*/
exports.updateUser = async (req, res) => {
    let userId = req.params.id;

    try {
        let user = await User.findById(userId);

        if (!user) {
            return ErrorHandler.handleUserNotFound(res);
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

        let responseValidationSchema;
        let responseObject;

        // Set response and determine the response validation schema based on user role
        switch (req.userRole) {
            case 'admin':
                responseValidationSchema = userUpdatedResponseValidationRoleAdmin;
                responseObject = {
                    data: [createResponseUserObject(user, req.userRole)]
                };
                break;
            case 'certified':
                responseValidationSchema = userUpdatedResponseValidationBase;
                responseObject = {
                    data: [createResponseUserObject(user, req.userRole)]
                };
                break;
            case 'user':
                responseValidationSchema = userUpdatedResponseValidationBase;
                responseObject = {
                    data: [createResponseUserObject(user, req.userRole)]
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
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return updated user
        return res.status(200).json(responseObject);
    }
    catch (err) {
        if (err.code === 11000 && err.keyPattern.nickname) {
            return res.status(409).json({ message: 'Nickname is already used!' });
        }

        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== DELETE USER ===*/
exports.deleteUser =  async (req, res) => {
    let userId = req.params.id;

    try {
        let user = await User.findById(userId);

        if (!user) {
            return ErrorHandler.handleUserNotFound(res);
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
        return ErrorHandler.sendDatabaseError(res, err);
    }
}





/*============ FUNCTIONS ============*/

/*=== CREATE RESPONSE USER OBJECT BASED ON ROLE ===*/
const createResponseUserObject = (user, userRole) => {
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
                registeredAt: user.registeredAt,
                updatedAt: user.updatedAt
            };
        case 'certified':
            return commonFields;
        case 'user':
            return commonFields;
    }
};