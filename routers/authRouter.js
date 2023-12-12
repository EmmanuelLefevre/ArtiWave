/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { validationResult } = require('express-validator');

const authController = require('../controllers/authController');
const { registerLimiter, loginLimiter } = require('../middleware/rateLimiter');

const ErrorHandler = require('../miscellaneous/errorHandler');
const ValidationErrorHandler = require('../miscellaneous/validationErrorHandler');
const emailValidationRule = require('../_validators/emailValidator');
const passwordValidationRules = require('../_validators/passwordValidator');
const pseudoValidationRules = require('../_validators/pseudoValidator');

const { authLogs } = require('../_logs/auth/authLogger');


/*============ EXPRESS ROUTER ============*/
let router = express.Router();


/*============ MIDDLEWARE REQUEST LOGS ============*/
router.use(authLogs);


/*============ ROUTES FOR AUTHENTIFICATION ============*/

/*=== REGISTER ===*/
router.post('/register', [
    emailValidationRule,
    passwordValidationRules,
    pseudoValidationRules,
    registerLimiter,
    (req, res, next) => {
        try {
            // Check presence of parameters email && password && pseudo
            const { email, password, pseudo } = req.body;

            if (!email || !password || !pseudo) {
                return res.status(400).json({ message: 'Missing or empty parameter!' });
            }

            // Pass to validation middleware
            next();
        }
        catch (err) {
            return ErrorHandler.sendInternalServerError(res, err);
        };
    }
], async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return ValidationErrorHandler.handle(res, errors);
        }

        await authController.register(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== LOGIN ===*/
router.post('/login', [
    emailValidationRule,
    loginLimiter,
    (req, res, next) => {
        try {
            // Check presence of parameters email && password
            const { email, password } = req.body;

            if (!email || !password ) {
                return res.status(400).json({ message: 'Missing or empty parameter!' });
            }

            // Pass to validation middleware
            next();
        }
        catch (err) {
            return ErrorHandler.sendInternalServerError(res, err);
        };
    }
], async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return ValidationErrorHandler.handle(res, errors);
        }

        await authController.login(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*============ EXPORT MODULE ============*/
module.exports = router;