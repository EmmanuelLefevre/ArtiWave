/*=================================================*/
/*============ unknownUserRoleError.js ============*/
/*=================================================*/


/*============ UNKNOWN USER ROLE ERROR ============*/
class UnknownUserRoleError extends Error {
    constructor(message = 'Unknown user role!', statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'UnknownUserRoleError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = UnknownUserRoleError;
