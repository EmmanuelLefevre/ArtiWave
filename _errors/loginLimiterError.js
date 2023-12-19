/*================================================*/
/*============ loginLimiterError.js ============*/
/*================================================*/


/*============ LOGIN LIMITER ERROR ============*/
class LoginLimiterError extends Error {
    constructor(message = 'The number of connection attempts is limited to 5 per hour!!', statusCode = 429) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'LoginLimiterError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = LoginLimiterError;
