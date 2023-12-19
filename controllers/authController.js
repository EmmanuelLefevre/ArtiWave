/*===========================================*/
/*============ authController.js ============*/
/*===========================================*/


/*============ IMPORT USED MODULES ============*/
const AuthService = require('../services/authServices');

const BadCredentialsError = require('../_errors/badCredentialsError');
const InternalServerError = require('../_errors/internalServerError');
const LoginLimiterError = require('../_errors/loginLimiterError');
const ResponseValidationError = require('../_errors/responseValidationError');


/*============ AUTHENTIFICATION ============*/

// Counter for login failed
let failedLoginAttempts = 0;
// Store timestamp of the last failed login attempt
let lastFailedLoginDate = null;

exports.login = (req, res) => {
    const { email, password } = req.body;

    return new Promise((resolve, reject) => {
        try {
            if (lastFailedLoginDate && failedLoginAttempts >= 5) {
                const currentTime = new Date();
                const timeDiff = currentTime - lastFailedLoginDate;

                // Block attempts for one hour
                if (timeDiff < 60 * 60 * 1000) {
                    throw new LoginLimiterError();
                } else {
                    // Reset counter after one hour
                    failedLoginAttempts = 0;
                }
            }

            AuthService.login(email, password)
                .then(response => {
                    // Reset counter when login is successful
                    failedLoginAttempts = 0;
                    resolve(res.status(200).json(response));
                })
                .catch(err => {
                    failedLoginAttempts++;
                    lastFailedLoginDate = new Date();

                    if (err instanceof BadCredentialsError ||
                        err instanceof LoginLimiterError ||
                        err instanceof ResponseValidationError ||
                        err instanceof InternalServerError) {
                        reject(res.status(err.statusCode).json({ message: err.message }));
                    } else {
                        reject(InternalServerError());
                    }
                });
        } catch (err) {
            reject(InternalServerError());
        }
    });
};
