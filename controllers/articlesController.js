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
const ErrorHandler = require('../_errors/errorHandler');


/*============ ARTICLES ============*/

/*=== CREATE ARTICLE ===*/
exports.createArticle = async (req, res) => {
    // Extract title && content properties from request
    const { title, content } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findById(req.userId);
        if (!existingUser) {
            return ErrorHandler.handleUserNotFound(res);
        }

        // Create Article model instance
        const newArticle = new Article({
            title: title,
            content: content,
            author: req.userId,
            createdAt: new Date()
        });

        // Save article in database
        await newArticle.save();

        // Add author's id and nickname for article if admin, if not just add author's nickname
        createdArticle = await createResponseArticleObject(newArticle, req.userRole);

        // Set response and determine the response validation schema based on user role
        let responseValidationSchema;
        let responseObject;

        switch (req.userRole) {
            case 'admin':
                responseValidationSchema = articleResponseValidationRoleAdmin;
                responseObject = createdArticle;
            default:
                responseValidationSchema = articleResponseValidationBase;
                responseObject = createdArticle;
        }

        // Validate response format
        try {
            await responseValidationSchema.validate(responseObject, { abortEarly: false });
        }
        catch (validationError) {
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return created article
        return res.status(201).json(responseObject);
    }
    catch (err) {
        if (err.code === 11000 && err.keyPattern.title) {
            return res.status(409).json({ message: 'Article with same title already posted!' });
        }

        return ErrorHandler.sendDatabaseError(res, err);
    }
}

/*=== GET ALL ARTICLES ===*/
exports.getAllArticles = async (req, res) => {

    try {
        let articles = await Article.find({}, 'id title content author createdAt updatedAt');

        if (articles === 0) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        // Add author's id and nickname for each articles if admin, if not just add author's nickname
        articles = await Promise.all(articles.map(article => createResponseArticleObject(article, req.userRole)));

        // Count articles
        const articlesCount = articles.length;

        // Set response and determine the response validation schema based on user role
        let responseValidationSchema;
        let responseObject;

        switch (req.userRole) {
            case 'admin':
                responseValidationSchema = articlesResponseValidationRoleAdmin;
                responseObject = {
                    data: articles
                };
                break;
            default:
                responseValidationSchema = articlesResponseValidationBase;
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
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return all articles
        return res.status(200).json(responseObject);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== GET SINGLE ARTICLE ===*/
exports.getArticle = async (req, res) => {
    const articleId = req.params.id;

    try {
        let article = await Article.findById(articleId, { _id: 1, title: 1, content: 1, author: 1, createdAt: 1, updatedAt: 1 });

        if (!article) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        // Add author's id and nickname for article if admin, if not just add author's nickname
        article = await createResponseArticleObject(article, req.userRole);

        // Set response and determine the response validation schema based on user role
        let responseValidationSchema;
        let responseObject;

        switch (req.userRole) {
            case 'admin':
                responseValidationSchema = articleResponseValidationRoleAdmin;
                responseObject = article;
                break;
            default:
                responseValidationSchema = articleResponseValidationBase;
                responseObject = article;
        }

        // Validate response format
        try {
            await responseValidationSchema.validate(responseObject, { abortEarly: false });
        }
        catch (validationError) {
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return single article
        return res.status(200).json(responseObject);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== GET ARTICLES BY USER ===*/
exports.getArticlesByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Check if user exists
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return ErrorHandler.handleUserNotFound(res);
        }

        // Count articles for user
        const articleCount = await Article.countDocuments({ author: userId });
        if (articleCount === 0) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        let articles = await Article.find({ author: userId }, { _id: 1, title: 1, content: 1, author: 1, createdAt: 1, updatedAt: 1 });

        // Add author's nickname and id for each articles
        articles = await Promise.all(articles.map(article => createResponseArticleObject(article, req.userRole)));

        // Set response and determine the response validation schema based on user role
        let responseValidationSchema;
        let responseObject;

        switch (req.userRole) {
            case 'admin':
                responseValidationSchema = articlesResponseValidationRoleAdmin;
                responseObject = {
                    data: articles
                };
                break;
            default:
                responseValidationSchema = articlesResponseValidationBase;
                responseObject = {
                    data: articles
                };
        }

        // Add dataCount to the responseObject
        responseObject.dataCount = articleCount;

        // Validate response format
        try {
            await responseValidationSchema.validate(responseObject, { abortEarly: false });
        }
        catch (validationError) {
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return all articles owned by a single user
        return res.status(200).json(responseObject);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== UPDATE ARTICLE ===*/
exports.updateArticle = async (req, res) => {
    const articleId = req.params.id;

    try {
        let article = await Article.findById(articleId);

        if (!article) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        // Save original article data
        const originalArticleData = article.toObject();

        // Set updatedAt to the current date
        req.body.updatedAt = new Date();

        // Check if author article matches userId making request
        if (article.author.toString() !== req.userId) {
            // Check if user is admin
            if (req.isAdmin) {
                // Allow admin to update article of any user
                await Article.updateOne({ _id: articleId }, req.body);
            }
            else if (req.isUser) {
                return res.status(403).json({ message: 'Only certified members are allowed to update an article!' });
            }
            else {
                return res.status(403).json({ message: 'You are not allowed to update an article that does not belong to you!' });
            }
        }
        else {
            // If author matches save article
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

        // Add author's id and nickname for article if admin, if not just add author's nickname
        article = await createResponseArticleObject(article, req.userRole);

        // Set response and determine the response validation schema based on user role
        let responseValidationSchema;
        let responseObject;

        switch (req.userRole) {
            case 'admin':
                responseValidationSchema = articleUpdatedResponseValidationRoleAdmin;
                responseObject = {
                    data: article
                };
                break;
            default:
                responseValidationSchema = articleUpdatedResponseValidationBase;
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
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return updated article
        return res.status(200).json(responseObject);
    }
    catch (err) {
        if (err.code === 11000 && err.keyPattern.title) {
            return res.status(409).json({ message: 'Article with same title already posted!' });
        }

        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== DELETE ARTICLE ===*/
exports.deleteArticle =  async (req, res) => {
    const articleId = req.params.id;

    try {
        let article = await Article.findById(articleId);

        if (!article) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        // Check if author article matches userId making request
        if (article.author.toString() !== req.userId) {
            // Check if user is admin
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

        // If author matches delete article
        await Article.deleteOne({ _id: articleId });

        return res.sendStatus(204);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}





/*============ FUNCTIONS ============*/

/*=== GET INFO ===*/
async function getUserInfo(userId) {
    try {
        let user = await User.findById(userId, 'nickname roles');
        return user ? { nickname: user.nickname, roles: user.roles } : null;
    }
    catch (err) {
        return ErrorHandler.handleUserInfoNotFound(res, err);
    }
}


/*=== CREATE RESPONSE ARTICLE OBJECT BASED ON ROLE ===*/
const createResponseArticleObject = async (article, userRole, res) => {
    try {
        const authorInfo = await getUserInfo(article.author);

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
                return ErrorHandler.handleUserUnknownRole(res, err);
        }
    }
    catch (err) {
        return ErrorHandler.sendCreationResponseObjectError(res, err);
    }
};
