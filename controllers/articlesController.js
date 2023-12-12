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
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Save article in database
        await newArticle.save();

        // Set Author in response
        const user = await User.findById(author);

        return res.status(201).json({ message: 'Article created successfully!', author: user.pseudo });
    }
    catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.title) {
            return res.status(409).json({ message: 'Article already exists!' });
        }
    }
}

/*=== GET ALL ARTICLES ===*/
exports.getAllArticles = async (_req, res) => {

    try {
        let articles = await Article.find({}, 'title content author createdAt updatedAt');

        // Add author's pseudo and id for each articles
        articles = await Promise.all(articles.map(getArticleWithPseudo));

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

        // Add author's pseudo and id for article
        article = await getArticleWithPseudo(article);

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

        // Add author's pseudo and id for each articles
        articles = await Promise.all(articles.map(getArticleWithPseudo));

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
        let article = await Article.findByIdAndUpdate(articleId, req.body);

        if (!article) {
            return ErrorHandler.handleArticleNotFound(res);
        }

        // Set updatedAt to the current date
        req.body.updatedAt = new Date();

        // Save article in database
        await article.updateOne(req.body);

        return res.status(200).json({ message: 'Article updated!' });
    }
    catch (err) {
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





/*=== GET PSEUDO ===*/
async function getUserPseudo(userId) {
    try {
        let user = await User.findById(userId, 'pseudo');
        return user ? user.pseudo : null;
    }
    catch (err) {
        throw new Error('Error retrieving user\'s pseudo!');
    }
}

/*=== SET ARTICLE WITH AUTHOR'S PSEUDO AND ID ===*/
async function getArticleWithPseudo(article) {
    let pseudo = await getUserPseudo(article.author);
    return {
        ...article.toObject(),
        author: { _id: article.author, pseudo: pseudo }
    };
}
