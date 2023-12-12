/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { validationResult } = require('express-validator');

const articlesController = require('../controllers/articlesController');

const { createArticleLimiter } = require('../middleware/rateLimiter');

const ErrorHandler = require('../miscellaneous/errorHandler');
const ValidationErrorHandler = require('../miscellaneous/validationErrorHandler');
const validateURIParam = require('../miscellaneous/validateURIParam');

const articleValidationRules = require('../_validators/articleValidator');

const { articlesLogs } = require('../_logs/articles/articlesLogger');


/*============ EXPRESS ROUTER ============*/
let router = express.Router();


/*============ MIDDLEWARE REQUEST LOGS ============*/
router.use(articlesLogs);


/*============ ROUTES FOR ARTICLES ============*/

/*=== CREATE ARTICLE ===*/
/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create an article
 *     description: Create an article with a title, content and author.
 *     tags:
 *       - Articles
 *     requestBody:
 *       description: Article details to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Article created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 author:
 *                   type: string
 *       '400':
 *         description: Incorrect query due to missing param.
 *       '409':
 *         description: Article already exists.
 *       '422':
 *         description: Incorrect query due to invalid URI or data.
 *       '429':
 *         description: Too many creation attempts, please try again later.
 *       '500':
 *         description: Server error while creating articles
 */
router.post('/', [
    articleValidationRules(),
    createArticleLimiter,
    (req, res, next) => {
        try {
            // Check presence of parameters title && content && author
            const { title, content, author } = req.body;

            if (!title || !content || !author) {
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

        await articlesController.createArticle(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== GET ALL ARTICLES ===*/
/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles
 *     description: Retrieve a list of all articles.
 *     tags:
 *       - Articles
 *     responses:
 *       '200':
 *         description: List of articles retrieved successfully.
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
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       author:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           pseudo:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *                 dataCount:
 *                   type: integer
 *                   description: Total count of articles.
 *       '500':
 *         description: Server error while retrieving all articles.
 */
router.get('/', async (req, res) => {
    try {
        await articlesController.getAllArticles(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== GET ARTICLE ===*/
/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Get article by Id
 *     description: Retrieve an article by its Id.
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Id of the article.
 *     responses:
 *       '200':
 *         description: Article retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 _id: string
 *                 title: string
 *                 content: string
 *                 author:
 *                   _id: string
 *                   pseudo: string
 *                 createdAt: string
 *                 updatedAt: string
 *       '404':
 *         description: Article not found.
 *       '422':
 *         description: Incorrect query due to invalid URI or data.
 *       '500':
 *         description: Internal Server Error.
 */
router.get('/:id', validateURIParam('id'), async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return ValidationErrorHandler.handle(res, errors);
        }

        await articlesController.getArticle(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== GET ARTICLES BY USER ===*/
/**
 * @swagger
 * /articles/user/{userId}:
 *   get:
 *     summary: Get articles by user
 *     description: Retrieve articles for a specific user.
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User Id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Articles from user retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: List of articles
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       author:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           pseudo:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *                 dataCount:
 *                   type: integer
 *                   description: Total count of articles.
 *       '400':
 *         description: Bad Request
 *       '422':
 *         description: Incorrect query due to invalid URI or data.
 *       '500':
 *         description: Server error while retrieving articles for a specific user.
 */
router.get('/user/:userId', validateURIParam('userId'), async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return ValidationErrorHandler.handle(res, errors);
        }

        await articlesController.getArticlesByUser(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});



/*=== UPDATE ARTICLE ===*/
/**
 * @swagger
 * /articles/{id}:
 *   patch:
 *     summary: Update article by Id
 *     description: Update article details by their ID.
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Article Id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Article details to update
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
 *         description: Incorrect query due to forbidden or missing param.
 *       '404':
 *         description: User not found.
 *       '422':
 *         description: Incorrect query due to invalid URI or data.
 *       '500':
 *         description: Server error while updating a single user.
 */
router.patch('/:id', [
    validateURIParam('id'),
    articleValidationRules(),
    (req, res, next) => {
        try {
            // Check presence of forbidden paramaters author || date
            const params = ['author', 'date'];
            const forbiddenParams = Object.keys(req.body).filter(param => params.includes(param));

            if (forbiddenParams.length > 0) {
                const errorMessage = `These parameters can't be modified: ${forbiddenParams.join(' and ')}${forbiddenParams.length > 1 ? '' : ''}!`;
                return res.status(400).json({ message: errorMessage });
            }

            // Check presence of at least parameter title || content
            if (req.method === 'PATCH') {
                const allowedProperties = ['title', 'content'];
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

        await articlesController.updateArticle(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*=== DELETE ARTICLE ===*/
/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Delete article by Id
 *     description: Delete a article by their Id.
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Article Id
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Single article deleted successfully.
 *       '404':
 *         description: Article not found.
 *       '422':
 *         description: Incorrect query due to invalid URI or data.
 *       '500':
 *         description: Server error while deleting a single article.
 */
router.delete('/:id', validateURIParam('id'), async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return ValidationErrorHandler.handle(res, errors);
        }

        await articlesController.deleteArticle(req, res);
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
});


/*============ EXPORT MODULE ============*/
module.exports = router;
