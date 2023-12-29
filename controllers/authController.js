/*===========================================*/
/*============ authController.js ============*/
/*===========================================*/


/*============ IMPORT USED MODULES ============*/
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Repositories
const UserRepository = require('../repositories/userRepository');

// Response validation
const { UserTokenResponseValidation } = require('../_validation/responses/userResponseValidation');

// Errors
const BadCredentialsError = require('../_errors/badCredentialsError');
const InternalServerError = require('../_errors/internalServerError');
const LoginLimiterError = require('../_errors/loginLimiterError');
const ResponseValidationError = require('../_errors/responseValidationError');
const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ AUTHENTIFICATION ============*/
// Counter for login failed
let failedLoginAttempts = 0;
// Store timestamp of the last failed login attempt
let lastFailedLoginDate = null;

class AuthController {

    /*=== RATE LIMIT ===*/
    static #resetRateLimit() {
        failedLoginAttempts = 0;
        lastFailedLoginDate = null;
    }

    /*=== LOGIN ===*/
    static login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (lastFailedLoginDate && failedLoginAttempts >= 5) {
                const currentTime = new Date();
                const timeDiff = currentTime - lastFailedLoginDate;

                // Block attempts for one hour
                if (timeDiff < 60 * 60 * 1000) {
                    throw new LoginLimiterError();
                }
                else {
                    // Reset counter after one hour
                    AuthController.#resetRateLimit();
                }
            }

            UserRepository.findUserByEmail(email)
            .then(async user => {
                // Password check
                const timeCost = parseInt(process.env.ARGON2_TIME_COST);
                const memoryCost = parseInt(process.env.ARGON2_MEMORY_COST);

                try {
                    const passwordMatch = await argon2.verify(user.password, password, {
                        timeCost: timeCost,
                        memoryCost: memoryCost
                    });

                    if (!passwordMatch) {
                        // Increment counter
                        failedLoginAttempts++;
                        lastFailedLoginDate = new Date();

                        throw new BadCredentialsError();
                    }

                    // JWT generation
                    const privateKeyPath = process.env.PRIVATE_KEY_PATH;
                    const privateKey = fs.readFileSync(privateKeyPath);
                    const token = jwt.sign({
                        id: user.id,
                        roles: user.roles,
                        nickname: user.nickname,
                        registeredAt: user.registeredAt
                    }, privateKey, { expiresIn: process.env.JWT_TTL, algorithm: 'RS256' });

                    // Set response
                    const response = {
                        access_token: token,
                        nickname: user.nickname
                    };

                    // Validate response format
                    try {
                        await UserTokenResponseValidation.validate(response, { abortEarly: false });
                    }
                    catch (ValidationError) {
                        throw new ResponseValidationError();
                    }

                    // Reset counter
                    AuthController.#resetRateLimit();

                    return res.status(200).json(response);
                }
                catch (err) {
                    if (err instanceof BadCredentialsError ||
                        err instanceof ResponseValidationError) {
                        return next(err);
                    }
                    else {
                        throw new InternalServerError();
                    }
                }
            })

            .catch(err => {
                if (err instanceof UserNotFoundError) {
                    // Increment counter
                    failedLoginAttempts++;
                    lastFailedLoginDate = new Date();

                    next(new BadCredentialsError());
                }
                else {
                    next(new InternalServerError());
                }
            });
        }
        catch (err) {
            if (err instanceof BadCredentialsError ||
                err instanceof LoginLimiterError ||
                err instanceof InternalServerError) {
                return next(err);
            }
            else {
                throw new InternalServerError();
            }
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AuthController;
