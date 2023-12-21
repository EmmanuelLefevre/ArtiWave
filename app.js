/*================================*/
/*============ app.js ============*/
/*================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sassMiddleware = require('node-sass-middleware');

const connectDB = require('./db.config');

const { RequestsLimiter } = require('./middleware/rateLimiter');
const AdminCheck = require('./middleware/adminCheck');
const GlobalErrorHandler = require('./middleware/globalErrorHandler');
const NotAllowedMethodError = require('./_errors/notAllowedMethodError');
const NotFoundError = require('./_errors/notFoundError');

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
		throw new NotAllowedMethodError();
	}
	else {
		cors({
			origin: "http://localhost:9000",
			methods: ['GET', 'POST', 'PATCH', 'DELETE'],
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
const AuthRouter = require('./routers/authRouter');
const UsersRouter = require('./routers/usersRouter');
const ArticlesRouter = require('./routers/articlesRouter');
const AdminRouter = require('./routers/adminRouter');


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
app.get('/api', (_req, res) => res.send(`Application is online!`))

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
