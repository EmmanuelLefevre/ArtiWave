/*======================================================*/
/*============ noPropertiesModifiedError.js ============*/
/*======================================================*/


/*============ NO PROPERTIES HAVE BEEN MODIFIED ERROR ============*/
class NoPropertiesModifiedError extends Error {
    constructor(message = 'No properties have been modified!', statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'NoPropertiesModifiedError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = NoPropertiesModifiedError;
