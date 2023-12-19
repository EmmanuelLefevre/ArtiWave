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
const ResponseValidationError = require('../_errors/responseValidationError');
const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ AUTHENTIFICATION SERVICE ============*/
class AuthService {
	static async login(email, password) {

		try {
			// Use the repository to find the user by email
			const user = await UserRepository.findUserByEmail(email);

			if (!user) {
				throw new BadCredentialsError();
			}

			// Password check
			const timeCost = parseInt(process.env.ARGON2_TIME_COST);
			const memoryCost = parseInt(process.env.ARGON2_MEMORY_COST);

			let passwordMatch = await argon2.verify(user.password, password, {
				timeCost: timeCost,
				memoryCost: memoryCost
			});

			if (!passwordMatch) {
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
				throw new ResponseValidationError('Validation Response Error!', 500);
			}

			return response;
		}
		catch (err) {
			if (err instanceof BadCredentialsError ||
				err instanceof UserNotFoundError ||
				err instanceof ResponseValidationError) {
                throw err;
            }
			else {
                throw new Error('Unexpected Error!');
            }
		}
	}
}


/*============ EXPORT MODULE ============*/
module.exports = AuthService;
