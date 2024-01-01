/*===========================================*/
/*============ userRepository.js ============*/
/*===========================================*/


/*============ IMPORT USED MODULES ============*/
// Models
const Article = require('../models/IArticle');
const User = require('../models/IUser');

// Errors
const AccountAlreadyExistsError = require('../_errors/accountAlreadyExistsError');
const InternalServerError = require('../_errors/internalServerError');
const NicknameAlreadyUsedError = require('../_errors/nicknameAlreadyUsedError');
const UserNotFoundError = require('../_errors/userNotFoundError');


/*============ USER REPOSITORY ============*/
class UserRepository {

    /*=== AUTHENTIFICATION ===*/
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

    /*=== USER EXISTS ===*/
    static async userExists(userId) {
        try {
            const existingUser = await User.findById(userId);
            return !!existingUser;
        }
        catch (err) {
            throw err;
        }
    }

    /*=== REGISTER USER ===*/
    static async registerUser(newUser) {
        try {
            // Save user in the database
            let user = await newUser.save();

            // Return created user
            return {
                email: user.email,
                nickname: user.nickname,
                registeredAt: user.registeredAt
            };
        }
        catch (err) {
            if (err.code === 11000) {
                if (err.keyPattern.email) {
                    throw new AccountAlreadyExistsError();
                }
                else if (err.keyPattern.nickname) {
                    throw new NicknameAlreadyUsedError();
                }
            }
            throw err;
        }
    }

    /*=== GET ALL USERS ===*/
    static async getAllUsers() {
        try {
            return User.find({}, 'id email nickname roles registeredAt updatedAt');
        }
        catch (err) {
            throw err;
        }
    }

    /*=== GET SINGLE USER ===*/
    static async getUserById(userId) {
        try {
            return User.findById(userId, { _id: 1, email: 1, nickname: 1, roles: 1, registeredAt: 1, updatedAt: 1 });
        }
        catch (err) {
            throw err;
        }
    }

    /*=== UPDATE USER ===*/
    static async updateUserById(userId, updatedData) {
        try {
            return User.findByIdAndUpdate(
                userId,
                { $set: updatedData },
                { new: true }
            );
        }
        catch (err) {
            if (err.code === 11000) {
                if (err.keyPattern.email) {
                    throw new AccountAlreadyExistsError();
                }
                else if (err.keyPattern.nickname) {
                    throw new NicknameAlreadyUsedError();
                }
            }
            throw err;
        }
    }

    /*=== DELETE USER ===*/
    static async deleteUserById(userId) {
        try {
            const result = await User.deleteOne({ _id: userId });

            // Cascade delete articles owned by user
            if (result.deletedCount > 0) {
                await Article.deleteMany({ author: userId });
            }

            return result.deletedCount;
        }
        catch (err) {
            throw err;
        }
    }
}


/*============ EXPORT MODULE ============*/
module.exports = UserRepository;
