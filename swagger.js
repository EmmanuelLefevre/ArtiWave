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
            './routers/articlesRouter.js',
            './routers/adminRouter.js'],
};

const swaggerSpec = swaggerJSDoc(options);

/*============ AUTH ============*/
swaggerSpec.paths['/api/login'] = {
    post: {
        summary: 'Login user account',
        tags: ['Auth'],
        requestBody: {
            description: 'User details to connect',
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                example: 'emmanuel@protonmail.com'
                            },
                            password: {
                                type: 'string',
                                example: 'Xxggxx!1'
                            },
                        },
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'User connected.',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                access_token: {
                                    type: 'string',
                                    required: true
                                },
                                nickname: {
                                    type: 'string',
                                    required: true
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Invalid request.',
            },
            '401': {
                description: 'Bad credentials.',
            },
            '405': {
                description: 'Method not allowed.',
            },
            '422': {
                description: 'Invalid validation rule.',
            },
            '429': {
                description: 'The number of connection attempts is limited to 5 per hour.',
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                            ],
                        },
                    },
                },
            },
        },
    },
};


/*============ USERS ============*/

/*=== REGISTER ===*/
swaggerSpec.paths['/api/users/register'] = {
    post: {
        summary: 'Create user account',
        description: 'Registers a new user with an email, password, and nickname.',
        tags: ['Users'],
        requestBody: {
            description: 'User details to create',
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                example: 'bob@orange.fr'
                            },
                            password: {
                                type: 'string',
                                example: 'Xxggxx!1',
                            },
                            nickname: {
                                type: 'string',
                                example: 'Bob',
                            },
                        },
                    },
                },
            },
        },
        responses: {
            '201': {
                description: 'User account created successfully.',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string',
                                    required: true
                                },
                                nickname: {
                                    type: 'string',
                                    required: true
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Invalid request.',
            },
            '405': {
                description: 'Method not allowed.',
            },
            '409': {
                description: 'Email or nickname already exists.',
            },
            '422': {
                description: 'Invalid validation rule.',
            },
            '429': {
                description: 'You can only create one account per day.',
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                            ],
                        },
                    },
                },
            },
        },
    },
};

/*=== GET ALL USERS ===*/
swaggerSpec.paths['/api/users'] = {
    get: {
        summary: 'Get all users',
        description: 'Retrieve a list of all users.',
        tags: ['Users'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        responses: {
            '200': {
                description: 'List of users retrieved successfully.',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                optional: true
                                            },
                                            email: {
                                                type: 'string',
                                                required: true
                                            },
                                            nickname: {
                                                type: 'string',
                                                required: true
                                            },
                                            registeredAt: {
                                                type: 'string',
                                                required: true
                                            },
                                            updatedAt: {
                                                type: 'string',
                                                required: true
                                            },
                                        },
                                    },
                                },
                                dataCount: {
                                    type: 'integer',
                                    description: 'Total count of users.',
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Unknown user role.',
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                            ],
                        },
                    },
                },
            },
            '403': {
                description: 'Premium functionality.',
            },
            '404': {
                description: 'No user was found.',
            },
            '405': {
                description: 'Method not allowed.',
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                                { $ref: '#/components/schemas/CreationResponseObjectError' },
                            ],
                        },
                    },
                },
            },
        },
    },
};

/*=== GET SINGLE USER ===*/
swaggerSpec.paths['/api/users/{id}'] = {
    get: {
        summary: 'Get user by Id',
        description: 'Retrieve a user by their Id.',
        tags: ['Users'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                description: 'User Id',
                schema: {
                    type: 'string',
                },
            },
        ],
        responses: {
            '200': {
                description: 'Single user retrieved successfully.',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    properties: {
                                        _id: {
                                            type: 'string',
                                            optional: true
                                        },
                                        email: {
                                            type: 'string',
                                            required: true
                                        },
                                        nickname: {
                                            type: 'string',
                                            required: true
                                        },
                                        registeredAt: {
                                            type: 'string',
                                            required: true
                                        },
                                        updatedAt: {
                                            type: 'string',
                                            required: true
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Unknown user role.',
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                                { $ref: '#/components/schemas/AccountCheck' },
                            ],
                        },
                    },
                },
            },
            '404': {
                description: 'No user was found.',
            },
            '405': {
                description: 'Method not allowed.',
            },
            '422': {
                description: 'Invalid URI format.',
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                                { $ref: '#/components/schemas/CreationResponseObjectError' },
                            ],
                        },
                    },
                },
            },
        },
    },
};

