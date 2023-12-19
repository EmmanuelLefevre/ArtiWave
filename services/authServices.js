/*========================================*/
/*============ authService.js ============*/
/*========================================*/


/*============ IMPORT USED MODULES ============*/
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const UserRepository = require('../repositories/userRepository');

const { UserTokenResponseValidation } = require('../_validation/responses/userResponseValidation');

const BadCredentialsError = require('../_errors/badCredentialsError');
const InternalServerError = require('../_errors/internalServerError');
const ResponseValidationError = require('../_errors/responseValidationError');
const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ AUTHENTIFICATION SERVICE ============*/
class AuthService {
    static login(email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                // Use the repository to find the user by email
                const user = await UserRepository.findUserByEmail(email);

                // Password check
                const timeCost = parseInt(process.env.ARGON2_TIME_COST);
                const memoryCost = parseInt(process.env.ARGON2_MEMORY_COST);

                let passwordMatch = await argon2.verify(user.password, password, {
                    timeCost: timeCost,
                    memoryCost: memoryCost
                });

                if (!passwordMatch) {
                    reject(new BadCredentialsError());
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
                    reject(new ResponseValidationError());
                    return;
                }

                resolve(response);
            }
			catch (err) {
				if (err instanceof UserNotFoundError) {
                    reject(new BadCredentialsError());
				}
                else if (err instanceof BadCredentialsError ||
                    err instanceof ResponseValidationError ||
                    err instanceof InternalServerError) {
                    reject(err);
                }
				else {
                    reject(new InternalServerError());
                }
            }
        });
    }
}


/*============ EXPORT MODULE ============*/
module.exports = AuthService;
