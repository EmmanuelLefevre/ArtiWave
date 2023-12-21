/*==============================================*/
/*============ articleAlreadyExistsError.js ============*/
/*==============================================*/


/*============ ARTICLE ALREADY EXISTS ERROR ============*/
class ArticleAlreadyExistsError extends Error {
    constructor(message = 'Article with the same title already posted!', statusCode = 409) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ArticleAlreadyExistsError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = ArticleAlreadyExistsError;
