/*============================================*/
/*============ validationError.js ============*/
/*============================================*/


/*============ VALIDATION ERROR ============*/
class ValidationError extends Error {
    constructor(errors = [], statusCode = 422) {
        super('Validation error!');
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = 'ValidationError';
    }

    getErrorResponse() {
        return { errors: this.errors.map(error => error.msg) };
    }

}


/*============ EXPORT MODULE ============*/
module.exports = ValidationError;
