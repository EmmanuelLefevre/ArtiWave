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
            './routers/adminsRouter.js']
};

const swaggerSpec = swaggerJSDoc(options);

/*============ AUTH ============*/
swaggerSpec.paths['/login'] = {
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
                            },
                            password: {
                                type: 'string',
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
                                },
                                message: {
                                    type: 'string',
                                },
                                nickname: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Incorrect query due to missing param.',
            },
            '401': {
                description: 'Incorrect email or password.',
            },
            '429': {
                description: 'Too many connection attempts, please try again later.',
            },
            '500': {
                description: 'Server error while connecting account.',
            },
        },
    },
};


/*============ USERS ============*/

/*=== REGISTER ===*/
swaggerSpec.paths['/users/register'] = {
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
                            },
                            password: {
                                type: 'string',
                            },
                            nickname: {
                                type: 'string',
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
                                },
                                nickname: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Incorrect query due to missing param.',
            },
            '409': {
                description: 'Email or nickname already exists.',
            },
            '422': {
                description: 'Incorrect query due to invalid URI or data.',
            },
            '429': {
                description: 'Too many registration attempts, please try again later.',
            },
            '500': {
                description: 'Server error while creating account.',
            },
        },
    },
};

/*=== GET ALL USERS ===*/
swaggerSpec.paths['/users'] = {
    get: {
        summary: 'Get all users',
        description: 'Retrieve a list of all users.',
        tags: ['Users'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                name: 'Bearer Token',
                in: 'header',
                required: true,
                description: '',
                schema: {
                    type: 'string',
                },
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
                                            },
                                            email: {
                                                type: 'string',
                                            },
                                            nickname: {
                                                type: 'string',
                                            },
                                            registeredAt: {
                                                type: 'string',
                                            },
                                            updatedAt: {
                                                type: 'string',
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
            '403': {
                description: 'Premium functionality.',
            },
            '500': {
                description: 'Server error while retrieving all users.',
            },
        },
    },
};

/*=== GET USER ===*/
swaggerSpec.paths['/users/{id}'] = {
    get: {
        summary: 'Get user by Id',
        description: 'Retrieve a user by their Id.',
        tags: ['Users'],
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
                                        },
                                        email: {
                                            type: 'string',
                                        },
                                        nickname: {
                                            type: 'string',
                                        },
                                        registeredAt: {
                                            type: 'string',
                                        },
                                        updatedAt: {
                                            type: 'string',
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
                description: 'This feature is reserved for users who own an account.',
            },
            '404': {
                description: 'User not found.',
            },
            '422': {
                description: 'Incorrect query due to invalid URI or data.',
            },
            '500': {
                description: 'Server error while retrieving a single user.',
            },
        },
    },
};

/*=== UPDATE USER ===*/
swaggerSpec.paths['/users/{id}'].patch = {
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
            name: 'Bearer Token',
            in: 'header',
            required: true,
            description: '',
            schema: {
                type: 'string',
            },
        },
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
                        },
                        nickname: {
                            type: 'string',
                        },
                        password: {
                            type: 'string',
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
                            message: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        },
        '400': {
            description: 'Incorrect query due to missing param.',
        },
        '400': {
            description: 'Unknown user role.',
        },
        '403': {
            description: 'You are not allowed to update a user other than yourself.',
        },
        '404': {
            description: 'User not found.',
        },
        '409': {
            description: 'Nickname already exists.',
        },
        '422': {
            description: 'Incorrect query due to invalid URI or data.',
        },
        '500': {
            description: 'Server error while updating a single user.',
        },
    },
};


/*=== DELETE USER ===*/
swaggerSpec.paths['/users/{id}'].delete = {
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
            name: 'Bearer Token',
            in: 'header',
            required: true,
            description: '',
            schema: {
                type: 'string',
            },
        },
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
        '403': {
            description: 'You are not allowed to delete a user other than yourself.',
        },
        '404': {
            description: 'User not found.',
        },
        '422': {
            description: 'Incorrect query due to invalid URI or data.',
        },
        '500': {
            description: 'Server error while deleting a single user.',
        },
    },
};


/*============ ARTICLES ============*/

/*=== CREATE ARTICLE ===*/
swaggerSpec.paths['/articles'] = {
    post: {
        summary: 'Create an article',
        description: 'Create an article with a title, content, and author.',
        tags: ['Articles'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                name: 'Bearer Token',
                in: 'header',
                required: true,
                description: '',
                schema: {
                    type: 'string',
                },
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
                            },
                            content: {
                                type: 'string',
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
                                message: {
                                    type: 'string',
                                },
                                author: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
            '400': {
                description: 'Incorrect query due to missing param.',
            },
            '403': {
                description: 'Premium functionality.',
            },
            '409': {
                description: 'Article already exists.',
            },
            '422': {
                description: 'Incorrect query due to invalid URI or data.',
            },
            '429': {
                description: 'Too many creation attempts, please try again later.',
            },
            '500': {
                description: 'Server error while creating articles',
            },
        },
    },
};

/*=== GET ALL ARTICLES ===*/
swaggerSpec.paths['/articles'].get = {
    summary: 'Get all articles',
    description: 'Retrieve a list of all articles.',
    tags: ['Articles'],
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
                                        },
                                        title: {
                                            type: 'string',
                                        },
                                        content: {
                                            type: 'string',
                                        },
                                        author: {
                                            type: 'object',
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                },
                                                nickname: {
                                                    type: 'string',
                                                },
                                            },
                                        },
                                        createdAt: {
                                            type: 'string',
                                        },
                                        updatedAt: {
                                            type: 'string',
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
        '500': {
            description: 'Server error while retrieving all articles.',
        },
    },
};

