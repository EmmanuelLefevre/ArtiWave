/*============ IMPORT USED MODULES ============*/
const argon2 = require('argon2');

const User = require('../_models/IUser');
const ErrorHandler = require('../miscellaneous/errorHandler');


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
            registeredAt: new Date(),
            updatedAt: new Date()
        });

        // Save user in database
        let user = await newUser.save();

        return res.status(201).json({ message: 'User created successfully!', nickname: user.nickname });
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
exports.getAllUsers = async (_req, res) => {
    try {
        const users = await User.find({}, 'id email nickname registeredAt updatedAt');

        // Count users
        const dataCount = users.length;
        return res.status(200).json({ data: users, dataCount });
    }
    catch (err) {
        return sendDatabaseError(res, err);
    }
}


/*=== GET SINGLE USER ===*/
exports.getUser = async (req, res) => {
    let userId = req.params.id;

    try {
        let user = await User.findById(userId, { _id: 1, email: 1, nickname: 1, registeredAt: 1, updatedAt: 1 });

        if (!user) {
            return ErrorHandler.handleUserNotFound(res);
        }

        return res.status(200).json({ data: user });
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== UPDATE USER ===*/
exports.updateUser = async (req, res) => {
    let userId = req.params.id;

    try {
        let user = await User.findByIdAndUpdate(userId, req.body);

        if (!user) {
            return ErrorHandler.handleUserNotFound(res);
        }

        // If password parameter hash it before insert
        if ('password' in req.body) {
            req.body.password = await argon2.hash(req.body.password);
        }

        // Set updatedAt to the current date
        req.body.updatedAt = new Date();

        // Save user in database
        await user.updateOne(req.body);

        return res.status(200).json({ message: 'User updated!' });
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== DELETE USER ===*/
exports.deleteUser =  async (req, res) => {
    let userId = req.params.id;

    try {
        let user = await User.findByIdAndDelete(userId);

        if (!user) {
            return ErrorHandler.handleUserNotFound(res);
        }

        return res.status(204).json({});
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}
