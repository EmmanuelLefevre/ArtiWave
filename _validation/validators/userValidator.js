/*============ IMPORT USED MODULES ============*/
const { body } = require('express-validator');

const trimInput = require('../../utils/trimInput');
const capitalizeEachWord = require('../../utils/capitalizeEachWord');


/*============ USER VALIDATION ============*/
const userValidationRules = [
    body('email')
        .optional({ nullable: true }).bail()
        .isString().withMessage('Email must be a string!').bail()
        .customSanitizer(value => trimInput(value)).bail()
        .isEmail().withMessage('Invalid email address!'),
    body('password')
        .optional({ nullable: true }).bail()
        .isString().withMessage('Password must be a string!').bail()
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase!').bail()
        .matches(/\d/).withMessage('Password must contain at least one digit!').bail()
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character!').bail()
        .isLength({ min: 8 }).withMessage('Password must contain at least 8 characters!').bail()
        .isLength({ max: 24 }).withMessage('Password cannot exceed 24 characters!').bail()
        .customSanitizer(value => trimInput(value)),
    body('nickname')
        .optional({ nullable: true }).bail()
        .isString().withMessage('Nickname must be a string!').bail()
        .matches(/^[a-zA-Z0-9 ]+$/).withMessage('Nickname can only contain letters, numbers and spaces!').bail()
        .isLength({ min: 3 }).withMessage('Nickname must contain at least 3 characters!').bail()
        .isLength({ max: 20 }).withMessage('Nickname cannot exceed 20 characters!').bail()
        .customSanitizer(value => {
            const trimmedNickname = trimInput(value);
            return capitalizeEachWord(trimmedNickname);
        })
];

/*============ EXPORT MODULE ============*/
module.exports = userValidationRules;
