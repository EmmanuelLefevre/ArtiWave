/*============================================*/
/*============ mainRouter.test.js ============*/
/*============================================*/


/*============ IMPORT USED MODULES ============*/
const request = require('supertest');
const app = require('../app');
const { closeDB } = require('../api/db.config');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Models
const User = require('../api/models/IUser');


/*============ MOCK EXPRESS RATE LIMIT ============*/
jest.mock('express-rate-limit', () => {
    return jest.fn().mockImplementation(() => {
        return (_req, _res, next) => {
            next();
        };
    });
});


/*============ MAIN ROUTER TESTS ============*/
describe('MAIN ROUTER', () => {
    afterAll(async () => {
        await closeDB();
    })

    /*----------- ENTRY ----------*/

    /*=== /API ===*/
    describe('API Endpoint', () => {
        const methodsToTest = ['POST', 'PUT', 'PATCH', 'DELETE'];
        const pathsFor404 = ['/gdgdfgd', '/api/gdgdfgd'];
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        it('Should return 200 for GET /api', async () => {
            const response = await request(app).get('/api');
            expect(response.status).toBe(200);
        });

        methodsToTest.forEach(method => {
            it(`Should return 404 for ${method} /api`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api');
                expect(response.status).toBe(404);
            });
        });

        pathsFor404.forEach(path => {
            methodsToTest.forEach(method => {
                it(`Should return 404 for ${method} ${path}`, async () => {
                    const response = await request(app)[method.toLowerCase()](path);
                    expect(response.status).toBe(404);
                });
            });

            methodsToTestFor405.forEach(method => {
                it(`Should return 405 for ${method} ${path}`, async () => {
                    const response = await request(app)[method.toLowerCase()](path);
                    expect(response.status).toBe(405);
                });
            });
        });

        methodsToTestFor405.forEach(method => {
            it(`Should return 405 for ${method} /api`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api');
                expect(response.status).toBe(405);
            });
        });

        pathsFor404.forEach(path => {
            methodsToTestFor405.forEach(method => {
                it(`Should return 405 for ${method} ${path}`, async () => {
                    const response = await request(app)[method.toLowerCase()](path);
                    expect(response.status).toBe(405);
                });
            });
        });
    });


    /*----------- AUTH ----------*/

    /*=== /API/LOGIN ===*/
    describe('LOGIN Endpoint', () => {
        const methodsToTest = ['PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/login/gdgdfgd';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api/login');
                expect(response.status).toBe(405);
            });
        });

        methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
            it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                const response = await request(app)[method.toLowerCase()](pathFor404);
                expect(response.status).toBe(404);
            });
        });

        methodsToTestFor405.forEach(method => {
            it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                const response = await request(app)[method.toLowerCase()](pathFor404);
                expect(response.status).toBe(405);
            });
        });
    });


    /*----------- USERS ----------*/

    /*=== /API/USERS ===*/
    describe('USERS Endpoint', () => {
        const methodsToTest = ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api/users');
                expect(response.status).toBe(405);
            });
        });
    });

    /*=== /API/USERS/:PARAMS ===*/
    describe('USERS PARAM Endpoint', () => {
        const methodsToTest = ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/users/:param/hggddgf';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api/users/:param');
                expect(response.status).toBe(405);
            });
        });

        methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
            it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                const response = await request(app)[method.toLowerCase()](pathFor404);
                expect(response.status).toBe(404);
            });
        });

        methodsToTestFor405.forEach(method => {
            it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                const response = await request(app)[method.toLowerCase()](pathFor404);
                expect(response.status).toBe(405);
            });
        });
    });

    /*=== /API/USERS/REGISTER ===*/
    describe('USERS REGISTER Endpoint', () => {
        const methodsToTest = ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/users/register/gdgdfgd';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api/users/register');
                expect(response.status).toBe(405);
            });

            methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
                it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(404);
                });
            });

            methodsToTestFor405.forEach(method => {
                it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(405);
                });
            });
        });
    });

    /*=== /API/USERS/UPDATE/:PARAM ===*/
    describe('USERS UPDATE PARAM Endpoint', () => {
        const methodsToTest = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/users/update/:param/gdgdfgd';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api/users/update/:param');
                expect(response.status).toBe(405);
            });

            methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
                it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(404);
                });
            });

            methodsToTestFor405.forEach(method => {
                it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(405);
                });
            });
        });
    });

    /*=== /API/USERS/DELETE/:PARAM ===*/
    describe('USERS DELETE PARAM Endpoint', () => {
        const methodsToTest = ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/users/delete/:param/gdgdfgd';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api/users/delete/:param');
                expect(response.status).toBe(405);
            });

            methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
                it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(404);
                });
            });

            methodsToTestFor405.forEach(method => {
                it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(405);
                });
            });
        });
    });


    /*----------- ARTICLES ----------*/

    /*=== /API/ARTICLES ===*/
    describe('ARTICLES Endpoint', () => {
        const methodsToTest = ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api/articles');
                expect(response.status).toBe(405);
            });
        });
    });

    /*=== /API/ARTICLES/:PARAMS ===*/
    describe('ARTICLES PARAM Endpoint', () => {
        const methodsToTest = ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/articles/:param/hggddgf';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api/articles/:param');
                expect(response.status).toBe(405);
            });
        });

        methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
            it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                const response = await request(app)[method.toLowerCase()](pathFor404);
                expect(response.status).toBe(404);
            });
        });

        methodsToTestFor405.forEach(method => {
            it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                const response = await request(app)[method.toLowerCase()](pathFor404);
                expect(response.status).toBe(405);
            });
        });
    });

    /*=== /API/ARTICLES/USER/:PARAM ===*/
    describe('ARTICLES USER PARAM Endpoint', () => {
        const methodsToTest = ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/articles/user/:param/gdgdfgd';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api/articles/user/:param');
                expect(response.status).toBe(405);
            });

            methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
                it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(404);
                });
            });

            methodsToTestFor405.forEach(method => {
                it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(405);
                });
            });
        });
    });

    /*=== /API/ARTICLES/CREATE ===*/
    describe('ARTICLES CREATE Endpoint', () => {
        const methodsToTest = ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/articles/create/gdgdfgd';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api/articles/create');
                expect(response.status).toBe(405);
            });

            methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
                it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(404);
                });
            });

            methodsToTestFor405.forEach(method => {
                it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(405);
                });
            });
        });
    });

    /*=== /API/ARTICLES/UPDATE/:PARAM ===*/
    describe('ARTICLES UPDATE PARAM Endpoint', () => {
        const methodsToTest = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/articles/update/:param/gdgdfgd';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api/articles/update/:param');
                expect(response.status).toBe(405);
            });

            methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
                it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(404);
                });
            });

            methodsToTestFor405.forEach(method => {
                it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(405);
                });
            });
        });
    });

    /*=== /API/ARTICLES/DELETE/:PARAM ===*/
    describe('ARTICLES DELETE PARAM Endpoint', () => {
        const methodsToTest = ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/articles/delete/:param/gdgdfgd';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)[method.toLowerCase()]('/api/articles/delete/:param');
                expect(response.status).toBe(405);
            });

            methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
                it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(404);
                });
            });

            methodsToTestFor405.forEach(method => {
                it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)[method.toLowerCase()](pathFor404);
                    expect(response.status).toBe(405);
                });
            });
        });
    });

    /*----------- ADMIN ----------*/

    /*=== /API/ADMINS/DELETE_ALL_USERS ===*/
    describe('ADMINS DELETE ALL USERS Endpoint', () => {
        const methodsToTest = ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/admins/delete_all_users/gdgdfgd';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        let adminToken;

        beforeAll(async () => {
            adminToken = await generateAdminToken();
        });

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)
                    [method.toLowerCase()]('/api/admins/delete_all_users')
                    .set('Authorization', `Bearer ${adminToken}`);
                expect(response.status).toBe(405);
            });

            methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
                it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)
                        [method.toLowerCase()](pathFor404)
                        .set('Authorization', `Bearer ${adminToken}`);
                    expect(response.status).toBe(404);
                });
            });

            methodsToTestFor405.forEach(method => {
                it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)
                        [method.toLowerCase()](pathFor404)
                        .set('Authorization', `Bearer ${adminToken}`);
                    expect(response.status).toBe(405);
                });
            });
        });
    });

    /*=== /API/ADMINS/DELETE_ALL_ARTICLES ===*/
    describe('ADMINS DELETE ALL ARTICLES Endpoint', () => {
        const methodsToTest = ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'HEAD'];

        let adminToken;

        beforeAll(async () => {
            adminToken = await generateAdminToken();
        });

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)
                    [method.toLowerCase()]('/api/admins/delete_all_articles')
                    .set('Authorization', `Bearer ${adminToken}`);
                expect(response.status).toBe(405);
            });
        });
    });

    /*=== /API/ADMINS/DELETE_ALL_ARTICLES/:PARAM ===*/
    describe('ADMINS DELETE ALL ARTICLES PARAM Endpoint', () => {
        const methodsToTest = ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/admins/delete_all_articles/:param/gdgdfgd';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        let adminToken;

        beforeAll(async () => {
            adminToken = await generateAdminToken();
        });

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)
                    [method.toLowerCase()]('/api/admins/delete_all_articles/:param')
                    .set('Authorization', `Bearer ${adminToken}`);
                expect(response.status).toBe(405);
            });

            methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
                it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)
                        [method.toLowerCase()](pathFor404)
                        .set('Authorization', `Bearer ${adminToken}`);
                    expect(response.status).toBe(404);
                });
            });

            methodsToTestFor405.forEach(method => {
                it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)
                        [method.toLowerCase()](pathFor404)
                        .set('Authorization', `Bearer ${adminToken}`);
                    expect(response.status).toBe(405);
                });
            });
        });
    });

    /*=== /API/ADMINS/INVERT_USER_ROLE/:PARAM ===*/
    describe('ADMINS INVERT USER ROLE PARAM Endpoint', () => {
        const methodsToTest = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'];
        const pathFor404 = '/api/admins/invert_user_role/:param/gdgdfgd';
        const methodsToTestFor405 = ['OPTIONS', 'HEAD'];

        let adminToken;

        beforeAll(async () => {
            adminToken = await generateAdminToken();
        });

        methodsToTest.forEach(method => {
            it(`Should return 405 for ${method}`, async () => {
                const response = await request(app)
                    [method.toLowerCase()]('/api/admins/invert_user_role/:param')
                    .set('Authorization', `Bearer ${adminToken}`);
                expect(response.status).toBe(405);
            });

            methodsToTest.filter(method => method !== 'OPTIONS' && method !== 'HEAD').forEach(method => {
                it(`Should return 404 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)
                        [method.toLowerCase()](pathFor404)
                        .set('Authorization', `Bearer ${adminToken}`);
                    expect(response.status).toBe(404);
                });
            });

            methodsToTestFor405.forEach(method => {
                it(`Should return 405 for ${method} ${pathFor404}`, async () => {
                    const response = await request(app)
                        [method.toLowerCase()](pathFor404)
                        .set('Authorization', `Bearer ${adminToken}`);
                    expect(response.status).toBe(405);
                });
            });
        });
    });
})



/*============ FUNCTIONS ============*/

/*=== GENERATE ADMIN TOKEN ===*/
async function generateAdminToken() {
    const adminId = await getAdminId();

    // JWT generation
    const privateKeyPath = process.env.PRIVATE_KEY_PATH;
    const privateKey = fs.readFileSync(privateKeyPath);
    const adminToken = jwt.sign({
        id: adminId,
        roles: 'admin'
    }, privateKey, { algorithm: 'RS256' });

    return adminToken;
}

/*=== GET ADMIN ID ===*/
async function getAdminId() {
    const adminUser = await User.findOne({ roles: 'admin' });
    return adminUser._id;
}
