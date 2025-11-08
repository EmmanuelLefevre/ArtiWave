/*================================*/
/*============ app.js ============*/
/*================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const favicon = require('serve-favicon');


/*============ ROUTERS ============*/
const AdminRouter = require('./api/routers/adminRouter');
const AuthRouter = require('./api/routers/authRouter');
const LayoutRouter = require('./api/routers/layoutRouter');
const UsersRouter = require('./api/routers/usersRouter');


/*============ MIDDLEWARES ============*/
const { RequestsLimiter } = require('./api/middleware/rateLimiter');
const AdminCheck = require('./api/middleware/adminCheck');
const GlobalErrorHandler = require('./api/middleware/globalErrorHandler');

// Errors
const NotAllowedMethodError = require('./api/_errors/notAllowedMethodError');
const NotFoundError = require('./api/_errors/notFoundError');


/*============ DATABASE SINGLETON CONNEXION ============*/
const { connectDB } = require('./api/db.config');
connectDB();


/*============ APP INITIALIZATION ============*/
const app = express();


/*============ SWAGGER ============*/
const swaggerSpec = require('./swagger');
const swaggerUi = require('swagger-ui-express');
app.use('/api/swagger-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/*============ SECURITY ============*/
/*---------- HELMET ----------*/
app.use(helmet({
	crossOriginResourcePolicy: { policy: "cross-origin"},
	xContentTypeOptions: true
}));
/*---------- DISABLE 'X-POWERED-BY' HEADER ----------*/
app.disable('x-powered-by');
/*---------- ADDITIONAL SECURITY HEADERS ----------*/
app.use((_req, res, next) => {
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader("Content-Security-Policy",
		"default-src 'self'; \
		script-src 'self' https://unpkg.com; \
		style-src 'self' 'unsafe-inline'; \
		img-src 'self' data:; \
		connect-src 'self' *;"
	);
	next();
});
/*---------- CORS ----------*/
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9001');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, x-access-token, role, Content, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    }
    if (req.method === 'HEAD') {
        throw new NotAllowedMethodError();
    }
    next();
});


/*============ PARSERS & STATIC ============*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/assets/img/favicon', 'ArtiWave-favicon-32px.ico')));


/*============ RATE-LIMITER ============*/
app.use(RequestsLimiter);


/*============ VIEW ENGINE ============*/
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/public/views'));
app.locals.compileDebug = true;


/*============ ROUTER PARAMETERS ============*/
app.get('/home', (_req, res) => res.redirect('/'));
/*******---------- Layout ----------*******/
app.use("/", LayoutRouter);

/*******---------- API ----------*******/
/*---------- Auth ----------*/
app.use('/api/login', AuthRouter);
/*---------- Users ----------*/
app.use('/api/users', UsersRouter);
/*---------- Admins ----------*/
app.use('/api/admins', AdminCheck, AdminRouter);

/*******---------- COMPONENTS ----------*******/
/*---------- Login form component ----------*/
app.get('/login-component', (_req, res) => res.render('components/login/login-component.pug'));

/*******---------- ERRORS ----------*******/
/*---------- 404 ----------*/
app.all('*', (_req, _res) => {
	throw new NotFoundError();
});

/*******---------- GLOBAL ERROR HANDLER MIDDLEWARE ----------*******/
app.use(GlobalErrorHandler);


/*============ EXPORT MODULE ============*/
module.exports = app;
