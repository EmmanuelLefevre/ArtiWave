/*=======================================*/
/*============ authRouter.js ============*/
/*=======================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { validationResult } = require('express-validator');

const authController = require('../controllers/authController');
const allowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');

const InternalServerError = require('../_errors/internalServerError');
const InvalidRequestError = require('../_errors/invalidRequestError');
const ValidationError = require('../_errors/validationError');

const userValidationRule = require('../_validation/validators/userValidator');

const { authLogs } = require('../_logs/auth/authLogger');


/*============ EXPRESS ROUTER ============*/
let router = express.Router();


/*============ MIDDLEWARE REQUEST LOGS ============*/
router.use(authLogs);


/*============ ROUTES FOR AUTHENTIFICATION ============*/

/*=== LOGIN ===*/
router.route('/')
    .all(allowedCurrentMethodCheck(['POST']))
    .post([
        userValidationRule,
        (req, res, next) => {
            try {
                // Check presence of data email && password
                const { email, password } = req.body;

                if (!email || !password ) {
                    throw new InvalidRequestError();
                }

                // Pass to validation middleware
                next();
            }
            catch (err) {
                if (err instanceof InvalidRequestError) {
                    return res.status(err.statusCode).json({ message: err.message });
                }
                else {
                    throw new Error('Unexpected Error!');
                }
            }
        },
        async (req, res) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    throw new ValidationError(errors.array(), 422);
                }

                await authController.login(req, res);
            }
            catch (err) {
                if (err instanceof ValidationError)

                    return res.status(err.statusCode).json(err.getErrorResponse());
                else {
                    throw new Error('Unexpected Error!');
                }
            }
        }
    ]);


/*============ EXPORT MODULE ============*/
module.exports = router;
