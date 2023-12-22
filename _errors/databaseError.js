/*==========================================*/
/*============ databaseError.js ============*/
/*==========================================*/


/*============ DATABASE ERROR ============*/
class DatabaseError extends Error {
    constructor(message = 'Database error!', statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'DatabaseError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = DatabaseError;
