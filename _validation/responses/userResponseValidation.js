/*============ IMPORT USED MODULES ============*/
const { object, string, array, number } = require('yup');


/*============ VALIDATION SCHEMA ============*/

/*=== TOKEN RESPONSE VALIDATION ===*/
const userTokenResponseValidation = object({
    access_token: string().required(),
    nickname: string().required()
});



/*=== GET USER ===*/

/*----- ADMIN RESPONSE VALIDATION -----*/
const userResponseValidationRoleAdmin = object({
    _id: string().matches(/^[0-9a-fA-F]{24}$/).required(),
    email: string().required(),
    nickname: string().required(),
    registeredAt: string().required(),
    updatedAt: string().required()
});

/*----- BASE USER RESPONSE VALIDATION -----*/
const userResponseValidationBase = object({
    email: string(),
    nickname: string().required(),
    registeredAt: string().required(),
    updatedAt: string().required()
});



/*=== GET ALL USERS ===*/

/*----- ADMIN GET ALL USERS RESPONSE VALIDATION -----*/
const usersResponseValidationRoleAdmin = object({
    data: array().of(userResponseValidationRoleAdmin).required(),
    dataCount: number().integer().required()
});

/*----- CERTIFIED GET ALL USERS RESPONSE VALIDATION -----*/
const usersResponseValidationRoleCertified = object({
    data: array().of(userResponseValidationBase).required(),
    dataCount: number().integer().required()
});



/*=== UPDATE USER ===*/

/*----- ADMIN USER UPDATED RESPONSE VALIDATION -----*/
const userUpdatedResponseValidationRoleAdmin = object({
    data: array().of(userResponseValidationRoleAdmin).required(),
    modifiedProperties: object().required()
});

/*----- BASE USER UPDATED RESPONSE VALIDATION -----*/
const userUpdatedResponseValidationBase = object({
    data: array().of(userResponseValidationBase).required(),
    modifiedProperties: object().required()
});


/*============ EXPORT MODULE ============*/
module.exports = {
    userTokenResponseValidation,
    userResponseValidationRoleAdmin,
    userResponseValidationBase,
    usersResponseValidationRoleAdmin,
    usersResponseValidationRoleCertified,
    userUpdatedResponseValidationRoleAdmin,
    userUpdatedResponseValidationBase
};
