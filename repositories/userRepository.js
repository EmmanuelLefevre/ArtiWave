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

    /*=== FIND USER BY EMAIL ===*/
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

    /*=== FIND USER BY ID ===*/
    static async findUserById (userId, next) {
        try {
            return await User.findById(userId, { _id: 1, email: 1, nickname: 1, roles: 1, registeredAt: 1, updatedAt: 1 });
        }
        catch (err) {
            next(new InternalServerError());
        }
    }

    /*=== USER EXISTS ===*/
    static async userExists(userId, next) {
        try {
            const existingUser = await User.findById(userId);
            return !!existingUser;
        }
        catch (err) {
            next(new InternalServerError());
        }
    }

    /*=== GET ALL USERS ===*/
    static async getAllUsers(next) {
        try {
            return await User.find({}, 'id email nickname roles registeredAt updatedAt');
        }
        catch (err) {
            next(new InternalServerError());
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = UserRepository;
