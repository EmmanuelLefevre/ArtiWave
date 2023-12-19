/*===================================================*/
/*============ validationErrorHandler.js ============*/
/*===================================================*/


/*============ VALIDATION ERROR HANDLER MODULE ============*/
class ValidationErrorHandler {
    static handle(res, errors) {
        const messages = errors.array().map(error => error.msg);
        return res.status(422).json({ errors: messages });
    }
}


/*============ EXPORT MODULE ============*/
module.exports = ValidationErrorHandler;
