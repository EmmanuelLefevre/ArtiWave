/*================================================*/
/*============ creationFailedError.js ============*/
/*================================================*/


/*============ CREATION FAILED ERROR ============*/
class CreationFailedError extends Error {
    constructor(message = 'Creation failed!', statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'CreationFailedError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = CreationFailedError;
