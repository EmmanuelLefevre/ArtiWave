/*===================================================*/
/*============ userResponseValidation.js ============*/
/*===================================================*/


/*============ IMPORT USED MODULES ============*/
const { object, string, array, number } = require('yup');


/*============ VALIDATION SCHEMA ============*/

/*=== TOKEN RESPONSE VALIDATION ===*/
const UserTokenResponseValidation = object({
    access_token: string().required(),
    nickname: string().required(),
}).test(
    'contains-only-allowed-keys',
    (value) => {
        const allowedKeys = ['access_token', 'nickname'];
        const actualKeys = Object.keys(value);
        const extraKeys = actualKeys.filter(key => !allowedKeys.includes(key));
        return extraKeys.length === 0;
    }
);


/*=== REGISTER RESPONSE VALIDATION ===*/
const UserRegisterResponseValidation = object({
    email: string().required(),
    nickname: string().required(),
    registeredAt: string().required()
});


/*=== GET USER ===*/

/*----- ADMIN RESPONSE VALIDATION -----*/
const UserResponseValidationRoleAdmin = object({
    _id: string().matches(/^[0-9a-fA-F]{24}$/).required(),
    email: string().required(),
    nickname: string().required(),
    roles: string().required(),
    registeredAt: string().required(),
    updatedAt: string().required()
});

/*----- BASE USER RESPONSE VALIDATION -----*/
const UserResponseValidationBase = object({
    email: string(),
    nickname: string().required(),
    registeredAt: string().required(),
    updatedAt: string().required()
});



/*=== GET ALL USERS ===*/

/*----- ADMIN GET ALL USERS RESPONSE VALIDATION -----*/
const UsersResponseValidationRoleAdmin = object({
    data: array().of(UserResponseValidationRoleAdmin).required(),
    dataCount: number().integer().required()
});

/*----- CERTIFIED GET ALL USERS RESPONSE VALIDATION -----*/
const UsersResponseValidationRoleCertified = object({
    data: array().of(UserResponseValidationBase).required(),
    dataCount: number().integer().required()
});



/*=== UPDATE USER ===*/

/*----- ADMIN USER UPDATED RESPONSE VALIDATION -----*/
const UserUpdatedResponseValidationRoleAdmin = object({
    data: array().of(UserResponseValidationRoleAdmin).required(),
    modifiedProperties: object().required()
});

/*----- BASE USER UPDATED RESPONSE VALIDATION -----*/
const UserUpdatedResponseValidationBase = object({
    data: array().of(UserResponseValidationBase).required(),
    modifiedProperties: object().required()
});


/*============ EXPORT MODULE ============*/
module.exports = {
    UserRegisterResponseValidation,
    UserTokenResponseValidation,
    UserResponseValidationRoleAdmin,
    UserResponseValidationBase,
    UsersResponseValidationRoleAdmin,
    UsersResponseValidationRoleCertified,
    UserUpdatedResponseValidationRoleAdmin,
    UserUpdatedResponseValidationBase
};
