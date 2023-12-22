/*===============================================*/
/*============ articlesController.js ============*/
/*===============================================*/


/*============ IMPORT USED MODULES ============*/
// Repositories
const ArticleRepository = require('../repositories/articleRepository');
const UserRepository = require('../repositories/userRepository');

// Response validation
const { ArticleResponseValidationRoleAdmin,
        ArticleResponseValidationBase,
        ArticlesResponseValidationRoleAdmin,
        ArticlesResponseValidationBase,
        ArticleUpdatedResponseValidationRoleAdmin,
        ArticleUpdatedResponseValidationBase } =
    require('../_validation/responses/articleResponseValidation');

// Errors
const ArticleAlreadyExistsError = require('../_errors/articleAlreadyExistsError');
const ArticleNotFoundError = require('../_errors/articleNotFoundError');
const CreationResponseObjectError = require('../_errors/creationResponseObjectError');
const InternalServerError = require('../_errors/internalServerError');
const ResponseValidationError = require('../_errors/responseValidationError');
const UnknownUserRoleError = require('../_errors/unknownUserRoleError');
const UserInfoNotFoundError = require('../_errors/userInfoNotFoundError');
const UserNotFoundError = require('../_errors/userNotFoundError');

// Models
const Article = require('../models/IArticle');
const User = require('../models/IUser');


/*============ ARTICLES ============*/

class ArticleController {

