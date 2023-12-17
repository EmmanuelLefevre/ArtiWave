/*============ ERROR HANDLER MODULE ============*/
class ErrorHandler {
    // 400 errors
    static sendUnknownRoleError(res) {
        return res.status(400).json({ message: 'Unknown user role!' });
    }

    // 404 errors
    static handleUserNotFound(res) {
        return res.status(404).json({ message: 'No user was found!' });
    }

    static handleArticleNotFound(res) {
        return res.status(404).json({ message: 'No article was found!' });
    }

    static handleUserInfoNotFound(res) {
        return res.status(404).json({ message: 'Error retrieving user\'s info!' });
    }

    // 500 errors
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
}


/*============ EXPORT MODULE ============*/
module.exports = ErrorHandler;
