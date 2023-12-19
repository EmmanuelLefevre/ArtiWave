/*===========================================*/
/*============ userRepository.js ============*/
/*===========================================*/


/*============ IMPORT USED MODULES ============*/
const User = require('../_models/IUser');

const InternalServerError = require('../_errors/internalServerError');
const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ FIND USER BY EMAIL ============*/
class UserRepository {
	static async findUserByEmail(email) {
		try {
			const user = await User.findOne({ email: email });
				if (!user) {
					throw UserNotFoundError();
				}
			return user;
		}
		catch (err) {
			if (err instanceof UserNotFoundError) {
                throw err;
            }
			else {
                throw InternalServerError();
            }
		}
	}
}


/*============ EXPORT MODULE ============*/
module.exports = UserRepository;
