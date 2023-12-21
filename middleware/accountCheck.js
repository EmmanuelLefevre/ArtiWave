/*=========================================*/
/*============ accountCheck.js ============*/
/*=========================================*/


/*============ IMPORT USED MODULES ============*/
const AccountCheckError = require('../_errors/accountCheckError');


/*============ CHECK IF REQUEST HAS AUTHORIZATION ============*/
// Check user own an account
const accountCheck = (req, _res, next) => {
    if (!req.headers.authorization) {
        throw new AccountCheckError();
    }

    next();
};


/*============ EXPORT MODULE ============*/
module.exports = accountCheck;
