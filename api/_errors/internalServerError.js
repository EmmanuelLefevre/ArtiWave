/*================================================*/
/*============ internalServerError.js ============*/
/*================================================*/


/*============ INTERNAL SERVER ERROR ============*/
class InternalServerError extends Error {
    constructor(message = 'Internal server error!', statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'InternalServerError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = InternalServerError;
