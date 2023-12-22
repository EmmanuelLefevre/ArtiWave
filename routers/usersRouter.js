/*========================================*/
/*============ usersRouter.js ============*/
/*========================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');

// Controller
const UsersController = require('../controllers/usersController');

// Middlewares
const AccountCheck = require('../middleware/accountCheck');
const AllowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');
const JwtCheck = require('../middleware/jwtCheck');
const PremiumCheck = require('../middleware/premiumCheck');
const ValidateURIParam = require('../_validation/URI/validateURIParam');
const { RegisterLimiter } = require('../middleware/rateLimiter');

// Validation
const { validationResult } = require('express-validator');
const UserValidationRules = require('../_validation/validators/userValidator');

// Errors
const InternalServerError = require('../_errors/internalServerError');
const InvalidRequestError = require('../_errors/invalidRequestError');
const ValidationError = require('../_errors/validationError');

// Logs
const { usersLogs } = require('../_logs/users/usersLogger');


/*============ EXPRESS ROUTES FOR USERS ============*/

class UsersRouter {
    static init() {
        // Express router
        const usersRouter = express.Router();
        // Middleware users requests logs
        usersRouter.use(usersLogs);

        /*=== REGISTER ===*/
        usersRouter.route('/register')
            .all(AllowedCurrentMethodCheck(['POST']))
            .post(
                UserValidationRules,
                UsersRouter.#validateRegister,
                RegisterLimiter,
                (req, res, next) => {
                    try {
                        // Successful validation, proceed
                        UsersController.register(req, res, next);
                    }
                    catch (err) {
                        // next(new InternalServerError());
                        throw new InternalServerError();
                    }
                }
        );

        /*=== GET ALL USERS ===*/
        usersRouter.route('/')
            .all(AllowedCurrentMethodCheck(['GET']))
            .get(
                JwtCheck,
                PremiumCheck,
                (req, res, next) => {
                    try {
                        // Successful validation, proceed
                        UsersController.getAllUsers(req, res, next);
                    }
                    catch (err) {
                        // next(new InternalServerError());
                        throw new InternalServerError();
                    }
                }
        );

        /*=== GET SINGLE USER ===*/
        usersRouter.route('/:id')
            .all(AllowedCurrentMethodCheck(['GET']))
            .get(
                AccountCheck,
                JwtCheck,
                ValidateURIParam('id'),
                UsersRouter.#validateURIParam,
                (req, res, next) => {
                    try {
                        // Successful validation, proceed
                        UsersController.getUser(req, res, next);
                    }
                    catch (err) {
                        // next(new InternalServerError());
                        throw new InternalServerError();
                    }
                }
        );

        /*=== UPDATE USER ===*/
        usersRouter.route('/update/:id')
            .all(AllowedCurrentMethodCheck(['PATCH']))
            .patch(
                JwtCheck,
                ValidateURIParam('id'),
                UsersRouter.#validateURIParam,
                UsersRouter.#validateUpdateUser,
                UserValidationRules,
                (req, res, next) => {
                    try {
                        // Successful validation, proceed
                        UsersController.updateUser(req, res, next);
                    }
                    catch (err) {
                        // next(new InternalServerError());
                        throw new InternalServerError();
                    }
                }
        );

        /*=== DELETE USER ===*/
        usersRouter.route('/delete/:id')
            .all(AllowedCurrentMethodCheck(['DELETE']))
            .delete(
                JwtCheck,
                ValidateURIParam('id'),
                UsersRouter.#validateURIParam,
                (req, res, next) => {
                    try {
                        // Successful validation, proceed
                        UsersController.deleteUser(req, res, next);
                    }
                    catch (err) {
                        // next(new InternalServerError());
                        throw new InternalServerError();
                    }
                }
        );

        return usersRouter;
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
            throw new InternalServerError();
        }
    }

    static #validateRegister(req, _res, next) {
        try {
            // Check presence of data email && password && nickname
            const { email, password, nickname } = req.body;

            if (!email || !password || !nickname) {
                throw new InvalidRequestError();
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array());
            }

            next();
        }
        catch (err) {
            if (err instanceof InvalidRequestError ||
                err instanceof ValidationError) {
                return next(err);
            }
            throw new InternalServerError();
        }
    }

    static #validateUpdateUser(req, res, next) {
        try {
            // Check presence of forbidden parameters roles || registeredAt || updatedAt
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
                    throw new InvalidRequestError();
                }
            }

            next();
        }
        catch (err) {
            if (err instanceof InvalidRequestError) {
                return next(err);
            }
            throw new InternalServerError();
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = UsersRouter.init();
