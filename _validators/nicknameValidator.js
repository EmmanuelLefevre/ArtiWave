/*============ IMPORT USED MODULES ============*/
const { body } = require('express-validator');

const trimInput = require('../miscellaneous/trimInput');
const capitalizeEachWord = require('../miscellaneous/capitalizeEachWord');


/*============ NICKNAME VALIDATION ============*/
const nicknameValidationRules = [
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
module.exports = nicknameValidationRules;