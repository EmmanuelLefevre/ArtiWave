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
    /*==== /api GET ====*/
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

    /*==== /api OPTIONS ====*/
    describe('TRY OPTIONS', () => {

        it('Should return 405', async () => {
            const response = await request(app).options('/api');
            expect(response.status).toBe(405);
        });
    })

    /*==== /api HEAD ====*/
    describe('TRY HEAD', () => {

        it('Should return 405', async () => {
            const response = await request(app).head('/api');
            expect(response.status).toBe(405);
        });
    })


    /*=== /api/login ===*/
    /*==== /api/login POST ====*/
    describe('TRY POST', () => {

        it('Should return 404', async () => {
            const response = await request(app).post('/api/login/ggrfd');
            expect(response.status).toBe(404);
        });
    })

    /*==== /api/login GET ====*/
    describe('TRY GET', () => {

        it('Should return 405', async () => {
            const response = await request(app).get('/api/login');
            expect(response.status).toBe(405);
        });
    })

    /*==== /api/login PUT ====*/
    describe('TRY PUT', () => {

        it('Should return 405', async () => {
            const response = await request(app).put('/api/login');
            expect(response.status).toBe(405);
        });
    })

    /*==== /api/login PATCH ====*/
    describe('TRY PATCH', () => {

        it('Should return 405', async () => {
            const response = await request(app).patch('/api/login');
            expect(response.status).toBe(405);
        });
    })

    /*==== /api/login DELETE ====*/
    describe('TRY DELETE', () => {

        it('Should return 405', async () => {
            const response = await request(app).delete('/api/login');
            expect(response.status).toBe(405);
        });
    })

    /*==== /api/login OPTIONS ====*/
    describe('TRY OPTIONS', () => {

        it('Should return 405', async () => {
            const response = await request(app).options('/api/login');
            expect(response.status).toBe(405);
        });
    })

    /*==== /api/login HEAD ====*/
    describe('TRY HEAD', () => {

        it('Should return 405', async () => {
            const response = await request(app).head('/api/login');
            expect(response.status).toBe(405);
        });
    })
})
