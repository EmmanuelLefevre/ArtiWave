/*============ IMPORT USED MODULES ============*/
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../_models/IUser');
const ErrorHandler = require('../miscellaneous/errorHandler');


/*============ AUTHENTIFICATION ============*/

/*=== ARGON2 ===*/
const timeCost = parseInt(process.env.ARGON2_TIME_COST);
const memoryCost = parseInt(process.env.ARGON2_MEMORY_COST);


/*=== LOGIN ===*/
exports.login = async (req, res) => {
    // Extract email && password properties from request
    const { email, password } = req.body;

    try {
        // Check if user exist
        let user = await User.findOne({ email: email }).exec();

        if (user === null) {
            return res.status(401).json({ message: 'This account does not exists!'})
        }

        // Password check
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
            pseudo: user.pseudo,
            registeredAt: user.registeredAt
        }, privateKey, { expiresIn: process.env.JWT_TTL, algorithm: 'RS256'});

        return res.status(200).json({ access_token: token, message: 'User connected!', pseudo: user.pseudo });
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}
