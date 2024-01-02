/*===========================================*/
/*============ articlesLogger.js ============*/
/*===========================================*/


/*============ IMPORT USED MODULES ============*/
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');


/*============ CREATE AN OUTPUT STREAM TO WRITE FILE ============*/
const logStream = fs.createWriteStream(path.join(__dirname, '_articlesLogs.txt'), { flags: 'a' });


/*============ JOURNALING FUNCTION ============*/
const customLogger = (tokens, req, res) => {
    // Get user's id from jwt
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    let userId = 'N/A';

    if (token) {
        try {
            // Get public key
            const publicKeyPath = path.join(__dirname, '../../_certs/pbl.pem');
            const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

            // Decode token
            const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

            // Get user id from decoded token
            userId = decoded.id || 'N/A';
        }
        catch (error) {
            console.error('Error when decoding JWT :', error.message);
        }
    }

    // Get user's IP address
    const userIP = req.ip || 'N/A';

    // Format log message
    const parisTime = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    const logMessage = `User Id:${userId} - IP:${userIP} - [${parisTime}] - method:${tokens.method(req, res)} - URI:${tokens.url(req, res)} - status-code:${tokens.status(req, res)} - ${tokens['response-time'](req, res)}ms`;

    // Write log message to stream
    logStream.write(logMessage + '\n');
};

const articlesLogs = morgan(customLogger, { stream: logStream });

/*============ EXPORT MODULE ============*/
module.exports = { articlesLogs };