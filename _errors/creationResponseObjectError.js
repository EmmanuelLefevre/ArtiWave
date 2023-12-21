/*================================================*/
/*============ creationResponseObjectError.js ============*/
/*================================================*/


/*============ CREATION RESPONSE OBJECT ERROR ============*/
class CreationResponseObjectError extends Error {
    constructor(message = 'Creation response object error!', statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'CreationResponseObjectError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = CreationResponseObjectError;
