/*============ IMPORT USED MODULES ============*/
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');


/*============ CREATE AN OUTPUT STREAM TO WRITE FILE ============*/
const logStream = fs.createWriteStream(path.join(__dirname, '_authLogs.txt'), { flags: 'a' });


/*============ JOURNALING FUNCTION ============*/
const customLogger = (tokens, req, res) => {
    // Get user's email from body
    const userEmail = req.body.email || 'N/A';

    // Get user's IP address
    const userIP = req.ip || 'N/A';

    // Format log message
    const parisTime = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    const logMessage = `User:${userEmail} - IP:${userIP} - [${parisTime}] - method:${tokens.method(req, res)} - URI:${tokens.url(req, res)} - status-code:${tokens.status(req, res)} - ${tokens['response-time'](req, res)}ms`;

    // Write log message to stream
    logStream.write(logMessage + '\n');
};

const authLogs = morgan(customLogger, { stream: logStream });

/*============ EXPORT MODULE ============*/
module.exports = { authLogs };
