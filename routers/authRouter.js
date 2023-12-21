/*=======================================*/
/*============ authRouter.js ============*/
/*=======================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');

// Controller
const AuthController = require('../controllers/authController');

// Middleware
const AllowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');

// Validation
const { validationResult } = require('express-validator');
const UserValidationRules = require('../_validation/validators/userValidator');

// Errors
const InternalServerError = require('../_errors/internalServerError');
const InvalidRequestError = require('../_errors/invalidRequestError');
const ValidationError = require('../_errors/validationError');

// Logs
const { authLogs } = require('../_logs/auth/authLogger');


/*============ EXPRESS ROUTE FOR AUTHENTIFICATION ============*/

/*=== LOGIN ===*/
class AuthRouter {
    static init() {
        // Express router
        const authRouter = express.Router();
        // Middleware auth requests logs
        authRouter.use(authLogs);

        authRouter.route('/')
            .all(AllowedCurrentMethodCheck(['POST']))
            .post([
                UserValidationRules,
                AuthRouter.#validateRequest,
                // Successful validation, proceed
                AuthController.login
            ]);

        return authRouter;
    }

    static #validateRequest(req, _res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
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
            else {
                throw new InternalServerError();
            }
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AuthRouter.init();
