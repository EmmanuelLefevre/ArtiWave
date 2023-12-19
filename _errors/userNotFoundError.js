/*================================================*/
/*============ userNotFoundError.js ============*/
/*================================================*/


/*============ USER NOT FOUND ERROR ============*/
class UserNotFoundError extends Error {
    constructor(message = 'No user was found!', statusCode = 404) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'UserNotFoundError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = UserNotFoundError;
