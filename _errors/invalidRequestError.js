/*================================================*/
/*============ invalidRequestError.js ============*/
/*================================================*/


/*============ INVALID REQUEST ERROR ============*/
class InvalidRequestError extends Error {
    constructor(message = 'Invalid request!', statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'InvalidRequestError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = InvalidRequestError;
