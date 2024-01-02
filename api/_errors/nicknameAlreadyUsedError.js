/*=====================================================*/
/*============ nicknameAlreadyUsedError.js ============*/
/*=====================================================*/


/*============ NICKANME ALREADY USED ERROR ============*/
class NicknameAlreadyUsedError extends Error {
    constructor(message = 'Nickname is already used!', statusCode = 409) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'NicknameAlreadyUsedError';
    }
}


/*============ EXPORT MODULE ============*/
module.exports = NicknameAlreadyUsedError;
