/*============================================*/
/*============ authRouter.test.js ============*/
/*============================================*/


/*============ IMPORT USED MODULES ============*/
const request = require('supertest');
const app = require('../app');
const connectDB = require('../db.config');


/*============ AUTH ROUTER TESTS ============*/
describe('AUTH ROUTER', () => {
    afterAll(async () => {
        await connectDB.closeDB();
    })

    /*=== /api/login ===*/
    describe('TRY POST', () => {

        const goodCredentials = {
            email: "emmanuel@protonmail.com",
            password: "Xxggxx!1"
        };

        const postBadCredentials = {
            email: "emmanuel2@protonmail.com",
            password: "Xxggxx!1"
        };

        it('Should return 200', async () => {
            const response = await request(app)
            .post('/api/login')
            .send(goodCredentials);
            expect(response.status).toBe(200);
        });

        it('Should return 401', async () => {
            const response = await request(app)
            .post('/api/login')
            .send(postBadCredentials);
            expect(response.status).toBe(401);
        });

        it('Should return 404', async () => {
            const response = await request(app).post('/api/login/dgetfqtf');
            expect(response.status).toBe(404);
        });
    })

    describe('TRY OPTIONS', () => {

        it('Should return 405', async () => {
            const response = await request(app).options('/api/login');
            expect(response.status).toBe(405);
        });
    })

    describe('TRY HEAD', () => {

        it('Should return 405', async () => {
            const response = await request(app).head('/api/login');
            expect(response.status).toBe(405);
        });
    })

})