/*=== UPDATE USER ===*/
swaggerSpec.paths['/api/users/update/{id}'] = {
    patch: {
        summary: 'Update user by Id',
        description: 'Update user details by their Id.',
        tags: ['Users'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                description: 'User Id',
                schema: {
                    type: 'string',
                },
            },
        ],
        requestBody: {
            description: 'User details to update',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                optionnal: true
                            },
                            nickname: {
                                type: 'string',
                                optionnal: true
                            },
                            password: {
                                type: 'string',
                                optionnal: true
                            },
                        },
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Single user updated successfully.',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                optional: true
                                            },
                                            email: {
                                                type: 'string',
                                                optional: true
                                            },
                                            nickname: {
                                                type: 'string',
                                                required: true
                                            },
                                            registeredAt: {
                                                type: 'string',
                                                required: true
                                            },
                                            updatedAt: {
                                                type: 'string',
                                                required: true
                                            },
                                        },
                                    },
                                },
                                modifiedProperties: {
                                    type: 'object',
                                    properties: {
                                        updatedAt: {
                                            type: 'string',
                                            required: true
                                        },
                                        email: {
                                            type: 'string',
                                            optional: true
                                        },
                                        nickname: {
                                            type: 'string',
                                            optional: true
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Bad requests.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/ForbiddenParams' },
                                { $ref: '#/components/schemas/InvalidRequest' },
                                { $ref: '#/components/schemas/UnknownUserRole' },
                            ],
                        },
                    },
                },
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                                { $ref: '#/components/schemas/AccountCheck' },
                            ],
                        },
                    },
                },
            },
            '403': {
                description: 'You are not allowed to update a user other than yourself.',
            },
            '404': {
                description: 'No user was found.',
            },
            '405': {
                description: 'Method not allowed.',
            },
            '409': {
                description: 'Nickname already exists.',
            },
            '422': {
                description: 'Unprocessable entities.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InvalidURI' },
                                { $ref: '#/components/schemas/InvalidValidationRule' },
                            ],
                        },
                    },
                },
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                                { $ref: '#/components/schemas/CreationResponseObjectError' },
                            ],
                        },
                    },
                },
            },
        },
    },
};


/*=== DELETE USER ===*/
swaggerSpec.paths['/api/users/{id}'] = {
    delete : {
        summary: 'Delete user by Id',
        description: 'Delete a user by their Id.',
        tags: ['Users'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                description: 'User Id',
                schema: {
                    type: 'string',
                },
            },
        ],
        responses: {
            '204': {
                description: 'Single user deleted successfully.',
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                            ],
                        },
                    },
                },
            },
            '403': {
                description: 'You are not allowed to delete a user other than yourself.',
            },
            '404': {
                description: 'No user was found.',
            },
            '405': {
                description: 'Method not allowed.',
            },
            '422': {
                description: 'Invalid URI format.',
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                            ],
                        },
                    },
                },
            },
        },
    },
};


/*============ ARTICLES ============*/

