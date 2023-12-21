/*==============================================*/
/*============ accountCheckError.js ============*/
/*==============================================*/


/*============ ACCOUNT CHECK ERROR ============*/
class AcountCheckError extends Error {
    constructor(message = 'This feature is reserved for users who own an account!', statusCode = 401) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AcountCheckError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AcountCheckError;
