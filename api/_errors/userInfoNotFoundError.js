/*==================================================*/
/*============ userInfoNotFoundError.js ============*/
/*==================================================*/


/*============ USER INFO NOT FOUND ERROR ============*/
class UserInfoNotFoundError extends Error {
    constructor(message = 'Error retrieving user\'s info!', statusCode = 404) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'UserInfoNotFoundError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = UserInfoNotFoundError;