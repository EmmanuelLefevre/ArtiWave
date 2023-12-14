/*============ IMPORT USED MODULES ============*/
const Article = require('../_models/IArticle');
const User = require('../_models/IUser');
const ErrorHandler = require('../_errors/errorHandler');

const { articleResponseValidation, articlesResponseValidation } = require('../_validation/responses/articleResponseValidation');


/*============ ARTICLES ============*/

/*=== CREATE ARTICLE ===*/
exports.createArticle = async (req, res) => {
    // Extract title && content && author && date properties from request
    const { title, content, author } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findById(author);
        if (!existingUser) {
            return ErrorHandler.handleUserNotFound(res, err);
        }

        // Create Article model instance
        const newArticle = new Article({
            title: title,
            content: content,
            author: author,
            createdAt: new Date()
        });

        // Save article in database
        await newArticle.save();

        // Fetch created article with author.id and author.nickname
        const createdArticle = await getArticleWithNickname(newArticle);

        // Validate response format
        try {
            await articleResponseValidation.validate(createdArticle, { abortEarly: false });
        }
        catch (validationError) {
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return created article
        return res.status(201).json(createdArticle);
    }
    catch (err) {
        if (err.code === 11000 && err.keyPattern.title) {
            return res.status(409).json({ message: 'Article with same title already posted!' });
        }

        return ErrorHandler.sendDatabaseError(res, err);
    }
}

/*=== GET ALL ARTICLES ===*/
exports.getAllArticles = async (_req, res) => {

    try {
        let articles = await Article.find({}, 'title content author createdAt updatedAt');

        if (articles === 0) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        // Add author's nickname and id for each articles
        articles = await Promise.all(articles.map(getArticleWithNickname));

        // Count articles
        const articleCount = articles.length;

        // Set response
        const response = {
            data: articles,
            dataCount: articleCount
        };

        // Validate response format
        try {
            await articlesResponseValidation.validate(response, { abortEarly: false });
        }
        catch (validationError) {
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return all articles
        return res.status(200).json(response);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== GET SINGLE ARTICLE ===*/
exports.getArticle = async (req, res) => {
    let articleId = req.params.id;

    try {
        let article = await Article.findById(articleId, { _id: 1, title: 1, content: 1, author: 1, createdAt: 1, updatedAt: 1 });

        if (!article) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        // Add author's nickname and id for article
        article = await getArticleWithNickname(article);

        // Validate response format
        try {
            await articleResponseValidation.validate(article, { abortEarly: false });
        }
        catch (validationError) {
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return single article
        return res.status(200).json(article);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== GET ARTICLES BY USER ===*/
exports.getArticlesByUser = async (req, res) => {
    let userId = req.params.userId;

    try {
        // Check if user exists
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return ErrorHandler.handleUserNotFound(res, err);
        }

        // Count articles for user
        const articleCount = await Article.countDocuments({ author: userId });
        if (articleCount === 0) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        let articles = await Article.find({ author: userId }, { _id: 1, title: 1, content: 1, author: 1, createdAt: 1, updatedAt: 1 });

        articles = articles.map(article => {
            // Ajoutez votre champ supplémentaire ici
            article.newField = "Valeur de champ supplémentaire";
            return article;
        });

        // Add author's nickname and id for each articles
        articles = await Promise.all(articles.map(getArticleWithNickname));

        // Set response
        const response = {
            data: articles,
            dataCount: articleCount
        };

        // Validate response format
        try {
            await articlesResponseValidation.validate(response, { abortEarly: false });
        }
        catch (validationError) {
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return all articles owned by a single user
        return res.status(200).json(response);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== UPDATE ARTICLE ===*/
exports.updateArticle = async (req, res) => {
    let articleId = req.params.id;

    try {
        let article = await Article.findById(articleId);

        if (!article) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        // Set updatedAt to the current date
        req.body.updatedAt = new Date();

        // Check if author article matches userId making request
        if (article.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'You are not allowed to update an article that does not belong to you!' });
        }

        // If author matches save article
        await article.updateOne(req.body);

        // Add author's nickname and id for article
        article = await getArticleWithNickname(article);

        // Validate response format
        try {
            await articleResponseValidation.validate(article, { abortEarly: false });
        }
        catch (validationError) {
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return updated article
        return res.status(200).json(article);
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
    let articleId = req.params.id;

    try {
        let article = await Article.findById(articleId);

        if (!article) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        // Check if author article matches userId making request
        if (article.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'You are not allowed to delete an article that does not belong to you!' });
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

/*=== GET NICKNAME ===*/
async function getUserNickname(userId) {
    try {
        let user = await User.findById(userId, 'nickname');
        return user ? user.nickname : null;
    }
    catch (err) {
        throw new Error('Error retrieving user\'s nickname!');
    }
}

/*=== SET ARTICLE WITH AUTHOR'S NICKNAME AND ID ===*/
async function getArticleWithNickname(article) {
    let nickname = await getUserNickname(article.author);
    return {
        ...article.toObject(),
        author: { _id: article.author, nickname: nickname }
    };
}
