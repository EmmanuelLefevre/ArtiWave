/*===========================================*/
/*============ userRepository.js ============*/
/*===========================================*/


/*============ IMPORT USED MODULES ============*/
// Models
const User = require('../models/IUser');

// Errors
const InternalServerError = require('../_errors/internalServerError');
const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ USER REPOSITORY ============*/
class UserRepository {

    /*=== FIND USER BY ID ===*/
    static findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        reject(new UserNotFoundError());
                    }
                    resolve(user);
                })
                .catch(_err => {
                    reject(new InternalServerError());
                });
        });
    }
}


/*============ EXPORT MODULE ============*/
module.exports = UserRepository;
