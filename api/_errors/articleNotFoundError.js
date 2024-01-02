/*=================================================*/
/*============ articleNotFoundError.js ============*/
/*=================================================*/


/*============ ARTICLE NOT FOUND ERROR ============*/
class ArticleNotFoundError extends Error {
    constructor(message = 'No article was found!', statusCode = 404) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ArticleNotFoundError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = ArticleNotFoundError;