/*=== GET ARTICLE ===*/
swaggerSpec.paths['/articles/{id}'] = {
    get: {
        summary: 'Get article by Id',
        description: 'Retrieve an article by its Id.',
        tags: ['Articles'],
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
                                _id: 'string',
                                title: 'string',
                                content: 'string',
                                author: {
                                    _id: 'string',
                                    nickname: 'string',
                                },
                                createdAt: 'string',
                                updatedAt: 'string',
                            },
                        },
                    },
                },
            },
            '404': {
                description: 'Article not found.',
            },
            '422': {
                description: 'Incorrect query due to invalid URI or data.',
            },
            '500': {
                description: 'Internal Server Error.',
            },
        },
    },
};

/*=== GET ARTICLES BY USER ===*/
swaggerSpec.paths['/articles/user/{userId}'] = {
    get: {
        summary: 'Get articles by user',
        description: 'Retrieve articles for a specific user.',
        tags: ['Articles'],
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
                                            },
                                            title: {
                                                type: 'string',
                                            },
                                            content: {
                                                type: 'string',
                                            },
                                            author: {
                                                type: 'object',
                                                properties: {
                                                    _id: {
                                                        type: 'string',
                                                    },
                                                    nickname: {
                                                        type: 'string',
                                                    },
                                                },
                                            },
                                            createdAt: {
                                                type: 'string',
                                            },
                                            updatedAt: {
                                                type: 'string',
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
                description: 'Bad Request.',
            },
            '401': {
                description: 'This feature is reserved for users who own an account.',
            },
            '422': {
                description: 'Incorrect query due to invalid URI or data.',
            },
            '500': {
                description: 'Server error while retrieving articles for a specific user.',
            },
        },
    },
};

/*=== UPDATE ARTICLE ===*/
swaggerSpec.paths['/articles/{id}'].patch = {
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
            name: 'Bearer Token',
            in: 'header',
            required: true,
            description: '',
            schema: {
                type: 'string',
            },
        },
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
                        email: {
                            type: 'string',
                        },
                        nickname: {
                            type: 'string',
                        },
                        password: {
                            type: 'string',
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
                            message: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        },
        '400': {
            description: 'Incorrect query due to forbidden or missing param.',
        },
        '403': {
            description: 'Only certified members are allowed to update an article.',
        },
        '403': {
            description: 'You are not allowed to update an article that does not belong to you.',
        },
        '404': {
            description: 'User not found.',
        },
        '409': {
            description: 'Article with same title already posted',
        },
        '422': {
            description: 'Incorrect query due to invalid URI or data.',
        },
        '500': {
            description: 'Server error while updating a single user.',
        },
    },
};

/*=== DELETE ARTICLE ===*/
swaggerSpec.paths['/articles/{id}'].delete = {
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
            name: 'Bearer Token',
            in: 'header',
            required: true,
            description: '',
            schema: {
                type: 'string',
            },
        },
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
        '403': {
            description: 'Only certified members are allowed to delete an article.',
        },
        '403': {
            description: 'You are not allowed to delete an article that does not belong to you.',
        },
        '404': {
            description: 'Article not found.',
        },
        '422': {
            description: 'Incorrect query due to invalid URI or data.',
        },
        '500': {
            description: 'Server error while deleting a single article.',
        },
    },
};


/*============ AUTH ============*/

/*=== UPGRADE USER ROLE ===*/
swaggerSpec.paths['admins/upgrade_user_role/:id'] = {
    patch: {
        summary: 'Upgrade user to certified.',
        description: 'Upgrade the user\'s role to certified.',
        tags: ['Admins'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                name: 'Bearer Token',
                in: 'header',
                required: true,
                description: '',
                schema: {
                    type: 'string',
                },
            },
            {
                in: 'path',
                name: 'id',
                required: true,
                description: 'ID of the user to upgrade.',
                schema: {
                    type: 'string',
                },
            },
        ],
        responses: {
            '200': {
                description: 'User upgraded successfully.',
            },
            '403': {
                description: 'Permission denied.',
            },
            '404': {
                description: 'User not found.',
            },
            '422': {
                description: 'Incorrect query due to invalid URI or data.',
            },
            '500': {
                description: 'Server error while deleting a single user.',
            },
        }
    }
};

/*=== DELETE ALL USERS ===*/
swaggerSpec.paths['/admins/delete_all_users'] = {
    delete: {
        summary: 'Delete all users except admin and all articles except those owned by admin',
        description: 'Delete all users except the admin and all articles except those owned by admin.',
        tags: ['Admins'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                name: 'Bearer Token',
                in: 'header',
                required: true,
                description: '',
                schema: {
                    type: 'string',
                },
            },
        ],
        responses: {
            '204': {
                description: 'All users and articles have been deleted successfully.',
            },
            '403': {
                description: 'Permission denied.',
            },
            '500': {
                description: 'Server error while deleting all users and articles.',
            },
        },
    },
};

/*=== DELETE ALL ARTICLES ===*/
swaggerSpec.paths['/admins/delete_all_articles'] = {
    delete: {
        summary: 'Delete all articles except those owned by admin',
        description: 'Delete all articles except those owned by admin.',
        tags: ['Admins'],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [
            {
                name: 'Bearer Token',
                in: 'header',
                required: true,
                description: '',
                schema: {
                    type: 'string',
                },
            },
        ],
        responses: {
            '204': {
                description: 'All articles have been deleted successfully.',
            },
            '403': {
                description: 'Permission denied.',
            },
            '500': {
                description: 'Server error while deleting all articles.',
            },
        },
    },
};


/*============ EXPORT MODULE ============*/
module.exports = swaggerSpec;
