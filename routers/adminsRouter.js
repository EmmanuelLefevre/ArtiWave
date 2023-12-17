/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { validationResult } = require('express-validator');

const adminsController = require('../controllers/adminsController');

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
router.delete('/delete_all_users',
    async (req, res) => {

    try {
        await adminsController.deleteAllUsers(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== DELETE ALL ARTICLES ===*/
router.delete('/delete_all_articles',
    async (req, res) => {

    try {
        await adminsController.deleteAllArticles(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== DELETE ALL ARTICLES BY USER ===*/
router.delete('/delete_all_articles/:id',
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
});


/*=== INVERT USER ROLE ===*/
router.patch('/invert_user_role/:id',
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
});


/*============ EXPORT MODULE ============*/
module.exports = router;