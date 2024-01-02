/*==============================================*/
/*============ articleRepository.js ============*/
/*==============================================*/


/*============ IMPORT USED MODULES ============*/
// Models
const Article = require('../models/IArticle');

// Errors
const ArticleAlreadyExistsError = require('../_errors/articleAlreadyExistsError');
const CreationFailedError = require('../_errors/creationFailedError');
const DeletionFailedError = require('../_errors/deletionFailedError');
const RecoveryFailedError = require('../_errors/recoveryFailedError');
const UpdateFailedError = require('../_errors/updateFailedError');


/*============ ARTICLE REPOSITORY ============*/
class ArticleRepository {

    /*=== CREATE ARTICLE ===*/
    static async createArticle(newArticle) {
        try {
            return newArticle.save();
        }
        catch (err) {
            if (err.code === 11000 && err.keyPattern.title) {
                throw new ArticleAlreadyExistsError();
            }
            throw new CreationFailedError();
        }
    }

    /*=== GET ALL ARTICLES ===*/
    static async getAllArticles() {
        try {
            return Article.find({}, 'id title content author createdAt updatedAt');
        }
        catch (err) {
            throw new RecoveryFailedError();
        }
    }

    /*=== GET SINGLE ARTICLE ===*/
    static async getArticleById(articleId) {
        try {
            return Article.findById(articleId, { _id: 1, title: 1, content: 1, author: 1, createdAt: 1, updatedAt: 1 });
        }
        catch (err) {
            throw new RecoveryFailedError();
        }
    }

    /*=== GET ARTICLES BY USER ===*/
    static async getAllArticlesByUserId(userId) {
        try {
            return Article.find({ author: userId }, { _id: 1, title: 1, content: 1, author: 1, createdAt: 1, updatedAt: 1 });
        }
        catch (err) {
            throw new RecoveryFailedError();
        }
    }

    /*=== GET ARTICLES COUNT BY USER ===*/
    static async getArticleCountByUser(userId) {
        try {
            return Article.countDocuments({ author: userId });
        }
        catch (err) {
            throw new RecoveryFailedError();
        }
    }

    /*=== UPDATE ARTICLE ===*/
    static async updateArticleById(articleId, updatedData) {
        try {
            return Article.findByIdAndUpdate(
                articleId,
                { $set: updatedData },
                { new: true }
            );
        }
        catch (err) {
            if (err.code === 11000 && err.keyPattern.title) {
                throw new ArticleAlreadyExistsError();
            }
            throw new UpdateFailedError();
        }
    }

    /*=== DELETE ARTICLE ===*/
    static async deleteArticleById(articleId) {
        try {
            const result = await Article.deleteOne({ _id: articleId });
            return result.deletedCount;
        }
        catch (err) {
            throw new DeletionFailedError();
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = ArticleRepository;
