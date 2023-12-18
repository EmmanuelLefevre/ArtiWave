/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { validationResult } = require('express-validator');

const articlesController = require('../controllers/articlesController');
const allowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');

const { createArticleLimiter } = require('../middleware/rateLimiter');
const jwtCheck = require('../middleware/jwtCheck');
const accountCheck = require('../middleware/accountCheck');
const premiumCheck = require('../middleware/premiumCheck');

const ErrorHandler = require('../_errors/errorHandler');
const ValidationErrorHandler = require('../_validation/validationErrorHandler');
const validateURIParam = require('../_validation/URI/validateURIParam');
const articleValidationRules = require('../_validation/validators/articleValidator');

const { articlesLogs } = require('../_logs/articles/articlesLogger');


/*============ EXPRESS ROUTER ============*/
let router = express.Router();


/*============ MIDDLEWARE REQUEST LOGS ============*/
router.use(articlesLogs);


/*============ ROUTES FOR ARTICLES ============*/

/*=== CREATE ARTICLE ===*/
router.route('/')
    .all(allowedCurrentMethodCheck(['POST']))
    .post([
        jwtCheck,
        premiumCheck,
        articleValidationRules(),
        createArticleLimiter,
        (req, res, next) => {
            try {
                // Check presence of data title && content
                const { title, content } = req.body;

                if (!title || !content ) {
                    return res.status(400).json({ message: 'Invalid request!' });
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

                await articlesController.createArticle(req, res);
            }
            catch (err) {
                return ErrorHandler.sendInternalServerError(res, err);
            }
        }
    ]);


/*=== GET ALL ARTICLES ===*/
router.route('/')
    .all(allowedCurrentMethodCheck(['GET']))
    .get([
        jwtCheck,
        async (req, res) => {
            try {
                await articlesController.getAllArticles(req, res);
            }
            catch (err) {
                return ErrorHandler.sendInternalServerError(res, err);
            }
        }
    ]);


/*=== GET SINGLE ARTICLE ===*/
router.route('/:id')
    .all(allowedCurrentMethodCheck(['GET']))
    .get([
        jwtCheck,
        validateURIParam('id'),
        async (req, res) => {
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
        }
    ]);


/*=== GET ARTICLES BY USER ===*/
router.route('/user/:userId')
    .all(allowedCurrentMethodCheck(['GET']))
    .get([
        jwtCheck,
        accountCheck,
        validateURIParam('userId'),
        async (req, res) => {
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
        }
    ]);



/*=== UPDATE ARTICLE ===*/
router.route('/:id')
    .all(allowedCurrentMethodCheck(['PATCH']))
    .patch([
        jwtCheck,
        validateURIParam('id'),
        articleValidationRules(),
        (req, res, next) => {
            try {
                // Check presence of forbidden paramaters author || createdAt || updatedAt
                const params = ['author', 'createdAt', 'updatedAt'];
                const forbiddenParams = Object.keys(req.body).filter(param => params.includes(param));

                if (forbiddenParams.length > 0) {
                    const errorMessage = `These parameters can't be modified: ${forbiddenParams.join(' and ')}`;
                    return res.status(400).json({ message: errorMessage });
                }

                // Check presence of at least parameter title || content
                if (req.method === 'PATCH') {
                    const allowedProperties = ['title', 'content'];
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

                await articlesController.updateArticle(req, res);
            }
            catch (err) {
                return ErrorHandler.sendInternalServerError(res, err);
            }
        }
    ]);

/*=== DELETE ARTICLE ===*/
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

                await articlesController.deleteArticle(req, res);
            }
            catch (err) {
                return ErrorHandler.sendInternalServerError(res, err);
            }
        }
    ]);


/*============ EXPORT MODULE ============*/
module.exports = router;
