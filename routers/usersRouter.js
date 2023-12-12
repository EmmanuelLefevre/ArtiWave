/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { validationResult } = require('express-validator');

const usersController = require('../controllers/usersController');

const { registerLimiter } = require('../middleware/rateLimiter');
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

/*=== REGISTER ===*/
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Create user account
 *     description: Registers a new user with an email, password and pseudo.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User details to create
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
 *               pseudo:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 pseudo:
 *                   type: string
 *       '400':
 *         description: Incorrect query due to missing param.
 *       '409':
 *         description: Email or pseudo already used.
 *       '422':
 *         description: Incorrect query due to invalid URI or data.
 *       '429':
 *         description: Too many registration attempts, please try again later.
 *       '500':
 *         description: Server error while creating account.
 */
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

        await usersController.register(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});

/*=== GET ALL USERS ===*/
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       pseudo:
 *                         type: string
 *                       registeredAt:
 *                          type: string
 *                       updatedAt:
 *                          type: string
 *                 dataCount:
 *                   type: integer
 *                   description: Total count of users.
 *       '500':
 *         description: Server error while retrieving all users.
 */
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
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by Id
 *     description: Retrieve a user by their Id.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User Id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Single user retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     pseudo:
 *                       type: string
 *                     registeredAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       '404':
 *         description: User not found.
 *       '422':
 *         description: Incorrect query due to invalid URI or data.
 *       '500':
 *         description: Server error while retrieving a single user.
 */
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
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user by Id
 *     description: Update user details by their Id.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User Id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User details to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               pseudo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Single user updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Incorrect query due to missing param.
 *       '404':
 *         description: User not found.
 *       '422':
 *         description: Incorrect query due to invalid URI or data.
 *       '500':
 *         description: Server error while updating a single user.
 */
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
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by Id
 *     description: Delete a user by their Id.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User Id
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Single user deleted successfully.
 *       '404':
 *         description: User not found.
 *       '422':
 *         description: Incorrect query due to invalid URI or data.
 *       '500':
 *         description: Server error while deleting a single user.
 */
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
