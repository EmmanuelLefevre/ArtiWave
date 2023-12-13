/*============ IMPORT USED MODULES ============*/
const { object, string, array, number } = require('yup');


/*============ VALIDATION SCHEMA ============*/

/*=== ARTICLE RESPONSE VALIDATION ===*/
const articleResponseValidation = object({
    _id: string().matches(/^[0-9a-fA-F]{24}$/).required(),
    title: string().required(),
    content: string().required(),
    author: object({
        _id: string().matches(/^[0-9a-fA-F]{24}$/).required(),
        nickname: string().required(),
    }).required(),
    createdAt: string().required(),
    updatedAt: string().required()
});


/*=== GET ALL ARTICLE RESPONSE VALIDATION ===*/
const articlesResponseValidation = object({
    data: array().of(articleResponseValidation).required(),
    dataCount: number().integer().required()
});


/*============ EXPORT MODULE ============*/
module.exports = {
    articleResponseValidation,
    articlesResponseValidation
};
