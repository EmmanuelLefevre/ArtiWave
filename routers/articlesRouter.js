/*===========================================*/
/*============ articlesRouter.js ============*/
/*===========================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');

// Controller
const articlesController = require('../controllers/articlesController');

// Middlewares
const AccountCheck = require('../middleware/accountCheck');
const AllowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');
const JwtCheck = require('../middleware/jwtCheck');
const PremiumCheck = require('../middleware/premiumCheck');
const ValidateURIParam = require('../_validation/URI/validateURIParam');
const { CreateArticleLimiter } = require('../middleware/rateLimiter');

// Validation
const { validationResult } = require('express-validator');
const ArticleValidationRules = require('../_validation/validators/articleValidator');

// Errors
const ErrorHandler = require('../_errors/errorHandler');
const ValidationErrorHandler = require('../_validation/validationErrorHandler');

// Logs
const { articlesLogs } = require('../_logs/articles/articlesLogger');


/*============ EXPRESS ROUTER ============*/
let router = express.Router();


/*============ MIDDLEWARE REQUEST LOGS ============*/
router.use(articlesLogs);


/*============ ROUTES FOR ARTICLES ============*/

/*=== CREATE ARTICLE ===*/
router.route('/')
    .all(AllowedCurrentMethodCheck(['POST']))
    .post([
        JwtCheck,
        PremiumCheck,
        ArticleValidationRules(),
        CreateArticleLimiter,
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
    .all(AllowedCurrentMethodCheck(['GET']))
    .get([
        JwtCheck,
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
    .all(AllowedCurrentMethodCheck(['GET']))
    .get([
        JwtCheck,
        ValidateURIParam('id'),
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
    .all(AllowedCurrentMethodCheck(['GET']))
    .get([
        JwtCheck,
        AccountCheck,
        ValidateURIParam('userId'),
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
    .all(AllowedCurrentMethodCheck(['PATCH']))
    .patch([
        JwtCheck,
        ValidateURIParam('id'),
        ArticleValidationRules(),
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
    .all(AllowedCurrentMethodCheck(['DELETE']))
    .delete([
        JwtCheck,
        ValidateURIParam('id'),
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
