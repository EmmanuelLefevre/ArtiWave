/*============ IMPORT USED MODULES ============*/
const { body } = require('express-validator');

const trimInput = require('../miscellaneous/trimInput');


/*============ EMAIL VALIDATION ============*/
const emailValidationRule = [
    body('email')
        .optional({ nullable: true }).bail()
        .isString().withMessage('Email must be a string!').bail()
        .customSanitizer(value => trimInput(value)).bail()
        .isEmail().withMessage('Invalid email address!')
];


/*============ EXPORT MODULE ============*/
module.exports = emailValidationRule;