/*========================================*/
/*============ usersRouter.js ============*/
/*========================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { validationResult } = require('express-validator');

const usersController = require('../controllers/usersController');

const { registerLimiter } = require('../middleware/rateLimiter');
const jwtCheck = require('../middleware/jwtCheck');
const accountCheck = require('../middleware/accountCheck');
const premiumCheck = require('../middleware/premiumCheck');
const allowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');

const ErrorHandler = require('../_errors/errorHandler');
const ValidationErrorHandler = require('../_validation/validationErrorHandler');
const validateURIParam = require('../_validation/URI/validateURIParam');
const userValidationRule = require('../_validation/validators/userValidator');
const expressSanitizer = require('express-sanitizer');

const { usersLogs } = require('../_logs/users/usersLogger');


/*============ EXPRESS ROUTER ============*/
let router = express.Router();


/*============ MIDDLEWARE REQUEST LOGS ============*/
router.use(usersLogs);


/*============ ROUTES FOR USERS ============*/

/*=== REGISTER ===*/
router.route('/register')
    .all(allowedCurrentMethodCheck(['POST']))
    .post([
        expressSanitizer(),
        (req, _res, next) => {
            // Sanitize individual fields
            req.body.email = req.sanitize(req.body.email);
            req.body.nickname = req.sanitize(req.body.nickname);
            req.body.password = req.sanitize(req.body.password);
            next();
        },
        userValidationRule,
        (req, res, next) => {
            try {
                // Check presence of data email && password && nickname
                const { email, password, nickname } = req.body;

                if (!email || !password || !nickname) {
                    return res.status(400).json({ message: 'Invalid request!' });
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

                console.log(req.body);

                // Validation successful, proceed with registration
                await usersController.register(req, res);
            }
            catch (err) {
                return ErrorHandler.sendInternalServerError(res, err);
            }
        }
    ]);


/*=== GET ALL USERS ===*/
router.route('/')
    .all(allowedCurrentMethodCheck(['GET']))
    .get([
        jwtCheck,
        premiumCheck,
        async (req, res) => {
            try {
                await usersController.getAllUsers(req, res);
            }
            catch (err) {
                return ErrorHandler.sendInternalServerError(res, err);
            }
        }
    ]);


/*=== GET SINGLE USER ===*/
router.route('/:id')
    .all(allowedCurrentMethodCheck(['GET']))
    .get([
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
        }
    ]);


/*=== UPDATE USER ===*/
router.route('/:id')
    .all(allowedCurrentMethodCheck(['PATCH']))
    .patch([
        jwtCheck,
        validateURIParam('id'),
        // Custom validation rules
        userValidationRule,
        (req, res, next) => {
            try {
                // Check presence of forbidden paramaters roles || registeredAt || updatedAt
                const params = ['roles', 'registeredAt', 'updatedAt'];
                const forbiddenParams = Object.keys(req.body).filter(param => params.includes(param));

                if (forbiddenParams.length > 0) {
                    const errorMessage = `These parameters can't be modified: ${forbiddenParams.join(' and ')}`;
                    return res.status(400).json({ message: errorMessage });
                }

                // Check presence of at least parameter email || nickname || password
                if (req.method === 'PATCH') {
                    const allowedProperties = ['email', 'nickname', 'password'];
                    const isValidUpdate = Object.keys(req.body).some(prop => allowedProperties.includes(prop));

                    if (!isValidUpdate) {
                        return res.status(400).json({ message: 'Invalid request!' });
                    }
                }

                // Pass to validation middleware
                next();
            }
            catch (err) {
                return ErrorHandler.sendInternalServerError(res, err);
            }
        },
        async (req, res) => {
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
        }
    ]);


/*=== DELETE USER ===*/
router.route('/:id')
    .all(allowedCurrentMethodCheck(['DELETE']))
    .delete([
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
        }
    ]);


/*============ EXPORT MODULE ============*/
module.exports = router;