/*=== CREATE ARTICLE ===*/
swaggerSpec.paths['/api/articles/create'] = {
    post: {
        summary: 'Create an article',
        description: 'Create an article with a title, content, and author.',
        tags: ['Articles'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        requestBody: {
            description: 'Article details to create',
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            title: {
                                type: 'string',
                                optional: true,
                            },
                            content: {
                                type: 'string',
                                optional: true,
                            },
                        },
                    },
                },
            },
        },
        responses: {
            '201': {
                description: 'Article created successfully.',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                _id: {
                                    type: 'string',
                                    optional: true,
                                },
                                title: {
                                    type: 'string',
                                    required: true,
                                },
                                content: {
                                    type: 'string',
                                    required: true,
                                },
                                createdAt: {
                                    type: 'string',
                                    required: true,
                                },
                                updatedAt: {
                                    type: 'string',
                                    required: true,
                                },
                                author: {
                                    type: 'object',
                                    properties: {
                                        _id: {
                                            type: 'string',
                                            optional: true,
                                        },
                                        nickname: {
                                            type: 'string',
                                            required: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Bad requests.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InvalidRequest' },
                                { $ref: '#/components/schemas/UnknownUserRole' },
                            ],
                        },
                    },
                },
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                            ],
                        },
                    },
                },
            },
            '403': {
                description: 'Premium functionality.',
            },
            '404': {
                description: 'Not found errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoUserFound' },
                                { $ref: '#/components/schemas/NoUserInfoFound' },
                            ],
                        },
                    },
                },
            },
            '405': {
                description: 'Method not allowed.',
            },
            '409': {
                description: 'Article with same title already posted.',
            },
            '422': {
                description: 'Invalid validation rule.',
            },
            '429': {
                description: 'You can only create 5 articles per day.',
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                                { $ref: '#/components/schemas/CreationResponseObjectError' },
                            ],
                        },
                    },
                },
            },
        },
    },
};

/*=== GET ALL ARTICLES ===*/
swaggerSpec.paths['/api/articles'] = {
    get: {
        summary: 'Get all articles',
        description: 'Retrieve a list of all articles.',
        tags: ['Articles'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        responses: {
            '200': {
                description: 'List of articles retrieved successfully.',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                optional: true,
                                            },
                                            title: {
                                                type: 'string',
                                                required: true,
                                            },
                                            content: {
                                                type: 'string',
                                                required: true,
                                            },
                                            createdAt: {
                                                type: 'string',
                                                required: true,
                                            },
                                            updatedAt: {
                                                type: 'string',
                                                required: true,
                                            },
                                            author: {
                                                type: 'object',
                                                properties: {
                                                    _id: {
                                                        type: 'string',
                                                        optional: true,
                                                    },
                                                    nickname: {
                                                        type: 'string',
                                                        required: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                dataCount: {
                                    type: 'integer',
                                    description: 'Total count of articles.',
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Unknown user role.',
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                            ],
                        },
                    },
                },
            },
            '404': {
                description: 'Not found errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoUserFound' },
                                { $ref: '#/components/schemas/NoUserInfoFound' },
                            ],
                        },
                    },
                },
            },
            '405': {
                description: 'Method not allowed.',
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                                { $ref: '#/components/schemas/CreationResponseObjectError' },
                            ],
                        },
                    },
                },
            },
        },
    },
};

/*=== GET ARTICLE ===*/
swaggerSpec.paths['/api/articles/{id}'] = {
    get: {
        summary: 'Get article by Id',
        description: 'Retrieve an article by its Id.',
        tags: ['Articles'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: {
                    type: 'string',
                },
                description: 'The Id of the article.',
            },
        ],
        responses: {
            '200': {
                description: 'Article retrieved successfully.',
                content: {
                    'application/json': {
                        example: {
                            data: {
                                _id: {
                                    type: 'string',
                                    optional: true,
                                },
                                title: {
                                    type: 'string',
                                    required: true,
                                },
                                content: {
                                    type: 'string',
                                    required: true,
                                },
                                createdAt: {
                                    type: 'string',
                                    required: true,
                                },
                                updatedAt: {
                                    type: 'string',
                                    required: true,
                                },
                                author: {
                                    type: 'object',
                                    properties: {
                                        _id: {
                                            type: 'string',
                                            optional: true,
                                        },
                                        nickname: {
                                            type: 'string',
                                            required: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Unknown user role.',
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                            ],
                        },
                    },
                },
            },
            '404': {
                description: 'Not found errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoUserFound' },
                                { $ref: '#/components/schemas/NoUserInfoFound' },
                            ],
                        },
                    },
                },
            },
            '405': {
                description: 'Method not allowed.',
            },
            '422': {
                description: 'Invalid URI format.',
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                                { $ref: '#/components/schemas/CreationResponseObjectError' },
                            ],
                        },
                    },
                },
            },
        },
    },
};

