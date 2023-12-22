/*=========================================*/
/*============ adminRouter.js ============*/
/*=========================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');

// Controller
const AdminController = require('../controllers/adminController');

// Middlewares
const AllowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');
const ValidateURIParam = require('../_validation/URI/validateURIParam');

// Validation
const { validationResult } = require('express-validator');

// Errors
const InternalServerError = require('../_errors/internalServerError');
const ValidationError = require('../_errors/validationError');

// Logs
const { adminsLogs } = require('../_logs/admins/adminsLogger');


/*============ EXPRESS ROUTES FOR ADMINS ============*/
class AdminRouter {
    static init() {
        // Express router
        const adminRouter = express.Router();
        // Middleware admins requests logs
        adminRouter.use(adminsLogs);

        /*=== DELETE NON ADMIN USERS AND THEIR OWNED ARTICLES ===*/
        adminRouter.route('/delete_all_users')
            .all(AllowedCurrentMethodCheck(['DELETE']))
            .delete(
                (req, res, next) => {
                    try {
                        AdminController.deleteAllUsers(req, res, next);
                    }
                    catch (err) {
                        next(new InternalServerError());
                    }
                }
        );

        /*=== DELETE ALL ARTICLES EXCEPT THOSE OWNED BY ADMIN ===*/
        adminRouter.route('/delete_all_articles')
            .all(AllowedCurrentMethodCheck(['DELETE']))
            .delete(
                (req, res, next) => {
                    try {
                        AdminController.deleteAllArticles(req, res, next);
                    }
                    catch (err) {
                        next(new InternalServerError());
                    }
                }
        );

        /*=== DELETE ALL ARTICLES BY USER ===*/
        adminRouter.route('/delete_all_articles/:id')
            .all(AllowedCurrentMethodCheck(['DELETE']))
            .delete(
                ValidateURIParam('id'),
                AdminRouter.#validateURIParam,
                (req, res, next) => {
                    try {
                        // Successful validation, proceed
                        AdminController.deleteAllArticlesByUser(req, res, next);
                    }
                    catch (err) {
                        next(new InternalServerError());
                    }
                }
        );

        /*=== INVERT USER ROLE ===*/
        adminRouter.route('/invert_user_role/:id')
            .all(AllowedCurrentMethodCheck(['PATCH']))
            .patch(
                ValidateURIParam('id'),
                AdminRouter.#validateURIParam,
                (req, res, next) => {
                    try {
                        // Successful validation, proceed
                        AdminController.invertUserRole(req, res, next);
                    }
                    catch (err) {
                        next(new InternalServerError());
                    }
                }
        );

        return adminRouter;
    }

    static #validateURIParam(req, _res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array());
            }

            next();
        }
        catch (err) {
            if (err instanceof ValidationError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AdminRouter.init();
