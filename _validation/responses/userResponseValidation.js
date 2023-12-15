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

/*----- CERTIFIED RESPONSE VALIDATION -----*/
const userResponseValidationRoleCertified = object({
    email: string().required(),
    nickname: string().required(),
    registeredAt: string().required(),
    updatedAt: string().required()
});

/*----- USER RESPONSE VALIDATION -----*/
const userResponseValidationRoleUser = object({
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
    data: array().of(userResponseValidationRoleCertified).required(),
    dataCount: number().integer().required()
});



/*=== UPDATE USER ===*/

/*----- ADMIN USER UPDATED RESPONSE VALIDATION -----*/
const userUpdatedResponseValidationRoleAdmin = object({
    data: array().of(userResponseValidationRoleAdmin).required(),
    modifiedProperties: object().required()
});

/*----- CERTIFIED USER UPDATED RESPONSE VALIDATION -----*/
const userUpdatedResponseValidationRoleCertified = object({
    data: array().of(userResponseValidationRoleCertified).required(),
    modifiedProperties: object().required()
});

/*----- USER UPDATED RESPONSE VALIDATION -----*/
const userUpdatedResponseValidationRoleUser = object({
    data: array().of(userResponseValidationRoleUser).required(),
    modifiedProperties: object().required()
});


/*============ EXPORT MODULE ============*/
module.exports = {
    userTokenResponseValidation,
    userResponseValidationRoleAdmin,
    userResponseValidationRoleCertified,
    userResponseValidationRoleUser,
    usersResponseValidationRoleAdmin,
    usersResponseValidationRoleCertified,
    userUpdatedResponseValidationRoleAdmin,
    userUpdatedResponseValidationRoleCertified,
    userUpdatedResponseValidationRoleUser
};
