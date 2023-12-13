/*============ IMPORT USED MODULES ============*/
const rateLimiter = require('express-rate-limit');


/*============ RATE-LIMITER ============*/

/*=== REQUEST LIMITER ===*/
const requestsLimiter = rateLimiter({
    max: 10,
    windowMs: 1000, // 1 seconde
    message:"Stop that Mr Robot!",
    standartHeaders: false,
    legacyHeaders: false
})

/*=== REGISTER LIMITER ===*/
const registerLimiter = rateLimiter({
    max: 1,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    message:"You can only create one account per day!",
    standartHeaders: false,
    legacyHeaders: false
})

/*=== LOGIN LIMITER ===*/
const loginLimiter = rateLimiter({
    max: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    message:"The number of connection attempts is limited to 5 per hour!",
    standartHeaders: false,
    legacyHeaders: false
})

/*=== CREATE ARTICLE LIMITER ===*/
const createArticleLimiter = rateLimiter({
    max: 5,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    message:"You can only create 5 articles per day!",
    standartHeaders: false,
    legacyHeaders: false
})


/*============ EXPORT MODULE ============*/
module.exports = {
    requestsLimiter,
    registerLimiter,
    loginLimiter,
    createArticleLimiter
};