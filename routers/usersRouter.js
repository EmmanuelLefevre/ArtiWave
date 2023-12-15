/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { validationResult } = require('express-validator');

const usersController = require('../controllers/usersController');

const { registerLimiter } = require('../middleware/rateLimiter');
const jwtCheck = require('../middleware/jwtCheck');
const accountCheck = require('../middleware/accountCheck');
const premiumCheck = require('../middleware/premiumCheck');

const ErrorHandler = require('../_errors/errorHandler');
const ValidationErrorHandler = require('../_validation/validationErrorHandler');
const validateURIParam = require('../_validation/URI/validateURIParam');
const userValidationRule = require('../_validation/validators/userValidator');

const { usersLogs } = require('../_logs/users/usersLogger');


/*============ EXPRESS ROUTER ============*/
let router = express.Router();


/*============ MIDDLEWARE REQUEST LOGS ============*/
router.use(usersLogs);


/*============ ROUTES FOR USERS ============*/

/*=== REGISTER ===*/
router.post('/register', [
    userValidationRule,
    (req, res, next) => {

        try {
            // Check presence of parameters email && password && nickname
            const { email, password, nickname } = req.body;

            if (!email || !password || !nickname) {
                return res.status(400).json({ message: 'Missing or empty parameter!' });
            }

            // Pass to validation middleware
            next();
        }
        catch (err) {
            return ErrorHandler.sendInternalServerError(res, err);
        }
    },
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return ValidationErrorHandler.handle(res, errors);
            }

            // Pass to registerLimiter middleware
            next();
        }
        catch (err) {
            return ErrorHandler.sendInternalServerError(res, err);
        }
    },
    registerLimiter,
    async (req, res) => {
        try {
            // Validation successful, proceed with registration
            await usersController.register(req, res);
        }
        catch (err) {
            return ErrorHandler.sendInternalServerError(res, err);
        }
    }
]);


/*=== GET ALL USERS ===*/
router.get('/',
    jwtCheck,
    premiumCheck,
    async (req, res) => {

    try {
        await usersController.getAllUsers(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== GET SINGLE USER ===*/
router.get('/:id',
    accountCheck,
    jwtCheck,
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
    jwtCheck,
    validateURIParam('id'),
    // Custom validation rules
    userValidationRule,
    (req, res, next) => {

        try {
            // Check presence of at least parameter email || nickname || password
            if (req.method === 'PATCH') {
                const allowedProperties = ['email', 'nickname', 'password'];
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
    jwtCheck,
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
