/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { validationResult } = require('express-validator');

const adminsController = require('../controllers/adminsController');
const allowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');

const ErrorHandler = require('../_errors/errorHandler');
const ValidationErrorHandler = require('../_validation/validationErrorHandler');
const validateURIParam = require('../_validation/URI/validateURIParam');

const { adminsLogs } = require('../_logs/admins/adminsLogger');


/*============ EXPRESS ROUTER ============*/
let router = express.Router();


/*============ MIDDLEWARE REQUEST LOGS ============*/
router.use(adminsLogs);


/*============ ROUTES FOR ADMINS============*/

/*=== DELETE ALL USERS ===*/
router.route('/delete_all_users')
    .all(allowedCurrentMethodCheck(['DELETE']))
    .delete(async (req, res) => {
        try {
            await adminsController.deleteAllUsers(req, res);
        }
        catch (err) {
            return ErrorHandler.sendInternalServerError(res, err);
        }
    });


/*=== DELETE ALL ARTICLES ===*/
router.route('/delete_all_articles')
    .all(allowedCurrentMethodCheck(['DELETE']))
    .delete(async (req, res) => {
        try {
            await adminsController.deleteAllArticles(req, res);
        }
        catch (err) {
            return ErrorHandler.sendInternalServerError(res, err);
        }
    });


/*=== DELETE ALL ARTICLES BY USER ===*/
router.route('/delete_all_articles/:id')
    .all(allowedCurrentMethodCheck(['DELETE']))
    .delete(
        validateURIParam('id'),
        async (req, res) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return ValidationErrorHandler.handle(res, errors);
                }

                await adminsController.deleteAllArticlesByUser(req, res);
            }
            catch (err) {
                return ErrorHandler.sendInternalServerError(res, err);
            }
        }
    );


/*=== INVERT USER ROLE ===*/
router.route('/invert_user_role/:id')
    .all(allowedCurrentMethodCheck(['PATCH']))
    .patch([
        validateURIParam('id'),
        async (req, res) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return ValidationErrorHandler.handle(res, errors);
                }

                await adminsController.invertUserRole(req, res);
            }
            catch (err) {
                return ErrorHandler.sendInternalServerError(res, err);
            }
        }
    ]);


/*============ EXPORT MODULE ============*/
module.exports = router;