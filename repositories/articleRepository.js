/*===========================================*/
/*============ articleRepository.js ============*/
/*===========================================*/


/*============ IMPORT USED MODULES ============*/
// Models
const User = require('../models/IUser');
const Article = require('../models/IArticle');

// Errors
const ArticleNotFoundError = require('../_errors/articleNotFoundError');
const InternalServerError = require('../_errors/internalServerError');
const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ ARTICLE REPOSITORY ============*/
class ArticleRepository {

    /*=== CREATE ARTICLE ===*/
    static createArticle() {
        
    }

    /*=== FIND ALL ARTICLE ===*/
    static findAllArticle() {
        
    }

    /*=== FIND ARTICLE BY ID ===*/
    static findArticleById() {
        
    }
}


/*============ EXPORT MODULE ============*/
module.exports = ArticleRepository;
