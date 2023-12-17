/*============ IMPORT USED MODULES ============*/
const User = require('../_models/IUser');
const Article = require('../_models/IArticle');
const ErrorHandler = require('../_errors/errorHandler');

const { upgradeRoleResponseValidation } = require('../_validation/responses/upgradeRoleResponseValidation');


/*============ ADMINS ============*/

/*=== DELETE ALL USERS ===*/
exports.deleteAllUsers = async (req, res) => {
    // Check if user has admin role
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Permission denied!" });
    }

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
    // Check if user has admin role
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Permission denied!" });
    }

    try {
        // Delete all articles except those from admin
        await Article.deleteMany({ author: { $ne: req.userId } });

        return res.sendStatus(204);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}

/*=== UPGRADE USER ROLE ===*/
exports.upgradeUserRole = async (req, res) => {
    // Check if user has admin role
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Permission denied!" });
    }

    let userId = req.params.id;

    try {
        let user = await User.findById(userId);

        if (!user) {
            return ErrorHandler.handleUserNotFound(res);
        }

        // Set roles on certified
        await User.updateOne({ _id: userId }, { $set: { roles: 'certified' } });

        // Fetch the updated user by its ID
        const updatedUser = await User.findById(userId);

        // Set response and determine the response validation schema
        const responseObject = {
            data: [
                {
                    _id: user._id,
                    nickname: user.nickname,
                    roles: updatedUser.roles
                }
            ]
        };

        // Add message property to the responseObject
        const message = "User upgraded to certified!";
        responseObject.message = message;

        // Validate response format
        try {
            await upgradeRoleResponseValidation.validate(responseObject, { abortEarly: false });
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
