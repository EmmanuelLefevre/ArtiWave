/*======================================================*/
/*============ articleResponseValidation.js ============*/
/*======================================================*/


/*============ IMPORT USED MODULES ============*/
const { object, string, array, number } = require('yup');


/*============ VALIDATION SCHEMA ============*/

/*=== GET ARTICLE ===*/

/*----- ADMIN ARTICLE RESPONSE VALIDATION -----*/
const ArticleResponseValidationRoleAdmin = object({
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
const ArticleResponseValidationBase = object({
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
const ArticlesResponseValidationRoleAdmin = object({
    data: array().of(ArticleResponseValidationRoleAdmin).required(),
    dataCount: number().integer().required()
});

/*----- BASE GET ALL ARTICLE RESPONSE VALIDATION -----*/
const ArticlesResponseValidationBase = object({
    data: array().of(ArticleResponseValidationBase).required(),
    dataCount: number().integer().required()
});


/*=== UPDATE ARTICLE ===*/

/*----- ADMIN ARTICLE UPDATED RESPONSE VALIDATION -----*/
const ArticleUpdatedResponseValidationRoleAdmin = object({
    data: (ArticleResponseValidationRoleAdmin).required(),
    modifiedProperties: object().required()
});

/*----- BASE ARTICLE UPDATED RESPONSE VALIDATION -----*/
const ArticleUpdatedResponseValidationBase = object({
    data: (ArticleResponseValidationBase).required(),
    modifiedProperties: object().required()
});


/*============ EXPORT MODULE ============*/
module.exports = {
    ArticleResponseValidationRoleAdmin,
    ArticleResponseValidationBase,
    ArticlesResponseValidationRoleAdmin,
    ArticlesResponseValidationBase,
    ArticleUpdatedResponseValidationRoleAdmin,
    ArticleUpdatedResponseValidationBase
};
