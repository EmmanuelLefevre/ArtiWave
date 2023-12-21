/*=========================================*/
/*============ adminRouter.js ============*/
/*=========================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');

const AdminController = require('../controllers/adminController');

const allowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');
const validateURIParam = require('../_validation/URI/validateURIParam');
const { validationResult } = require('express-validator');

const InternalServerError = require('../_errors/internalServerError');
const ValidationError = require('../_errors/validationError');

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
            .all(allowedCurrentMethodCheck(['DELETE']))
            .delete((req, res) => {
                AdminController.deleteAllUsers(req, res);
            });

        /*=== DELETE ALL ARTICLES EXCEPT THOSE OWNED BY ADMIN ===*/
        adminRouter.route('/delete_all_articles')
            .all(allowedCurrentMethodCheck(['DELETE']))
            .delete((req, res) => {
                AdminController.deleteAllArticles(req, res);
            });

        /*=== DELETE ALL ARTICLES BY USER ===*/
        adminRouter.route('/delete_all_articles/:id')
            .all(allowedCurrentMethodCheck(['DELETE']))
            .delete((req, res) => [
                validateURIParam('id'),
                AdminRouter.#validateURIParam,
                AdminController.deleteAllArticlesByUser(req, res)
            ]);

        /*=== INVERT USER ROLE ===*/
        adminRouter.route('/invert_user_role/:id')
            .all(allowedCurrentMethodCheck(['PATCH']))
            .patch((req, res) => [
                validateURIParam('id'),
                AdminRouter.#validateURIParam,
                AdminController.invertUserRole(req, res)
            ]);

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
            else {
                throw new InternalServerError();
            }
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AdminRouter.init();
