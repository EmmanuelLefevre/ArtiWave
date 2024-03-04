/*================================*/
/*============ app.js ============*/
/*================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { connectDB } = require('./api/db.config');

const { RequestsLimiter } = require('./api/middleware/rateLimiter');
const AdminCheck = require('./api/middleware/adminCheck');
const GlobalErrorHandler = require('./api/middleware/globalErrorHandler');
const NotAllowedMethodError = require('./api/_errors/notAllowedMethodError');
const NotFoundError = require('./api/_errors/notFoundError');

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
app.disable('x-powered-by');
app.use((_req, res, next) => {
	res.setHeader('X-XSS-Protection', '1; mode=block');
	next();
});

/*=== CORS ===*/
app.use((req, res, next) => {
	if (req.method === 'OPTIONS' || req.method === 'HEAD') {
		throw new NotAllowedMethodError();
	}
	else {
		cors({
			origin: "http://localhost:9001",
			methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
			allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
		})
		(req, res, next);
	}
});

/*=== SWAGGER ===*/
app.use('/api/swagger-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*=== OTHERS ===*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*============ REQUESTS RATE-LIMITER ============*/
app.use(RequestsLimiter);


/*============ IMPORT ROUTER MODULES ============*/
const AuthRouter = require('./api/routers/authRouter');
const UsersRouter = require('./api/routers/usersRouter');
const ArticlesRouter = require('./api/routers/articlesRouter');
const AdminRouter = require('./api/routers/adminRouter');


/*============ DATABASE SINGLETON CONNEXION ============*/
connectDB();


/*============ FAVICON ============*/
app.use(favicon(path.join(__dirname, 'api/assets', 'favicon.ico')));


/*============ SCSS ============*/
app.use(express.static(path.join(__dirname, 'public')));


/*============ MAIN ROUTER PARAMETERS ============*/

/*=== HOME ===*/
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public/views/index.html')));

/*=== AUTH ===*/
app.use('/api/login', AuthRouter);

/*=== USERS ===*/
app.use('/api/users', UsersRouter);

/*=== ARTICLES ===*/
app.use('/api/articles', ArticlesRouter);

/*=== ADMINS ===*/
app.use('/api/admins', AdminCheck, AdminRouter);

/*=== 404 ===*/
app.get('*', (_req, _res) => {
	throw new NotFoundError();
});


/*============ GLOBAL ERROR HANDLER MIDDLEWARE ============*/
app.use(GlobalErrorHandler);


/*============ EXPORT MODULE ============*/
module.exports = app;