/*=== GET ARTICLES BY USER ===*/
swaggerSpec.paths['/api/articles/user/{userId}'] = {
    get: {
        summary: 'Get articles by user',
        description: 'Retrieve articles for a specific user.',
        tags: ['Articles'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                in: 'path',
                name: 'userId',
                required: true,
                description: 'User Id',
                schema: {
                    type: 'string',
                },
            },
        ],
        responses: {
            '200': {
                description: 'Articles from user retrieved successfully.',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    description: 'List of articles',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                optional: true,
                                            },
                                            title: {
                                                type: 'string',
                                                required: true,
                                            },
                                            content: {
                                                type: 'string',
                                                required: true,
                                            },
                                            createdAt: {
                                                type: 'string',
                                                required: true,
                                            },
                                            updatedAt: {
                                                type: 'string',
                                                required: true,
                                            },
                                            author: {
                                                type: 'object',
                                                properties: {
                                                    _id: {
                                                        type: 'string',
                                                        optional: true,
                                                    },
                                                    nickname: {
                                                        type: 'string',
                                                        required: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                dataCount: {
                                    type: 'integer',
                                    description: 'Total count of articles.',
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Bad requests.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InvalidRequest' },
                                { $ref: '#/components/schemas/UnknownUserRole' },
                            ],
                        },
                    },
                },
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                                { $ref: '#/components/schemas/AccountCheck' },
                            ],
                        },
                    },
                },
            },
            '404': {
                description: 'Not found errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoUserFound' },
                                { $ref: '#/components/schemas/NoArticleFound' },
                                { $ref: '#/components/schemas/NoUserInfoFound' },
                            ],
                        },
                    },
                },
            },
            '405': {
                description: 'Method not allowed.',
            },
            '422': {
                description: 'Invalid URI format.',
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                                { $ref: '#/components/schemas/CreationResponseObjectError' },
                            ],
                        },
                    },
                },
            },
        },
    },
};

/*=== UPDATE ARTICLE ===*/
swaggerSpec.paths['/api/articles/update/{id}'] = {
    patch: {
        summary: 'Update article by Id',
        description: 'Update article details by their ID.',
        tags: ['Articles'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                description: 'Article Id',
                schema: {
                    type: 'string',
                },
            },
        ],
        requestBody: {
            description: 'Article details to update',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            title: {
                                type: 'string',
                                optional: true,
                            },
                            content: {
                                type: 'string',
                                optional: true,
                            }
                        },
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Single user updated successfully.',
                content: {
                    'application/json': {
                        schema: {
                            properties: {
                                data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                optional: true
                                            },
                                            title: {
                                                type: 'string',
                                                optional: true
                                            },
                                            content: {
                                                type: 'string',
                                                required: true
                                            },
                                            createdAt: {
                                                type: 'string',
                                                required: true
                                            },
                                            updatedAt: {
                                                type: 'string',
                                                required: true
                                            },
                                            author: {
                                                type: 'object',
                                                properties: {
                                                    _id: {
                                                        type: 'string',
                                                        optional: true,
                                                    },
                                                    nickname: {
                                                        type: 'string',
                                                        required: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                modifiedProperties: {
                                    type: 'object',
                                    properties: {
                                        updatedAt: {
                                            type: 'string',
                                            required: true
                                        },
                                        title: {
                                            type: 'string',
                                            optional: true
                                        },
                                        content: {
                                            type: 'string',
                                            optional: true
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Bad requests.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/ForbiddenParams' },
                                { $ref: '#/components/schemas/InvalidRequest' },
                                { $ref: '#/components/schemas/UnknownUserRole' },
                            ],
                        },
                    },
                },
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                            ],
                        },
                    },
                },
            },
            '403': {
                description: 'Forbidden errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NotAllowedToUpdateArticle' },
                                { $ref: '#/components/schemas/OnlyCertifiedMembersUpdateArticle' },
                            ],
                        },
                    },
                },
            },
            '404': {
                description: 'Not found errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoArticleFound' },
                                { $ref: '#/components/schemas/NoUserInfoFound' },
                            ],
                        },
                    },
                },
            },
            '405': {
                description: 'Method not allowed.',
            },
            '409': {
                description: 'Article with same title already posted.',
            },
            '422': {
                description: 'Unprocessable entities.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InvalidURI' },
                                { $ref: '#/components/schemas/InvalidValidationRule' },
                            ],
                        },
                    },
                },
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                                { $ref: '#/components/schemas/CreationResponseObjectError' },
                            ],
                        },
                    },
                },
            },
        },
    },
};

