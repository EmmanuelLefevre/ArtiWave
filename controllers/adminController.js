/*============================================*/
/*============ adminController.js ============*/
/*============================================*/


/*============ IMPORT USED MODULES ============*/
const AdminRepository = require('../repositories/adminRepository');

const ArticleNotFoundError = require('../_errors/articleNotFoundError');
const InternalServerError = require('../_errors/internalServerError');
const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ ADMINS ============*/

class AdminController {
    /*=== DELETE NON ADMIN USERS AND THEIR OWNED ARTICLES ===*/
    static deleteAllUsers(_req, res, next) {
        try {
            AdminRepository.deleteNonAdminsUsersAndTheirOwnedArticles()
            .then(() => {
                return res.sendStatus(204);
            })
            .catch(err => {
                if (err instanceof UserNotFoundError) {
                    next(err);
                }
                else {
                    next(new InternalServerError());
                }
            });
        }
        catch (err) {
            if (err instanceof InternalServerError ||
                err instanceof UserNotFoundError) {
                return next(err);
            }
            else {
                throw new InternalServerError();
            }
        }
    }

    /*=== DELETE ALL ARTICLES EXCEPT THOSE OWNED BY ADMIN ===*/
    static deleteAllArticles(req, res, next) {
        try {
            const adminId = req.user.id;
            console.log(adminId);
            AdminRepository.deleteAllArticles(adminId)
            .then((articlesToDelete)  => {
                console.log(articlesToDelete);
                return res.sendStatus(204);
            })
            .catch(err => {
                if (err instanceof ArticleNotFoundError) {
                    throw new ArticleNotFoundError();
                }
                else {
                    next(new InternalServerError());
                }
            });
        }
        catch (err) {
            if (err instanceof InternalServerError) {
                return next(err);
            }
            else {
                throw new InternalServerError();
            }
        }
    }

    /*=== DELETE ALL ARTICLES BY USER ===*/
    static deleteAllArticlesByUser(req, res, next) {
        // try {
        //     const userId = req.params.id;

        //     AdminRepository.findUserByEmail(email)
        // }
        // catch (err) {
        //     if (err instanceof InternalServerError) {
        //         return next(err);
        //     }
        //     else {
        //         throw new InternalServerError();
        //     }
        // }
    }

    /*=== INVERT USER ROLE ===*/
    static invertUserRole(req, res, next) {
        // try {
        //     const userId = req.params.id;

        //     AdminRepository.findUserByEmail(email)
        // }
        // catch (err) {
        //     if (err instanceof InternalServerError) {
        //         return next(err);
        //     }
        //     else {
        //         throw new InternalServerError();
        //     }
        // }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AdminController;


// const { invertRoleResponseValidation } = require('../_validation/responses/invertRoleResponseValidation');


