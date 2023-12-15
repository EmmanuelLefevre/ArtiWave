/*============ CHECK IF REQUEST HAS ROLE ADMIN OR CERTIFIED ============*/
// Check if user has required role (admin or certified)
const premiumCheck = (req, res, next) => {
    if (!(req.isAdmin || req.isCertified)) {
        return res.status(401).json({ message: 'You are not allowed to search all users!' });
    }

    next();
};


/*============ EXPORT MODULE ============*/
module.exports = premiumCheck;
