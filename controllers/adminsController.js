/*============ IMPORT USED MODULES ============*/
const User = require('../_models/IUser');
const Article = require('../_models/IArticle');
const ErrorHandler = require('../_errors/errorHandler');

const { invertRoleResponseValidation } = require('../_validation/responses/invertRoleResponseValidation');


/*============ ADMINS ============*/

/*=== DELETE ALL USERS ===*/
exports.deleteAllUsers = async (req, res) => {

    try {
        // Delete all users except admin
        await User.deleteMany({ roles: { $ne: 'admin' } });

        // Cascade delete articles except those owned by admin
        await Article.deleteMany({ author: { $ne: req.userId } });

        return res.sendStatus(204);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== DELETE ALL ARTICLES ===*/
exports.deleteAllArticles = async (req, res) => {

    try {
        // Delete all articles except those from admin
        await Article.deleteMany({ author: { $ne: req.userId } });

        return res.sendStatus(204);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}

/*=== INVERT USER ROLE ===*/
exports.invertUserRole = async (req, res) => {
    let userId = req.params.id;

    try {
        let user = await User.findById(userId);

        if (!user) {
            return ErrorHandler.handleUserNotFound(res);
        }

        // Check current user's role
        let newRole = (user.roles === 'user') ? 'certified' : 'user';

        // Set roles on certified
        await User.updateOne({ _id: userId }, { $set: { roles: newRole  } });

        // Fetch the updated user by its ID
        const updatedUser = await User.findById(userId);

        // Set message on new role
        const message = (newRole === 'certified') ? "User upgraded to certified role!" : "User downgraded to user role!";

        // Set response and determine the response validation schema
        const responseObject = {
            data: [
                {
                    _id: user._id,
                    nickname: user.nickname,
                    roles: updatedUser.roles
                }
            ],
            message: message
        };

        // Validate response format
        try {
            await invertRoleResponseValidation.validate(responseObject, { abortEarly: false });
        }
        catch (validationError) {
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return updated user
        return res.status(200).json(responseObject);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}
