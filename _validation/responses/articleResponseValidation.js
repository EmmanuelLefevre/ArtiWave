/*============ IMPORT USED MODULES ============*/
const { object, string, array, number } = require('yup');


/*============ VALIDATION SCHEMA ============*/

/*=== GET ARTICLE ===*/

/*----- ADMIN ARTICLE RESPONSE VALIDATION -----*/
const articleResponseValidationRoleAdmin = object({
    _id: string().matches(/^[0-9a-fA-F]{24}$/).required(),
    title: string().required(),
    content: string().required(),
    author: object({
        _id: string().matches(/^[0-9a-fA-F]{24}$/).required(),
        nickname: string().required(),
        roles: string().required()
    }).required(),
    createdAt: string().required(),
    updatedAt: string().required()
});

/*----- BASE ARTICLE RESPONSE VALIDATION -----*/
const articleResponseValidationBase = object({
    title: string().required(),
    content: string().required(),
    author: object({
        nickname: string().required(),
    }).required(),
    createdAt: string().required(),
    updatedAt: string().required()
});


/*=== GET ALL ARTICLES ===*/

/*----- ADMIN GET ALL ARTICLE RESPONSE VALIDATION -----*/
const articlesResponseValidationRoleAdmin = object({
    data: array().of(articleResponseValidationRoleAdmin).required(),
    dataCount: number().integer().required()
});

/*----- BASE GET ALL ARTICLE RESPONSE VALIDATION -----*/
const articlesResponseValidationBase = object({
    data: array().of(articleResponseValidationBase).required(),
    dataCount: number().integer().required()
});


/*=== UPDATE ARTICLE ===*/

/*----- ADMIN ARTICLE UPDATED RESPONSE VALIDATION -----*/
const articleUpdatedResponseValidationRoleAdmin = object({
    data: (articleResponseValidationRoleAdmin).required(),
    modifiedProperties: object().required()
});

/*----- BASE ARTICLE UPDATED RESPONSE VALIDATION -----*/
const articleUpdatedResponseValidationBase = object({
    data: (articleResponseValidationBase).required(),
    modifiedProperties: object().required()
});


/*============ EXPORT MODULE ============*/
module.exports = {
    articleResponseValidationRoleAdmin,
    articleResponseValidationBase,
    articlesResponseValidationRoleAdmin,
    articlesResponseValidationBase,
    articleUpdatedResponseValidationRoleAdmin,
    articleUpdatedResponseValidationBase
};
