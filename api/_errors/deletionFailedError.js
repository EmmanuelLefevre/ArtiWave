/*================================================*/
/*============ deletionFailedError.js ============*/
/*================================================*/


/*============ DELETION FAILED ERROR ============*/
class DeletionFailedError extends Error {
    constructor(message = 'Deletion failed!', statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'DeletionFailedError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = DeletionFailedError;
