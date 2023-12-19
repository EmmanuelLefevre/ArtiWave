/*===========================================*/
/*============ authController.js ============*/
/*===========================================*/


/*============ IMPORT USED MODULES ============*/
const AuthService = require('../services/authServices');

const BadCredentialsError = require('../_errors/badCredentialsError');
const LoginLimiterError = require('../_errors/loginLimiterError');
const ResponseValidationError = require('../_errors/responseValidationError');
const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ AUTHENTIFICATION ============*/

// Counter for login failed
let failedLoginAttempts = 0;
// Store timestamp of the last failed login attempt
let lastFailedLoginDate = null;

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
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

        const response = await AuthService.login(email, password);

        // Reset counter when login is successful
        failedLoginAttempts = 0;

        return res.status(200).json(response);

    }
    catch (err) {
        if (err instanceof BadCredentialsError ||
            err instanceof UserNotFoundError ||
            err instanceof LoginLimiterError ||
            err instanceof ResponseValidationError) {

            failedLoginAttempts++;
            lastFailedLoginDate = new Date();

            return res.status(err.statusCode).json({ message: err.message });
        }
        else {
            throw new Error('Unexpected Error!');
        }
    }
};
