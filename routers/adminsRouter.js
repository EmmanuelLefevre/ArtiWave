/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { validationResult } = require('express-validator');

const adminsController = require('../controllers/adminsController');

const jwtCheck = require('../middleware/jwtCheck');

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
router.delete('/admins/delete_all_users',
    jwtCheck,
    async (req, res) => {

    try {
        await adminsController.deleteAllUsers(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== DELETE ALL ARTICLES ===*/
router.delete('/admins/delete_all_articles',
    jwtCheck,
    async (req, res) => {

    try {
        await adminsController.deleteAllArticles(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== UPGRADE USER ROLE ===*/
router.patch('/admins/upgrade_user-role/:id',
    jwtCheck,
    validateURIParam('id'),
    async (req, res) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return ValidationErrorHandler.handle(res, errors);
        }

        await adminsController.upgradeUserRole(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*============ EXPORT MODULE ============*/
module.exports = router;