/*============ IMPORT USED MODULES ============*/
const { body } = require('express-validator');

const trimInput = require('../../utils/trimInput');
const capitalizeFirstLetter = require('../../utils/capitalizeFirstLetter');


/*============ ARTICLE VALIDATION ============*/
const articleValidationRules = () => {
    return [
        body('title')
            .optional({ nullable: true }).bail()
            .isString().withMessage('Title must be a string!').bail()
            .matches(/^[a-zA-Z0-9 !?()&+\-'"\u00E0\u00E2\u00E4\u0101\u00E7\u00EA\u00E9\u00E8\u00EB\u0113\u00EF\u00EE\u012B\u00F1\u00F4\u00F6\u014D\u00FB\u00FC\u016B]+$/).withMessage('Title can only contain letters, numbers, spaces and some classic special characters ("!?-&()+")!').bail()
            .isLength({ min: 3 }).withMessage('Title must contain at least 3 characters!').bail()
            .isLength({ max: 30 }).withMessage('Title cannot exceed 30 characters!').bail()
            .customSanitizer(value => {
                const trimmedTitle = trimInput(value);
                return capitalizeFirstLetter(trimmedTitle);
            }),
        body('content')
            .optional({ nullable: true }).bail()
            .isString().withMessage('Content must be a string!').bail()
            .matches(/^[a-zA-Z0-9 !@#\$\/\-€|£%¤+^µ&\*\(\),;.?='"`:\°\\{}\|<>\u00E0\u00E2\u00E4\u0101\u00E7\u00EA\u00E9\u00E8\u00EB\u0113\u00EF\u00EE\u012B\u00F1\u00F4\u00F6\u014D\u00FB\u00FC\u016B]+$/).withMessage('Content can\'t accept some of your special characters!').bail()
            .isLength({ min: 75 }).withMessage('Content must contain at least 75 characters!').bail()
            .isLength({ max: 1000 }).withMessage('Content cannot exceed 1000 characters!').bail()
            .customSanitizer(value => {
                const trimmedContent = trimInput(value);
                return capitalizeFirstLetter(trimmedContent);
            }),
        body('author')
            .optional({ nullable: true }).bail()
            .matches(/^[a-f0-9]+$/).withMessage('Invalid parameter!')

    ];
};


/*============ EXPORT MODULE ============*/
module.exports = articleValidationRules;
