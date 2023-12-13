/*============ IMPORT USED MODULES ============*/
const Article = require('../_models/IArticle');
const User = require('../_models/IUser');
const ErrorHandler = require('../miscellaneous/errorHandler');


/*============ ARTICLES ============*/

/*=== CREATE ARTICLE ===*/
exports.createArticle = async (req, res) => {
    // Extract title && content && author && date properties from request
    const { title, content, author } = req.body;

    try {
        // Create Article model instance
        const newArticle = new Article({
            title: title,
            content: content,
            author: author,
            createdAt: new Date()
        });

        // Save article in database
        await newArticle.save();

        // Set Author in response
        const user = await User.findById(author);

        // Fetch created article by Id
        const createdArticle = await Article.findById(newArticle._id);

        // Return modified article with all its properties
        return res.status(201).json({
            message: 'Article created successfully!',
            author: user.nickname,
            article: createdArticle
        });
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

        // Add author's nickname and id for each articles
        articles = await Promise.all(articles.map(getArticleWithNickname));

        // Count articles
        const dataCount = articles.length;

        return res.status(200).json({ data: articles, dataCount });
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

        return res.status(200).json({ data: article });
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}


/*=== GET ARTICLES BY USER ===*/
exports.getArticlesByUser = async (req, res) => {
    let userId = req.params.userId;

    try {
        // Count articles for user
        const articleCount = await Article.countDocuments({ author: userId });

        let articles = await Article.find({ author: userId }, { _id: 1, title: 1, content: 1, author: 1, createdAt: 1, updatedAt: 1 });

        // Add author's nickname and id for each articles
        articles = await Promise.all(articles.map(getArticleWithNickname));

        const response = {
            data: articles,
            dataCount: articleCount
        };

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

        // Save article in database
        await article.updateOne(req.body);

        // Fetch updated article by Id
        const updatedArticle = await Article.findById(articleId);

        // Set Author in response
        const user = await User.findById(updatedArticle.author);

        return res.status(200).json({
            message: 'Article updated!',
            author: user.nickname,
            article: updatedArticle});
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
        let article = await Article.findByIdAndDelete(articleId);

        if (!article) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        return res.status(204).json({});
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}





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
