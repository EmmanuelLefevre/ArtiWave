/*============ IMPORT USED MODULES ============*/
const { body } = require('express-validator');

const trimInput = require('../miscellaneous/trimInput');
const capitalizeEachWord = require('../miscellaneous/capitalizeEachWord');


/*============ PSEUDO VALIDATION ============*/
const pseudoValidationRules = [
    body('pseudo')
        .optional({ nullable: true }).bail()
        .isString().withMessage('Pseudo must be a string!').bail()
        .matches(/^[a-zA-Z0-9 ]+$/).withMessage('Pseudo can only contain letters, numbers and spaces!').bail()
        .isLength({ min: 3 }).withMessage('Pseudo must contain at least 3 characters!').bail()
        .isLength({ max: 20 }).withMessage('Pseudo cannot exceed 20 characters!').bail()
        .customSanitizer(value => {
            const trimmedPseudo = trimInput(value);
            return capitalizeEachWord(trimmedPseudo);
        })
];


/*============ EXPORT MODULE ============*/
module.exports = pseudoValidationRules;