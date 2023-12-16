/*============ IMPORT USED MODULES ============*/
const jwt = require('jsonwebtoken');
const fs = require('fs');

const ErrorHandler = require('../_errors/errorHandler');


/*============ EXTRACT TOKEN FROM HEADER ============*/
const extractBearer = authorization => {
    if (typeof authorization !== 'string') {
        return false;
    }
    // Regexp to isole token
    const matches = authorization.match(/(bearer)\s+(\S+)/i);

    return matches && matches[2];
}


/*============ CHECK IF TOKEN IS PRESENT AND CHECK IT ============*/
const jwtCheck = (req, res, next) => {
    try {
        const token = req.headers.authorization && extractBearer(req.headers.authorization);

        if (!token) {
            return res.status(401).json({ message: 'No JWT found!'});
        }

        // Check JWT
        const publicKeyPath = process.env.PUBLIC_KEY_PATH;
        const publicKey = fs.readFileSync(publicKeyPath);

        jwt.verify(token, publicKey, { algorithms: ['RS256'] }, function (err, decodedToken) {
            if (err) {
                return res.status(401).json({message: 'False token!'});
            }

            // Set userId from JWT in request object
            req.userId = decodedToken.id;

            // Set user role from JWT in request object
            req.userRole = decodedToken.roles;
            // Check if admin role exists in JWT
            req.isAdmin = decodedToken.roles && decodedToken.roles === 'admin';
            // Check if certified role exists in JWT
            req.isCertified = decodedToken.roles && decodedToken.roles === 'certified';
            // Check if user role exists in JWT
            req.isUser = decodedToken.roles && decodedToken.roles === 'user';

            next();
        });
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
}


/*============ EXPORT MODULE ============*/
module.exports = jwtCheck;
