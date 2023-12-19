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

class AuthController {
    static login(req, res) {
        return new Promise(async (resolve, reject) => {
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
                        failedLoginAttempts = 0;
                    }
                }

                await AuthService.login(email, password)
                    .then(response => {
                        // Reset counter when login is successful
                        failedLoginAttempts = 0;

                        // Send response
                        resolve(res.status(200).json(response));
                    })
                    .catch(err => {
                        failedLoginAttempts++;
                        lastFailedLoginDate = new Date();

                        if (err instanceof BadCredentialsError ||
                            err instanceof ResponseValidationError ||
                            err instanceof InternalServerError) {
                            reject(res.status(err.statusCode).json({ message: err.message }));
                        }
                        else {
                            reject(InternalServerError());
                        }
                    });
            }
            catch (err) {
                if (err instanceof LoginLimiterError) {
                    reject(res.status(err.statusCode).json({ message: err.message }));
                }
                else {
                    reject(InternalServerError());
                }
            }
        })
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AuthController;
