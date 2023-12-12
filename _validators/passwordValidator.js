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











































// module.exports.validatePassword = (password) => {
    //     const errors = [];
    
    //     if (!validator.isStrongPassword(password, { minLength: 8 })) {
        //         errors.push('Password must contain at least 8 characters!');
//         return errors;
//     }

//     if (!validator.isStrongPassword(password, { minUppercase: 1 })) {
//         errors.push('Password must contain at least one uppercase!');
//         return errors;
//     }

//     if (!validator.isStrongPassword(password, { minNumbers: 1 })) {
//         errors.push('Password must contain at least one number!');
//         return errors;
//     }

//     if (!validator.isStrongPassword(password, { minSymbols: 1 })) {
    //         errors.push('Password must contain at least one special character!');
    //         return errors;
    //     }
    
    //     if (!validator.isStrongPassword(password, { maxLength: 24 })) {
        //         errors.push('Password cannot exceed 24 characters!');
        //         return errors;
        //     }
        // };



// module.exports.validatePassword = (password) => {
//     const errors = [];
//     let isErrorFound = false;
//     const validationRules = [
//         { rule: () => validator.isStrongPassword(password, { minUppercase: 1 }), error: 'Password must contain at least one uppercase!' },
//         { rule: () => validator.isStrongPassword(password, { minNumbers: 1 }), error: 'Password must contain at least one number!' },
//         { rule: () => validator.isStrongPassword(password, { minSymbols: 1 }), error: 'Password must contain at least one special character!' },
//         { rule: () => validator.isStrongPassword(password, { minLength: 8 }), error: 'Password must contain at least 8 characters!' },
//         { rule: () => validator.isStrongPassword(password, { maxLength: 24 }), error: 'Password cannot exceed 24 characters!' }
//     ];

//     validationRules.forEach((rule) => {
//         if (!isErrorFound && !rule.rule()) {
//             errors.push(rule.error);
//             isErrorFound = true;
//         }
//     });

//     return errors;
// };
