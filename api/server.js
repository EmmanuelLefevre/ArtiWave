/*===================================*/
/*============ server.js ============*/
/*===================================*/


/*============ IMPORT USED MODULES ============*/
const http = require('http');
const app = require('../app');

const open = require('better-opn');


/*============ LAUNCH SERVER ============*/
const normalizePort = val => {
    const parsedPort  = parseInt(val, 10);

    if (isNaN(parsedPort )) {
        return val;
    }

    if (parsedPort  >= 0) {
        return parsedPort ;
    }
    return false;
};

const port = normalizePort(process.env.SERVER_PORT || '3000');
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
        throw error;
    }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port, () => {
	console.log('The server is running. Have fun!');
	open(`http://localhost:${port}/api`);
});
