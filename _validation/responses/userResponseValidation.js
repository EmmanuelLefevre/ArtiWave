/*============ IMPORT USED MODULES ============*/
const { object, string, array, number } = require('yup');


/*============ VALIDATION SCHEMA ============*/

/*=== GET ALL USERS RESPONSE VALIDATION ===*/
const userTokenResponseValidation = object({
    access_token: string().required(),
    nickname: string().required()
});


/*=== USER RESPONSE VALIDATION ===*/
const userResponseValidation = object({
    _id: string().matches(/^[0-9a-fA-F]{24}$/).required(),
    email: string().required(),
    nickname: string().required(),
    registeredAt: string().required(),
    updatedAt: string().required()
});


/*=== GET ALL USERS RESPONSE VALIDATION ===*/
const usersResponseValidation = object({
    data: array().of(userResponseValidation).required(),
    dataCount: number().integer().required()
});


/*============ EXPORT MODULE ============*/
module.exports = {
    userResponseValidation,
    usersResponseValidation,
    userTokenResponseValidation
};