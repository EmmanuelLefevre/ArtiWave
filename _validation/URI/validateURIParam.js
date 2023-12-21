/*=============================================*/
/*============ validateURIParam.js ============*/
/*=============================================*/


/*============ IMPORT USED MODULES ============*/
const { param } = require('express-validator');


/*============ VALIDATE PARAM MODULE ============*/
const validateURIParam = (paramName) => [
    param(paramName)
        .notEmpty()
        .trim()
        .custom(value => /^[a-f 0-9]+$/.test(value)).withMessage('Invalid URI Format!')
];


/*============ EXPORT MODULE ============*/
module.exports = validateURIParam;
