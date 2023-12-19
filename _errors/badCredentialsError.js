/*================================================*/
/*============ badCredentialsError.js ============*/
/*================================================*/


/*============ BAD CREDENTIALS ERROR ============*/
class BadCredentialsError extends Error {
    constructor(message = 'Bad credentials!', statusCode = 401) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'BadCredentialsError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = BadCredentialsError;
