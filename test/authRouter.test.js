/*============================================*/
/*============ authRouter.test.js ============*/
/*============================================*/


/*============ IMPORT USED MODULES ============*/
const request = require('supertest');
const app = require('../app');
const connectDB = require('../db.config');

const AuthController = require('../controllers/authController');


/*============ AUTH ROUTER TESTS ============*/
describe('AUTH ROUTER', () => {
    beforeEach(() => {
        AuthController.resetRateLimit();
    });

    afterAll(async () => {
        await connectDB.closeDB();
    })

    /*=== /api/login POST ===*/
    describe('TRY POST', () => {

        /*==== Good credentials ====*/
        const goodCredentials = {
            email: "emmanuel@protonmail.com",
            password: "Xxggxx!1"
        };

        it('Should return 200', async () => {
            const response = await request(app)
            .post('/api/login')
            .send(goodCredentials);
            expect(response.status).toBe(200);
        });

        /*==== Bad credentials case 1 ====*/
        const postBadCredentialsCase1 = {
            email: "emmanuel2@protonmail.com",
            password: "Xxggxx!1"
        };

        it('Should return 401', async () => {
            const response = await request(app)
            .post('/api/login')
            .send(postBadCredentialsCase1);
            expect(response.status).toBe(401);
        });

        /*==== Bad credentials case 2 ====*/
        const postBadCredentialsCase2 = {
            email: "emmanuel@protonmail.com",
            password: "Xxggxx!12"
        };

        it('Should return 401', async () => {
            const response = await request(app)
            .post('/api/login')
            .send(postBadCredentialsCase2);
            expect(response.status).toBe(401);
        });

        /*==== Invalid request case 1 ====*/
        const invalidRequestCase1 = {
            email: "emmanuel2@protonmail.com"
        };

        it('Should return 400', async () => {
            const response = await request(app)
            .post('/api/login')
            .send(invalidRequestCase1);
            expect(response.status).toBe(400);
        });

        /*==== Invalid request case 2 ====*/
        const invalidRequestCase2 = {
            password: "Xxggxx!12"
        };

        it('Should return 400', async () => {
            const response = await request(app)
            .post('/api/login')
            .send(invalidRequestCase2);
            expect(response.status).toBe(400);
        });

        /*==== Validation error ====*/
        const validationError = {
            email: "emmanuelprotonmail.com",
            password: "Xxggxx!1"
        };

        it('Should return 422', async () => {
            const response = await request(app)
            .post('/api/login')
            .send(validationError);
            expect(response.status).toBe(422);
        });

        /*==== No route found ====*/
        it('Should return 404', async () => {
            const response = await request(app).post('/api/login/dgetfqtf');
            expect(response.status).toBe(404);
        });
    })
})
