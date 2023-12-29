/*==============================================*/
/*============ articleRepository.js ============*/
/*==============================================*/


/*============ IMPORT USED MODULES ============*/
// Models
const Article = require('../models/IArticle');

// Errors
const ArticleAlreadyExistsError = require('../_errors/articleAlreadyExistsError');


/*============ ARTICLE REPOSITORY ============*/
class ArticleRepository {

    /*=== CREATE ARTICLE ===*/
    static async createArticle(newArticle, next) {
        try {
            return await newArticle.save();
        }
        catch (err) {
            if (err.code === 11000 && err.keyPattern.title) {
                throw new ArticleAlreadyExistsError();
            }
            throw err;
        }
    }

    /*=== GET ALL ARTICLES ===*/
    static async getAllArticles(next) {
        try {
            return await Article.find({}, 'id title content author createdAt updatedAt');
        }
        catch (err) {
            throw err;
        }
    }

    /*=== GET SINGLE ARTICLE ===*/
    static async getArticleById(articleId, next) {
        try {
            return await Article.findById(articleId, { _id: 1, title: 1, content: 1, author: 1, createdAt: 1, updatedAt: 1 });
        }
        catch (err) {
            throw err;
        }
    }

    /*=== GET ARTICLES BY USER ===*/
    static async getAllArticlesByUserId(userId, next) {
        try {
            const articles = await Article.find({ author: userId }, { _id: 1, title: 1, content: 1, author: 1, createdAt: 1, updatedAt: 1 });
            return articles;
        }
        catch (err) {
            throw err;
        }
    }

    /*=== GET ARTICLES COUNT BY USER ===*/
    static async getArticleCountByUser(userId, next) {
        try {
            const articleCount = await Article.countDocuments({ author: userId });
            return articleCount;
        }
        catch (err) {
            throw err;
        }
    }

    /*=== UPDATE ARTICLE ===*/
    static async updateArticleById(articleId, updatedData, next) {
        try {
            const updatedArticle = await Article.findByIdAndUpdate(
                articleId,
                { $set: updatedData },
                { new: true }
            );
            return updatedArticle;
        }
        catch (err) {
            if (err.code === 11000 && err.keyPattern.title) {
                throw new ArticleAlreadyExistsError();
            }
            throw err;
        }
    }

    /*=== DELETE ARTICLE ===*/
    static async deleteArticleById(articleId, next) {
        try {
            const result = await Article.deleteOne({ _id: articleId });
            return result.deletedCount;
        }
        catch (err) {
            throw err;
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = ArticleRepository;
