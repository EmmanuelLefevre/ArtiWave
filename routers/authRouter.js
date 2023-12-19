/*=======================================*/
/*============ authRouter.js ============*/
/*=======================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');

const allowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');

const authController = require('../controllers/authController');

const InternalServerError = require('../_errors/internalServerError');
const InvalidRequestError = require('../_errors/invalidRequestError');
const ValidationError = require('../_errors/validationError');

const { validationResult } = require('express-validator');
const userValidationRule = require('../_validation/validators/userValidator');

const { authLogs } = require('../_logs/auth/authLogger');


/*============ ROUTE FOR AUTHENTIFICATION ============*/

/*=== LOGIN ===*/
class AuthRouterHandler {
    static init() {
        // Express router
        const AuthRouter = express.Router();
        // Middleware request logs
        AuthRouter.use(authLogs);

        AuthRouter.route('/')
            .all(allowedCurrentMethodCheck(['POST']))
            .post([
                userValidationRule,
                AuthRouterHandler.validateRequest,
                AuthRouterHandler.loginHandler
            ]);

        return AuthRouter;
    }

    static validateRequest(req, res, next) {
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
            if (err instanceof InvalidRequestError) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            else if (err instanceof ValidationError) {
                return res.status(err.statusCode).json(err.getErrorResponse());
            }
            else {
                throw new InternalServerError();
            }
        }
    }

    static async loginHandler(req, res) {
        try {
            await authController.login(req, res);
        }
        catch (err) {
            if (err instanceof InternalServerError) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            else {
                return new InternalServerError();
            }
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AuthRouterHandler.init();
