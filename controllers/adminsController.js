/*============ IMPORT USED MODULES ============*/
const User = require('../_models/IUser');
const Article = require('../_models/IArticle');
const ErrorHandler = require('../_errors/errorHandler');


/*============ ADMINS ============*/

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

        return res.status(200).json({ message: "User upgraded to certified!" });
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


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