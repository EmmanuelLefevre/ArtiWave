/*==============================================*/
/*============ updateFailedError.js ============*/
/*==============================================*/


/*============ UPDATE FAILED ERROR ============*/
class UpdateFailedError extends Error {
    constructor(message = 'Update failed!', statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'UpdateFailedError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = UpdateFailedError;
