/*=========================================*/
/*============ premiumCheck.js ============*/
/*=========================================*/


/*============ IMPORT USED MODULES ============*/
const PremiumCheckError = require('../_errors/premiumCheckError');


/*============ CHECK IF REQUEST HAS ROLE ADMIN OR CERTIFIED ============*/
// Check if user has required role (admin or certified)
const PremiumCheck = (req, _res, next) => {
    if (!(req.isAdmin || req.isCertified)) {
        throw new PremiumCheckError();
    }

    next();
};


/*============ EXPORT MODULE ============*/
module.exports = PremiumCheck;
