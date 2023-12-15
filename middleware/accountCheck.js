/*============ CHECK IF REQUEST HAS AUTHORIZATION ============*/
// Check user own an account
const accountCheck = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'This feature is reserved for users who own an account!' });
    }

    next();
};


/*============ EXPORT MODULE ============*/
module.exports = accountCheck;
