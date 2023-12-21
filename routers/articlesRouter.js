/*===========================================*/
/*============ articlesRouter.js ============*/
/*===========================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');

// Controller
const ArticlesController = require('../controllers/articlesController');

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
const InternalServerError = require('../_errors/internalServerError');
const InvalidRequestError = require('../_errors/invalidRequestError');
const ValidationError = require('../_errors/validationError');

// Logs
const { articlesLogs } = require('../_logs/articles/articlesLogger');


/*============ EXPRESS ROUTES FOR ARTICLES ============*/

class ArticlesRouter {
    static init() {
        // Express router
        const articlesRouter = express.Router();
        // Middleware articles requests logs
        articlesRouter.use(articlesLogs);

        /*=== CREATE ARTICLE ===*/
        articlesRouter.route('/register')
            .all(AllowedCurrentMethodCheck(['POST']))
            .post(
                JwtCheck,
                PremiumCheck,
                ArticleValidationRules,
                ArticlesRouter.#validateCreateArticle,
                CreateArticleLimiter,
                (req, res) => {
                    try {
                        // Successful validation, proceed
                        ArticlesController.createArticle(req, res);
                    }
                    catch (err) {
                        throw new InternalServerError();
                    }
                }
        );

        /*=== GET ALL ARTICLES ===*/
        articlesRouter.route('/')
            .all(AllowedCurrentMethodCheck(['GET']))
            .get(
                JwtCheck,
                (req, res) => {
                    try {
                        // Successful validation, proceed
                        ArticlesController.getAllArticles(req, res);
                    }
                    catch (err) {
                        throw new InternalServerError();
                    }
                }
        );

        /*=== GET SINGLE ARTICLE ===*/
        articlesRouter.route('/:id')
            .all(AllowedCurrentMethodCheck(['GET']))
            .get(
                JwtCheck,
                ValidateURIParam('id'),
                ArticlesRouter.#validateURIParam,
                (req, res) => {
                    try {
                        // Successful validation, proceed
                        ArticlesController.getArticle(req, res);
                    }
                    catch (err) {
                        throw new InternalServerError();
                    }
                }
        );

        /*=== GET ARTICLES BY USER ===*/
        articlesRouter.route('/user/:userId')
            .all(AllowedCurrentMethodCheck(['GET']))
            .get(
                JwtCheck,
                AccountCheck,
                ValidateURIParam('id'),
                ArticlesRouter.#validateURIParam,
                (req, res) => {
                    try {
                        // Successful validation, proceed
                        ArticlesController.getArticlesByUser(req, res);
                    }
                    catch (err) {
                        throw new InternalServerError();
                    }
                }
        );

        /*=== UPDATE ARTICLE ===*/
        articlesRouter.route('/:id')
            .all(AllowedCurrentMethodCheck(['PATCH']))
            .patch(
                JwtCheck,
                ValidateURIParam('id'),
                ArticlesRouter.#validateURIParam,
                ArticlesRouter.#validateUpdateArticle,
                ArticleValidationRules,
                (req, res) => {
                    try {
                        // Successful validation, proceed
                        ArticlesController.updateArticle(req, res);
                    }
                    catch (err) {
                        throw new InternalServerError();
                    }
                }
        );

        /*=== DELETE ARTICLE ===*/
        articlesRouter.route('/:id')
            .all(AllowedCurrentMethodCheck(['DELETE']))
            .delete(
                JwtCheck,
                ValidateURIParam('id'),
                ArticlesRouter.#validateURIParam,
                (req, res) => {
                    try {
                        // Successful validation, proceed
                        ArticlesController.deleteArticle(req, res);
                    }
                    catch (err) {
                        throw new InternalServerError();
                    }
                }
        );

        return articlesRouter;
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
            else {
                throw new InternalServerError();
            }
        }
    }

    static #validateCreateArticle(req, _res, next) {
        try {
            // Check presence of data title && content
            const { title, content } = req.body;

            if (!title || !content ) {
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

    static #validateUpdateArticle(req, res, next) {
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
                    throw new InvalidRequestError();
                }
            }

            next();
        }
        catch (err) {
            if (err instanceof InvalidRequestError) {
                return next(err);
            }
            else {
                throw new InternalServerError();
            }
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = ArticlesRouter.init();
