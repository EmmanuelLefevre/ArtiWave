/*==========================================*/
/*============ notFoundError.js ============*/
/*==========================================*/


/*============ NOT FOUND ERROR ============*/
class NotFoundError extends Error {
    constructor(message = 'What the hell are you doing!!?', statusCode = 404) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'NotFoundError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = NotFoundError;