/*=== DELETE ARTICLE ===*/
swaggerSpec.paths['/api/articles/delete/{id}'] = {
    delete: {
        summary: 'Delete article by Id',
        description: 'Delete a article by their Id.',
        tags: ['Articles'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                description: 'Article Id',
                schema: {
                    type: 'string',
                },
            },
        ],
        responses: {
            '204': {
                description: 'Single article deleted successfully.',
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                            ],
                        },
                    },
                },
            },
            '403': {
                description: 'Forbidden errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NotAllowedToDeleteArticle' },
                                { $ref: '#/components/schemas/OnlyCertifiedMembersDeleteArticle' },
                            ],
                        },
                    },
                },
            },
            '404': {
                description: 'No article was found.',
            },
            '405': {
                description: 'Method not allowed.',
            },
            '422': {
                description: 'Invalid URI format.',
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                            ],
                        },
                    },
                },
            },
        },
    },
};


/*============ ADMIN ============*/

/*=== DELETE NON ADMIN USERS AND THEIR OWNED ARTICLES ===*/
swaggerSpec.paths['/api/admins/delete_all_users'] = {
    delete: {
        summary: 'Delete all users except admin and all articles except those owned by admin',
        description: 'Delete all users except the admin and all articles except those owned by admin.',
        tags: ['Admin'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        responses: {
            '204': {
                description: 'All users and articles have been deleted successfully.',
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                            ],
                        },
                    },
                },
            },
            '404': {
                description: 'No user was found.',
            },
            '405': {
                description: 'Method not allowed.',
            },
            '500': {
                description: 'Internal server error.',
            },
        },
    },
};

/*=== DELETE ALL ARTICLES EXCEPT THOSE OWNED BY ADMIN ===*/
swaggerSpec.paths['/api/admins/delete_all_articles'] = {
    delete: {
        summary: 'Delete all articles except those owned by admin',
        description: 'Delete all articles except those owned by admin.',
        tags: ['Admin'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        responses: {
            '204': {
                description: 'All articles have been deleted successfully.',
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                            ],
                        },
                    },
                },
            },
            '404': {
                description: 'No article was found.',
            },
            '405': {
                description: 'Method not allowed.',
            },
            '500': {
                description: 'Internal server error.',
            },
        },
    },
};

/*=== DELETE ALL ARTICLES BY USER ===*/
swaggerSpec.paths['/api/admins/delete_all_articles/{id}'] = {
    delete: {
        summary: 'Delete all articles owned by a single user',
        description: 'Delete all articles owned by a single user.',
        tags: ['Admin'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                description: 'User Id',
                schema: {
                    type: 'string',
                },
            },
        ],
        responses: {
            '204': {
                description: 'All articles own by user have been deleted successfully.',
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                            ],
                        },
                    },
                },
            },
            '404': {
                description: 'Not found errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoUserFound' },
                                { $ref: '#/components/schemas/NoArticleFound' },
                            ],
                        },
                    },
                },
            },
            '405': {
                description: 'Method not allowed.',
            },
            '422': {
                description: 'Invalid URI format.',
            },
            '500': {
                description: 'Internal server error.',
            },
        },
    },
};

