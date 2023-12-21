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
            const usersToDelete = await User.find({
                roles: { $ne: 'admin' }
            });
            if (usersToDelete.length === 0) {
                throw new UserNotFoundError();
            }

            // Delete all users except admin
            const usersIdsToDelete = usersToDelete.map(user => user._id);
            return await Promise.all([
                User.deleteMany({ _id: { $in: usersIdsToDelete } }),
                Article.deleteMany({ author: { $in: usersIdsToDelete } })
            ]);
        } catch (_err) {
            throw new InternalServerError();
        }
    }

    /*=== DELETE ALL ARTICLES EXCEPT THOSE OWNED BY ADMIN ===*/
    static deleteAllArticles(adminId) {
        return new Promise((resolve, reject) => {
            console.log(adminId);
            Article.find({
                author: { $ne: adminId}
            })
            .then(articlesToDelete => {
                if (articlesToDelete.length === 0) {
                    reject(new ArticleNotFoundError());
                    return;
                }
                resolve(articlesToDelete);
            })
            .catch(_err => {
                reject(new InternalServerError());
            });
        })
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AdminRepository;


// class AdminRepository {
//     static findNonAdminsUsers() {
//         return new Promise((resolve, reject) => {
//             User.find({
//                 roles: { $ne: 'admin' }
//             })
//                 .then(usersToDelete => {
//                     if (usersToDelete.length === 0) {
//                         reject(new UserNotFoundError());
//                     }
//                     resolve(usersToDelete);
//                 })
//                 .catch(_err => {
//                     reject(new InternalServerError());
//                 })
//         });
//     }
// }
