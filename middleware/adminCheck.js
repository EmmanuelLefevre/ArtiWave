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
const adminCheck = (req, res, next) => {
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

            // Check if admin role exists in JWT
            req.isAdmin = decodedToken.roles && decodedToken.roles === 'admin';

            if (req.isAdmin) {
                next();
            }
            else {
                return ErrorHandler.handleUserPermissionDenied(res, err);
            }
        });
    }
    catch (err) {
        return ErrorHandler.sendInternalServerError(res, err);
    }
}


/*============ EXPORT MODULE ============*/
module.exports = adminCheck;
