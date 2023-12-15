/*============ ERROR HANDLER MODULE ============*/
class ErrorHandler {
    static sendInternalServerError(res, error) {
        if (error) {
            return res.status(500).json({ message: 'Internal Server Error!', error: error.message });
        }
    }

    static sendDatabaseError(res, error) {
        if (error) {
            return res.status(500).json({ message: 'Database Error!', error: error.message });
        }
    }

    static sendValidationResponseError(res, error) {
        if (error) {
            return res.status(500).json({ message: 'Validation Response Error!', error: error.message });
        }
    }

    static sendCreationResponseObjectError(res, error) {
        if (error) {
            return res.status(500).json({ message: 'Creation Response Object Error!', error: error.message });
        }
    }

    static handleUserNotFound(res) {
        return res.status(404).json({ message: 'No user was found!' });
    }

    static handleArticleNotFound(res) {
        return res.status(404).json({ message: 'No article was found!' });
    }
}


/*============ EXPORT MODULE ============*/
module.exports = ErrorHandler;