/*=== INVERT USER ROLE ===*/
swaggerSpec.paths['/api/admins/invert_user_role/:id'] = {
    patch: {
        summary: 'Invert user role.',
        description: 'Invert the user\'s role "certified" to "user" or "user" to "certified".',
        tags: ['Admin'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                description: 'User Id',
                schema: {
                    type: 'string',
                },
            },
        ],
        responses: {
            '200': {
                description: 'User role inverted successfully.',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                nickname: {
                                    type: 'string',
                                    required: true
                                },
                                roles: {
                                    type: 'string',
                                    required: true
                                },
                            },
                        },
                    },
                },
            },
            '401': {
                description: 'Authorization errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/NoToken' },
                                { $ref: '#/components/schemas/FalseToken' },
                            ],
                        },
                    },
                },
            },
            '404': {
                description: 'User not found.',
            },
            '405': {
                description: 'Method not allowed.',
            },
            '422': {
                description: 'Incorrect query due to invalid URI or data.',
            },
            '500': {
                description: 'Server errors.',
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/InternalServerError' },
                                { $ref: '#/components/schemas/ValidationResponseError' },
                                { $ref: '#/components/schemas/CreationResponseObjectError' },
                                { $ref: '#/components/schemas/DeletionFailedError' },
                            ],
                        },
                    },
                },
            },
        }
    }
};


/*============  COMPONENT ERRORS ============*/
swaggerSpec.components = {
    securitySchemes: {
        bearerAuth: {
            type: "http",
            name: "Authorization",
            scheme: "bearer",
            bearerFormat: 'JWT',
            in: "header",
            description: "JWT"
        },
    },
    schemas: {
        //400
        InvalidRequest: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Invalid request.',
                },
            },
        },
        UnknownUserRole: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Unknown user role.',
                },
            },
        },
        ForbiddenParams: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'These parameters can\'t be modified.',
                },
            },
        },
        // 401
        FalseToken: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'False token.',
                },
            },
        },
        NoToken: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'No JWT found.',
                },
            },
        },
        WrongPassword: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Wrong password.',
                },
            },
        },
        AccountCheck: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'This feature is reserved for users who own an account.',
                },
            },
        },
        //403
        PremiumFunctionality: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Premium functionality.',
                },
            },
        },
        OnlyCertifiedMembersUpdateArticle: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Only certified members are allowed to update an article.',
                },
            },
        },
        NotAllowedToUpdateArticle: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'You are not allowed to update an article that does not belong to you.',
                },
            },
        },
        OnlyCertifiedMembersDeleteArticle: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Only certified members are allowed to delete an article.',
                },
            },
        },
        NotAllowedToDeleteArticle: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'You are not allowed to delete an article that does not belong to you.',
                },
            },
        },
        // 404
        NoAccountExists: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'This account does not exists.',
                },
            },
        },
        NoUserFound: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'No user was found.',
                },
            },
        },
        NoArticleFound: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'No article was found.',
                },
            },
        },
        NoUserInfoFound: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Error retrieving user\'s info.',
                },
            },
        },
        // 409
        EmailNicknameAlreadyExists: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Email or nickname already exists.',
                },
            },
        },
        // 422
        InvalidValidationRule: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Invalid validation rule',
                },
            },
        },
        InvalidURI: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Invalid URI format',
                },
            },
        },
        // 429
        RegisterLimiter: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'You can only create one account per day.',
                },
            },
        },
        LoginLimiter: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'The number of connection attempts is limited to 5 per hour.',
                },
            },
        },
        CreateArticleLimiter: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'You can only create 5 articles per day.',
                },
            },
        },
        // 500
        InternalServerError: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    examples: 'Internal Server Error.'
                },
            },
        },
        DeletionFailedError: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Deletion Failed Error.',
                },
            },
        },
        ValidationResponseError: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Validation Response Error.',
                },
            },
        },
        CreationResponseObjectError: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Creation Response Object Error.',
                },
            },
        },
    },
};


/*============ EXPORT MODULE ============*/
module.exports = swaggerSpec;
