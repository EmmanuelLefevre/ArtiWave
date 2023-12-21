/*======================================================*/
/*============ allowedCurrentMethodCheck.js ============*/
/*======================================================*/


/*============ IMPORT USED MODULES ============*/
const NotAllowedMethodError = require('../_errors/notAllowedMethodError');


/*============ CHECK IF REQUEST CURRENT METHOD IS ALLOWED ============*/
// Check method verb
const allowedCurrentMethodCheck = (allowedMethods) => {
    return (req, _res, next) => {
        const currentMethod = req.method;

        if (!allowedMethods.includes(currentMethod)) {
            throw new NotAllowedMethodError();
        }
        next();
    };
};


/*============ EXPORT MODULE ============*/
module.exports = allowedCurrentMethodCheck;
