/*============ IMPORT USED MODULES ============*/
const swaggerJSDoc = require('swagger-jsdoc');


/*============ SWAGGER MODULE ============*/
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'API',
        version: '1.0.0',
        description: 'Application Blog',
        },
    },
    apis: ['./routers/authRouter.js',
            './routers/usersRouter.js',
            './routers/articlesRouter.js']
};

const swaggerSpec = swaggerJSDoc(options);


/*============ EXPORT MODULE ============*/
module.exports = swaggerSpec;
