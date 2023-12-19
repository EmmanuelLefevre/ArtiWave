/*===========================================*/
/*============ userRepository.js ============*/
/*===========================================*/


/*============ IMPORT USED MODULES ============*/
const User = require('../_models/IUser');

const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ FIND USER BY EMAIL ============*/
class UserRepository {
	static async findUserByEmail(email) {
		try {
			const user = await User.findOne({ email: email });
				if (!user) {
					return null;
				}
			return user;
		}
		catch (err) {
			if (err instanceof UserNotFoundError) {
                throw err;
            }
			else {
                throw new Error('Unexpected Error!');
            }
		}
	}
}


/*============ EXPORT MODULE ============*/
module.exports = UserRepository;
