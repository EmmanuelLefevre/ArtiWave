/*============ CHECK IF REQUEST CURRENT METHOD IS ALLOWED ============*/
// Check method verb
const allowedCurrentMethodCheck = (allowedMethods) => {
    return (req, res, next) => {
        const currentMethod = req.method;

        if (!allowedMethods.includes(currentMethod)) {
            return res.status(405).json({ message: 'Method Not Allowed!' });
        }
        next();
    };
};


/*============ EXPORT MODULE ============*/
module.exports = allowedCurrentMethodCheck;
