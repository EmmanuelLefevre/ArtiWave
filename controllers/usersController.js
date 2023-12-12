/*============ IMPORT USED MODULES ============*/
const argon2 = require('argon2');

const User = require('../_models/IUser');
const ErrorHandler = require('../miscellaneous/errorHandler');


/*============ USERS ============*/

/*=== GET ALL USERS ===*/
exports.getAllUsers = async (_req, res) => {
    try {
        const users = await User.find({}, 'id email pseudo');

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
        let user = await User.findById(userId, { _id: 1, email: 1, pseudo: 1 });

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
