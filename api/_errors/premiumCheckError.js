/*==============================================*/
/*============ premiumCheckError.js ============*/
/*==============================================*/


/*============ PREMIUM CHECK ERROR ============*/
class PremiumCheckError extends Error {
    constructor(message = 'Premium functionality!', statusCode = 403) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'PremiumCheckError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = PremiumCheckError;
