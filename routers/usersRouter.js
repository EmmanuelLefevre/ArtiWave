/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { validationResult } = require('express-validator');

const usersController = require('../controllers/usersController');
const checkTokenMiddleware = require('../middleware/checkToken');

const ErrorHandler = require('../miscellaneous/errorHandler');
const ValidationErrorHandler = require('../miscellaneous/validationErrorHandler');
const validateURIParam = require('../miscellaneous/validateURIParam');

const emailValidationRule = require('../_validators/emailValidator');
const passwordValidationRules = require('../_validators/passwordValidator');
const pseudoValidationRules = require('../_validators/pseudoValidator');

const { usersLogs } = require('../_logs/users/usersLogger');


/*============ EXPRESS ROUTER ============*/
let router = express.Router();


/*============ MIDDLEWARE REQUEST LOGS ============*/
router.use(usersLogs);


/*============ ROUTES FOR USERS ============*/

/*=== GET ALL USERS ===*/
router.get('/',
    async (req, res) => {

    try {
        await usersController.getAllUsers(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== GET USER ===*/
router.get('/:id',
    checkTokenMiddleware,
    validateURIParam('id'),
    async (req, res) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return ValidationErrorHandler.handle(res, errors);
        }

        await usersController.getUser(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== UPDATE USER ===*/
router.patch('/:id', [
    checkTokenMiddleware,
    validateURIParam('id'),
    // Custom validation rules
    emailValidationRule,
    passwordValidationRules,
    pseudoValidationRules,
    (req, res, next) => {

        try {
            // Check presence of at least parameter email || pseudo || password
            if (req.method === 'PATCH') {
                const allowedProperties = ['email', 'pseudo', 'password'];
                const isValidUpdate = Object.keys(req.body).some(prop => allowedProperties.includes(prop));

                if (!isValidUpdate) {
                    return res.status(400).json({ message: 'Invalid update data!' });
                }
            }

            // Pass to validation middleware
            next();
        }
        catch (err) {
            return ErrorHandler.sendInternalServerError(res, err);
        }
    }
], async (req, res) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return ValidationErrorHandler.handle(res, errors);
        }

        await usersController.updateUser(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== DELETE USER ===*/
router.delete('/:id',
    checkTokenMiddleware,
    validateURIParam('id'),
    async (req, res) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return ValidationErrorHandler.handle(res, errors);
        }

        await usersController.deleteUser(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*============ EXPORT MODULE ============*/
module.exports = router;