    /*=== CREATE ARTICLE ===*/
    static async createArticle(req, res, next) {
        // Extract title && content properties from request
        const { title, content } = req.body;

        try {
            // Check if user exists
            const existingUser = await User.findById(req.userId);
            if (!existingUser) {
                throw new UserNotFoundError();
            }

            // Create Article model instance
            const newArticle = new Article({
                title: title,
                content: content,
                author: req.userId,
                createdAt: new Date()
            });

            // Save article in the database
            await newArticle.save();

            // Add author's id and nickname for the article if admin, if not just add author's nickname
            const createdArticle = await this.#createResponseArticleObject(newArticle, req.userRole);

            // Set response and determine the response validation schema based on user role
            let responseValidationSchema;
            let responseObject;

            switch (req.userRole) {
                case 'admin':
                    responseValidationSchema = ArticleResponseValidationRoleAdmin;
                    responseObject = createdArticle;
                    break;
                default:
                    responseValidationSchema = ArticleResponseValidationBase;
                    responseObject = createdArticle;
            }

            // Validate response format
            try {
                await responseValidationSchema.validate(responseObject, { abortEarly: false });
            }
            catch (validationError) {
                throw new ResponseValidationError();
            }

            // Return the created article
            return res.status(201).json(responseObject);
        }
        catch (err) {
            if (err.code === 11000 && err.keyPattern.title) {
                throw new ArticleAlreadyExistsError();
            }
            else if (err instanceof UserNotFoundError ||
                    err instanceof ResponseValidationError) {
                    return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*=== GET ALL ARTICLES ===*/
    static async getAllArticles(req, res, next) {
        try {
            let articles = await ArticleRepository.getAllArticles();

            if (articles.length === 0) {
                throw new ArticleNotFoundError();
            }

            // Add author's id and nickname for each article if admin, if not just add author's nickname
            articles = await Promise.all(articles.map(article => this.#createResponseArticleObject(article, req.userRole)));

            // Count articles
            const articlesCount = articles.length;

            // Set response and determine the response validation schema based on user role
            let responseValidationSchema;
            let responseObject;

            switch (req.userRole) {
                case 'admin':
                    responseValidationSchema = ArticlesResponseValidationRoleAdmin;
                    responseObject = {
                        data: articles
                    };
                    break;
                default:
                    responseValidationSchema = ArticlesResponseValidationBase;
                    responseObject = {
                        data: articles
                    };
            }

            // Add dataCount to the responseObject
            responseObject.dataCount = articlesCount;

            // Validate response format
            try {
                await responseValidationSchema.validate(responseObject, { abortEarly: false });
            }
            catch (validationError) {
                throw new ResponseValidationError();
            }

            // Return all articles
            return res.status(200).json(responseObject);
        }
        catch (err) {
            if (err instanceof ArticleNotFoundError ||
                err instanceof ResponseValidationError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*=== GET SINGLE ARTICLE ===*/
    static async getArticle(req, res, next) {
        const articleId = req.params.id;

        try {
            let article = await ArticleRepository.getArticleById(articleId);

            if (!article) {
                throw new ArticleNotFoundError();
            }

            // Add author's id and nickname for the article if admin, if not just add author's nickname
            article = await this.#createResponseArticleObject(article, req.userRole);

            // Set response and determine the response validation schema based on user role
            let responseValidationSchema;
            let responseObject;

            switch (req.userRole) {
                case 'admin':
                    responseValidationSchema = ArticleResponseValidationRoleAdmin;
                    responseObject = article;
                    break;
                default:
                    responseValidationSchema = ArticleResponseValidationBase;
                    responseObject = article;
            }

            // Validate response format
            try {
                await responseValidationSchema.validate(responseObject, { abortEarly: false });
            }
            catch (validationError) {
                throw new ResponseValidationError();
            }

            // Return single article
            return res.status(200).json(responseObject);
        }
        catch (err) {
            if (err instanceof ArticleNotFoundError ||
                err instanceof ResponseValidationError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*=== GET ARTICLES BY USER ===*/
    static async getArticlesByUser(req, res, next) {
        const userId = req.params.userId;

        try {
            // Check if user exists
            const existingUser = await UserRepository.userExists(userId);

            if (!existingUser) {
                throw new UserNotFoundError();
            }

            // Count articles for the user
            const articleCount = await ArticleRepository.getArticleCountByUser(userId);
            if (articleCount === 0) {
                throw new ArticleNotFoundError();
            }

            // Get articles
            const articles = await ArticleRepository.getAllArticlesByUserId(userId);

            // Add author's nickname and id for each article
            const processedArticles  = await Promise.all(articles.map(article => this.#createResponseArticleObject(article, req.userRole)));

            // Set response and determine the response validation schema based on user role
            let responseValidationSchema;
            let responseObject;

            switch (req.userRole) {
                case 'admin':
                    responseValidationSchema = ArticlesResponseValidationRoleAdmin;
                    responseObject = {
                        data: processedArticles
                    };
                    break;
                default:
                    responseValidationSchema = ArticlesResponseValidationBase;
                    responseObject = {
                        data: processedArticles
                    };
            }

            // Add dataCount to the responseObject
            responseObject.dataCount = articleCount;

            // Validate response format
            try {
                await responseValidationSchema.validate(responseObject, { abortEarly: false });
            }
            catch (validationError) {
                throw new ResponseValidationError();
            }

            // Return all articles owned by a single user
            return res.status(200).json(responseObject);
        }
        catch (err) {
            if (err instanceof ArticleNotFoundError ||
                err instanceof UserNotFoundError ||
                err instanceof ResponseValidationError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*=== UPDATE ARTICLE ===*/
    static async updateArticle(req, res, next) {
        const articleId = req.params.id;

        try {
            let article = await Article.findById(articleId);

            if (!article) {
                throw new ArticleNotFoundError();
            }

            // Save original article data
            const originalArticleData = article.toObject();

            // Set updatedAt to the current date
            req.body.updatedAt = new Date();

            // Check if the author's article matches the userId making the request
            if (article.author.toString() !== req.userId) {
                // Check if the user is an admin
                if (req.isAdmin) {
                    // Allow admin to update the article of any user
                    await Article.updateOne({ _id: articleId }, req.body);
                }
                else if (req.isUser) {
                    return res.status(403).json({ message: 'Only certified members are allowed to update an article!' });
                }
                else {
                    return res.status(403).json({ message: 'You are not allowed to update an article that does not belong to you!' });
                }
            } else {
                // If the author matches, save the article
                await Article.updateOne({ _id: articleId }, req.body);
            }

            // Fetch the updated article by its ID
            const updatedArticle = await Article.findById(articleId);

            // Identify modified properties from req.body
            const modifiedProperties = Object.keys(req.body).reduce((acc, key) => {
                if (originalArticleData[key] !== updatedArticle[key]) {
                    acc[key] = updatedArticle[key];
                }
                return acc;
            }, {});

            // Add author's id and nickname for the article if admin, if not just add the author's nickname
            article = await this.#createResponseArticleObject(article, req.userRole);

            // Set response and determine the response validation schema based on user role
            let responseValidationSchema;
            let responseObject;

            switch (req.userRole) {
                case 'admin':
                    responseValidationSchema = ArticleUpdatedResponseValidationRoleAdmin;
                    responseObject = {
                        data: article
                    };
                    break;
                default:
                    responseValidationSchema = ArticleUpdatedResponseValidationBase;
                    responseObject = {
                        data: article
                    };
            }

            // Add modified property to the responseObject
            responseObject.modifiedProperties = modifiedProperties;

            // Validate response format
            try {
                await responseValidationSchema.validate(responseObject, { abortEarly: false });
            }
            catch (validationError) {
                throw new ResponseValidationError();
            }

            // Return the updated article
            return res.status(200).json(responseObject);
        }
        catch (err) {
            if (err.code === 11000 && err.keyPattern.title) {
                throw new ArticleAlreadyExistsError();
            }
            else if (err instanceof ArticleNotFoundError ||
                err instanceof ResponseValidationError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }

    /*=== DELETE ARTICLE ===*/
    static async deleteArticle(req, res, next) {
        const articleId = req.params.id;

        try {
            let article = await Article.findById(articleId);

            if (!article) {
                throw new ArticleNotFoundError();
            }

            // Check if the author's article matches the userId making the request
            if (article.author.toString() !== req.userId) {
                // Check if the user is an admin
                if (req.isAdmin) {
                    // Allow admin to delete articles of any user
                    await Article.deleteOne({ _id: articleId });

                    return res.sendStatus(204);
                }
                else if (req.isUser) {
                    return res.status(403).json({ message: 'Only certified members are allowed to delete an article!' });
                }
                else {
                    return res.status(403).json({ message: 'You are not allowed to delete an article that does not belong to you!' });
                }
            }

            // If the author matches, delete the article
            await Article.deleteOne({ _id: articleId });

            return res.sendStatus(204);
        }
        catch (err) {
            if (err instanceof ArticleNotFoundError) {
                return next(err);
            }
            next(new InternalServerError());
        }
    }


    /*============ FUNCTIONS ============*/

    /*=== GET INFO ===*/
    static async #getUserInfo(userId, _res) {
        try {
            let user = await User.findById(userId, 'nickname roles');
            return user ? { nickname: user.nickname, roles: user.roles } : null;
        }
        catch (err) {
            next(new UserInfoNotFoundError());
        }
    }

    /*=== CREATE RESPONSE ARTICLE OBJECT BASED ON ROLE ===*/
    static async #createResponseArticleObject(article, userRole, res, next) {
        try {
            const authorInfo = await this.#getUserInfo(article.author, res, next);

            const commonFields = {
                title: article.title,
                content: article.content,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
                author: { nickname: authorInfo.nickname }
            };

            switch (userRole) {
                case 'admin':
                    return {
                        _id: article._id,
                        ...commonFields,
                        author: {
                            _id: article.author,
                            nickname: authorInfo.nickname,
                            roles: authorInfo.roles
                        }
                    };
                case 'certified':
                case 'user':
                    return commonFields;
                default:
                    throw UnknownUserRoleError();
            }
        }
        catch (err) {
            if (err instanceof UnknownUserRoleError) {
                return next(err);
            }
            next(new CreationResponseObjectError());
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = ArticleController;
