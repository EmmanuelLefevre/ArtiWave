/*===========================================*/
/*============ userRepository.js ============*/
/*===========================================*/


/*============ IMPORT USED MODULES ============*/
const User = require('../_models/IUser');

const InternalServerError = require('../_errors/internalServerError');
const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ FIND USER BY EMAIL ============*/
class UserRepository {
    static findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        reject(new UserNotFoundError());
                    }
					else {
                        resolve(user);
                    }
                })
                .catch(err => {
                    if (err instanceof UserNotFoundError) {
                        reject(err);
                    }
					else {
                        reject(new InternalServerError());
                    }
                });
        });
    }
}


/*============ EXPORT MODULE ============*/
module.exports = UserRepository;
