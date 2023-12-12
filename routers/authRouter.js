/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { validationResult } = require('express-validator');

const authController = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');

const ErrorHandler = require('../miscellaneous/errorHandler');
const ValidationErrorHandler = require('../miscellaneous/validationErrorHandler');
const emailValidationRule = require('../_validators/emailValidator');


const { authLogs } = require('../_logs/auth/authLogger');


/*============ EXPRESS ROUTER ============*/
let router = express.Router();


/*============ MIDDLEWARE REQUEST LOGS ============*/
router.use(authLogs);


/*============ ROUTES FOR AUTHENTIFICATION ============*/

/*=== LOGIN ===*/
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user account
 *     tags:
 *       - Authentification
 *     requestBody:
 *       description: User details to connect
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User connected.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 message:
 *                   type: string
 *       '400':
 *         description: Incorrect query due to missing param.
 *       '401':
 *         description: Incorrect email or password.
 *       '429':
 *         description: Too many connection attempts, please try again later.
 *       '500':
 *         description: Server error while connecting account.
 */
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