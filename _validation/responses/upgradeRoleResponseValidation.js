/*============ IMPORT USED MODULES ============*/
const { object, string, array } = require('yup');


/*============ VALIDATION SCHEMA ============*/

/*=== UPGRADE ROLE RESPONSE VALIDATION ===*/
const upgradeRoleResponseValidation = object({
    data: array().of(
        object({
            _id: string().matches(/^[0-9a-fA-F]{24}$/).required(),
            nickname: string().required(),
            roles: string().required()
        })
    ).required(),
    message: string().required()
});


/*============ EXPORT MODULE ============*/
module.exports = {
    upgradeRoleResponseValidation
};
