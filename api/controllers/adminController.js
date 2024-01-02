/*============================================*/
/*============ adminController.js ============*/
/*============================================*/


/*============ IMPORT USED MODULES ============*/
// Repositories
const AdminRepository = require('../repositories/adminRepository');
const UserRepository = require('../repositories/userRepository');

// Response validation
const { InvertRoleResponseValidation } = require('../_validation/responses/invertRoleResponseValidation');

// Errors
const ArticleNotFoundError = require('../_errors/articleNotFoundError');
const DeletionFailedError = require('../_errors/deletionFailedError');
const InternalServerError = require('../_errors/internalServerError');
const ResponseValidationError = require('../_errors/responseValidationError');
const UpdateFailedError = require('../_errors/updateFailedError');
const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ ADMINS ============*/

class AdminController {
    /*=== DELETE NON ADMIN USERS AND THEIR OWNED ARTICLES ===*/
    static async deleteAllUsers(_req, res, next) {
        try {
            // Get non-admin users to delete
            const usersToDelete = await AdminRepository.getNonAdminUsers();

            // No users to delete
            if (usersToDelete.length === 0) {
                throw new UserNotFoundError();
            }

            // Delete non-admin users and their owned articles
            await AdminRepository.deleteNonAdminsUsersAndTheirOwnedArticles(usersToDelete);

            // Response
            return res.sendStatus(204);
        }
        catch (err) {
            if (err instanceof DeletionFailedError ||
                err instanceof UserNotFoundError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*=== DELETE ALL ARTICLES EXCEPT THOSE OWNED BY ADMIN ===*/
    static async deleteAllArticles(req, res, next) {
        try {
            // Check if the user exists
            const user = await UserRepository.getUserById(req.userId);
            if (!user) {
                throw new UserNotFoundError();
            }

            // Delete all articles except those owned by admin
            await AdminRepository.deleteAllArticlesExceptThoseOwnedByAdmin(req.userId);

            // Response
            return res.sendStatus(204);
        }
        catch (err) {
            if (err instanceof ArticleNotFoundError ||
                err instanceof DeletionFailedError ||
                err instanceof UserNotFoundError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*=== DELETE ALL ARTICLES BY USER ===*/
    static async deleteAllArticlesByUser(req, res, next) {
        const userId = req.params.id;

        try {
            await AdminRepository.deleteAllArticlesByUser(userId);

            // Response
            return res.sendStatus(204);
        }
        catch (err) {
            if (err instanceof ArticleNotFoundError ||
                err instanceof DeletionFailedError ||
                err instanceof UserNotFoundError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*=== INVERT USER ROLE ===*/
    static async invertUserRole(req, res, next) {
        const userId = req.params.id;

        try {
            // Update user role
            const result = await AdminRepository.invertUserRole(userId);

            // Set message on new role
            const message = (result.newRole === 'certified') ? `User upgraded to "certified" role!` : `User downgraded to "user" role!`;

            // Set response and determine the response validation schema
            const responseObject = {
                data: [
                    {
                        _id: result.userId,
                        nickname: result.nickname,
                        roles: result.newRole
                    }
                ],
                message: message
            };

            // Validate response format
            try {
                await InvertRoleResponseValidation.validate(responseObject, { abortEarly: false });
            }
            catch (validationError) {
                throw new ResponseValidationError();
            }

            // Return updated user
            return res.status(200).json(responseObject);
        }
        catch (err) {
            if (err instanceof ResponseValidationError ||
                err instanceof UpdateFailedError ||
                err instanceof UserNotFoundError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AdminController;
