/*======================================================*/
/*============ accountAlreadyExistsError.js ============*/
/*======================================================*/


/*============ ACCOUNT ALREADY EXISTS ERROR ============*/
class AccountAlreadyExistsError extends Error {
    constructor(message = 'Account already exists!', statusCode = 409) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AccountAlreadyExistsError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AccountAlreadyExistsError;
