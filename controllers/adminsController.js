/*============ IMPORT USED MODULES ============*/
const User = require('../_models/IUser');
const Article = require('../_models/IArticle');
const ErrorHandler = require('../_errors/errorHandler');

const { invertRoleResponseValidation } = require('../_validation/responses/invertRoleResponseValidation');


/*============ ADMINS ============*/

/*=== DELETE ALL USERS ===*/
exports.deleteAllUsers = async (_req, res) => {

    try {
        // Get non-admin users to delete
        const usersToDelete = await User.find({
            roles: { $ne: 'admin' }
        });

        // No users to delete
        if (usersToDelete.length === 0) {
            return ErrorHandler.handleUserNotFound(res);
        }

        // Extract users IDs from usersToDelete
        const usersIdsToDelete = usersToDelete.map(user => user._id);

        // Delete all users except admin
        await User.deleteMany({ _id: { $in: usersIdsToDelete } });

        // Cascade delete articles except those owned by admin
        await Article.deleteMany({ author: { $in: usersIdsToDelete } });

        return res.sendStatus(204);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== DELETE ALL ARTICLES ===*/
exports.deleteAllArticles = async (req, res) => {

    try {
        // Get non-admin articles to delete
        const articlesToDelete = await Article.find({
            author: { $ne: req.userId}
        });

        // No articles to delete
        if (articlesToDelete.length === 0) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        // Extract articles IDs from articlesToDelete
        const articlesIdsToDelete = articlesToDelete.map(article => article._id);

        // Delete all articles except those from admin
        await Article.deleteMany({ _id: { $in: articlesIdsToDelete } });

        return res.sendStatus(204);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== DELETE ALL ARTICLES BY USER ===*/
exports.deleteAllArticlesByUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // Check user exists
        const user = await User.findById(userId);
        if (!user) {
            return ErrorHandler.handleUserNotFound(res);
        }

        // No articles to delete
        const articlesToDelete = await Article.find({ author: userId });
        if (articlesToDelete.length === 0) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        await Article.deleteMany({ author: userId });

        return res.sendStatus(204);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== INVERT USER ROLE ===*/
exports.invertUserRole = async (req, res) => {
    const userId = req.params.id;

    try {
        // Check user exists
        const user = await User.findById(userId);
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
