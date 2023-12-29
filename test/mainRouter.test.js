/*============================================*/
/*============ mainRouter.test.js ============*/
/*============================================*/


/*============ IMPORT USED MODULES ============*/
const request = require('supertest');
const app = require('../app');
const connectDB = require('../db.config');


/*============ MAIN ROUTER TESTS ============*/
describe('MAIN ROUTER', () => {
    afterAll(async () => {
        await connectDB.closeDB();
    })

    /*=== /api ===*/
    describe('TRY GET', () => {

        it('Should return 200', async () => {
            const response = await request(app).get('/api');
            expect(response.status).toBe(200);
        });

        it('Should return 404', async () => {
            const response = await request(app).get('/api/dgetfqtf');
            expect(response.status).toBe(404);
        });

        it('Should return 404', async () => {
            const response = await request(app).get('/dgetfqtf');
            expect(response.status).toBe(404);
        });
    })

    describe('TRY OPTIONS', () => {

        it('Should return 405', async () => {
            const response = await request(app).options('/api');
            expect(response.status).toBe(405);
        });
    })

    describe('TRY HEAD', () => {

        it('Should return 405', async () => {
            const response = await request(app).head('/api');
            expect(response.status).toBe(405);
        });
    })
})
