/*==================================================*/
/*============ permissionDeniedError.js ============*/
/*==================================================*/


/*============ PERMISION DENIED ERROR ============*/
class PermissionDeniedError extends Error {
    constructor(message = 'Permission denied!', statusCode = 403) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'PermissionDeniedError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = PermissionDeniedError;
