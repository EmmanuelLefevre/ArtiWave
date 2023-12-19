/*================================================*/
/*============ responseValidationError.js ============*/
/*================================================*/


/*============ RESPONSE VALIDATION ERROR ============*/
class ResponseValidationError extends Error {
    constructor(message = 'Validation Response Error!', statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ResponseValidationError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = ResponseValidationError;
