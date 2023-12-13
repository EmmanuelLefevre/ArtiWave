/*============ IMPORT USED MODULES ============*/
const { body } = require('express-validator');

const trimInput = require('../miscellaneous/trimInput');


/*============ PASSWORD VALIDATION ============*/
const passwordValidationRules = [
    body('password')
        .optional({ nullable: true }).bail()
        .isString().withMessage('Password must be a string!').bail()
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase!').bail()
        .matches(/\d/).withMessage('Password must contain at least one digit!').bail()
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character!').bail()
        .isLength({ min: 8 }).withMessage('Password must contain at least 8 characters!').bail()
        .isLength({ max: 24 }).withMessage('Password cannot exceed 24 characters!').bail()
        .customSanitizer(value => trimInput(value))
];


/*============ EXPORT MODULE ============*/
module.exports = passwordValidationRules;
