/*============================================*/
/*============ adminRepository.js ============*/
/*============================================*/


/*============ IMPORT USED MODULES ============*/
// Models
const User = require('../models/IUser');
const Article = require('../models/IArticle');

// Articles
const ArticleNotFoundError = require('../_errors/articleNotFoundError');
const InternalServerError = require('../_errors/internalServerError');
const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ ADMIN REPOSITORY ============*/
class AdminRepository {

    /*=== DELETE NON ADMIN USERS AND THEIR OWNED ARTICLES ===*/
    static async deleteNonAdminsUsersAndTheirOwnedArticles() {
        try {
            // Get non-admin users to delete
            const usersToDelete = await User.find({ roles: { $ne: 'admin' } });

            // No users to delete
            if (usersToDelete.length === 0) {
                throw new UserNotFoundError();
            }

            // Extract users IDs from usersToDelete
            const usersIdsToDelete = usersToDelete.map(user => user._id);

            // Delete all users except admin
            await User.deleteMany({ _id: { $in: usersIdsToDelete } });

            // Cascade delete articles except those owned by admin
            await Article.deleteMany({ author: { $in: usersIdsToDelete } });
        }
        catch (err) {
            throw err;
        }
    }

    /*=== DELETE ALL ARTICLES EXCEPT THOSE OWNED BY ADMIN ===*/
    static async deleteAllArticlesExceptThoseOwnedByAdmin(userId) {
        try {
            // Get non-admin articles to delete
            const articlesToDelete = await Article.find({
                author: { $ne: userId }
            });

            // No articles to delete
            if (articlesToDelete.length === 0) {
                throw new ArticleNotFoundError();
            }

            // Extract articles IDs from articlesToDelete
            const articlesIdsToDelete = articlesToDelete.map(article => article._id);

            // Delete all articles except those from admin
            await Article.deleteMany({ _id: { $in: articlesIdsToDelete } });
        }
        catch (err) {
            throw err;
        }
    }

    /*=== DELETE ALL ARTICLES BY USER ===*/
    static async deleteAllArticlesByUser(userId) {
        try {
            // Check user exists
            const user = await User.findById(userId);
            if (!user) {
                throw new UserNotFoundError();
            }

            // No articles to delete
            const articlesToDelete = await Article.find({ author: userId });
            if (articlesToDelete.length === 0) {
                throw new ArticleNotFoundError();
            }

            // Delete all articles by user
            await Article.deleteMany({ author: userId });
        }
        catch (err) {
            throw err;
        }
    }

    /*=== INVERT USER ROLE ===*/
    static async invertUserRole(userId) {
        try {
            // Check user exists
            const user = await User.findById(userId);
            if (!user) {
                throw new UserNotFoundError();
            }

            // Check current user's role
            const newRole = (user.roles === 'user') ? 'certified' : 'user';

            // Update user role
            await User.updateOne({ _id: userId }, { $set: { roles: newRole } });

            return {
                userId: userId,
                nickname: user.nickname,
                newRole: newRole
            };
        }
        catch (err) {
            throw err;
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AdminRepository;
