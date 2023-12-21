/*==================================================*/
/*============ notAllowedMethodError.js ============*/
/*==================================================*/


/*============ NOT ALLOWED METHOD ERROR ============*/
class NotAllowedMethodError extends Error {
    constructor(message = 'Method not allowed!', statusCode = 405) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'NotAllowedMethodError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = NotAllowedMethodError;
