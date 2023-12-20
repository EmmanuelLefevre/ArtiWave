/*================================*/
/*============ app.js ============*/
/*================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sassMiddleware = require('node-sass-middleware');

const { requestsLimiter } = require('./middleware/rateLimiter');
const adminCheck = require('./middleware/adminCheck');
const connectDB = require('./db.config');

const ErrorHandler = require('./_errors/errorHandler');

const swaggerSpec = require('./swagger');
const swaggerUi = require('swagger-ui-express');

const path = require('path');

const favicon = require('serve-favicon');


/*============ APP INITIALIZATION ============*/
const app = express();

/*=== HELMET ===*/
app.use(helmet({
	crossOriginResourcePolicy: { policy: "cross-origin"},
	xContentTypeOptions: true
}));
app.use((_req, res, next) => {
	res.setHeader('X-XSS-Protection', '1; mode=block');
	next();
});

/*=== CORS ===*/
app.use((req, res, next) => {
	if (req.method === 'OPTIONS' || req.method === 'HEAD') {
		return ErrorHandler.sendCurrentMethodNotAllowedError(res);
	}
	else {
		cors({
			origin: "http://localhost:9000",
			methods: ['GET', 'POST', 'PATCH', 'DELETE'],
			allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
		})(req, res, next);
	}
});

/*=== SWAGGER ===*/
app.use('/swagger-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*=== OTHERS ===*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*============ REQUESTS RATE-LIMITER ============*/
app.use(requestsLimiter);


/*============ IMPORT ROUTER MODULES ============*/
const auth_router = require('./routers/authRouter');
const users_router = require('./routers/usersRouter');
const articles_router = require('./routers/articlesRouter');
const admins_router = require('./routers/adminsRouter');


/*============ DATABASE SINGLETON CONNEXION ============*/
connectDB();


/*============ FAVICON ============*/
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));


/*============ SCSS ============*/
app.use(sassMiddleware({
	src: path.join(__dirname, 'scss'),
	dest: path.join(__dirname, 'public/css'),
	indentedSyntax: false,
	sourceMap: true,
    outputStyle: 'compressed'
}));

app.use(express.static(path.join(__dirname, 'public')));


/*============ MAIN ROUTER PARAMETERS ============*/

/*=== HOME ===*/
app.get('/', (_req, res) => res.send(`Application is online!`))

/*=== AUTH ===*/
app.use('/login', auth_router);

/*=== USERS ===*/
app.use('/users', users_router);

/*=== ARTICLES ===*/
app.use('/articles', articles_router);

/*=== ADMINS ===*/
app.use('/admins', adminCheck, admins_router);

/*=== 404 ===*/
app.get('*', (_req, res) => res.status(404).send('What the hell are you doing!!?'));


/*============ EXPORT MODULE ============*/
module.exports = app;
