/*============ IMPORT USED MODULES ============*/
const rateLimiter = require('express-rate-limit');


/*============ RATE-LIMITER ============*/

/*=== REQUEST LIMITER ===*/
const requestsLimiter = rateLimiter({
    max: 10,
    windowsMs: 1000, // 1 seconde
    message:"Stop that Mr Robot!",
    standartHeaders: false,
    legacyHeaders: false
})

/*=== REGISTER LIMITER ===*/
const registerLimiter = rateLimiter({
    max: 1,
    windowsMs: 24 * 60 * 60 * 1000, // 24 heures
    message:"You can only create one account per day!",
    standartHeaders: false,
    legacyHeaders: false
})

/*=== LOGIN LIMITER ===*/
const loginLimiter = rateLimiter({
    max: 5,
    windowsMs: 60 * 60 * 1000, // 1 heure
    message:"The number of connection attempts is limited to 3 per hour!",
    standartHeaders: false,
    legacyHeaders: false
})


/*============ EXPORT MODULE ============*/
module.exports = {
    requestsLimiter,
    registerLimiter,
    loginLimiter
};