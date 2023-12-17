/*============ CHECK IF REQUEST METHOD IS ALLOWED ============*/
// Check method verb
const allowedMethodCheck = (allowedMethods) => {
    return (req, res, next) => {
        const method = req.method;
        if (!allowedMethods.includes(method)) {
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        next();
    };
};


/*============ EXPORT MODULE ============*/
module.exports = allowedMethodCheck;
