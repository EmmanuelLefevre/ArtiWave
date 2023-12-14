/*============ IMPORT USED MODULES ============*/
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../_models/IUser');
const ErrorHandler = require('../_errors/errorHandler');

const { userTokenResponseValidation } = require('../_validation/responses/userResponseValidation');


/*============ AUTHENTIFICATION ============*/

/*=== LOGIN ===*/
exports.login = async (req, res) => {
    // Extract email && password properties from request
    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email: email }).exec();

        if (user === null) {
            return res.status(401).json({ message: 'This account does not exists!'})
        }

        // Password check
        const timeCost = parseInt(process.env.ARGON2_TIME_COST);
        const memoryCost = parseInt(process.env.ARGON2_MEMORY_COST);

        let passwordMatch  = await argon2.verify(user.password, password, {
            timeCost: timeCost,
            memoryCost: memoryCost
        });

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Wrong password!'});
        }

        // JWT generation
        const privateKeyPath = process.env.PRIVATE_KEY_PATH;
        const privateKey = fs.readFileSync(privateKeyPath);
        const token = jwt.sign({
            id: user.id,
            nickname: user.nickname,
            registeredAt: user.registeredAt
        }, privateKey, { expiresIn: process.env.JWT_TTL, algorithm: 'RS256'});

        // Set response
        const response = {
            access_token: token,
            nickname: user.nickname
        }

        // Validate response format
        try {
            await userTokenResponseValidation.validate(response, { abortEarly: false });
        }
        catch (validationError) {
            return ErrorHandler.sendValidationResponseError(res, validationError);
        }

        // Return token and nickname
        return res.status(200).json(response);
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}
