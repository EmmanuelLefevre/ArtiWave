/*================================================*/
/*============ recoveryFailedError.js ============*/
/*================================================*/


/*============ RECOVERY FAILED ERROR ============*/
class RecoveryFailedError extends Error {
    constructor(message = 'Recovery failed!', statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'RecoveryFailedError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = RecoveryFailedError;
