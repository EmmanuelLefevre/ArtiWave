/*=============================================*/
/*============ rateLimiter.test.js ============*/
/*=============================================*/


/*============ IMPORT USED MODULES ============*/
const request = require('supertest');
const app = require('../app');
const connectDB = require('../db.config');


/*============ MAIN RATE LIMITER TEST ============*/
describe('MAIN RATE LIMITER', () => {
    afterAll(async () => {
        await connectDB.closeDB();
    })

    it('Should return 429 for too many requests', async () => {
        // Simulate sending 11 requests quickly in less than one second
        const responses = await Promise.all(
            Array.from({ length: 11 }).map(() => tooManyRequests())
        );

        responses.forEach(response => {
            console.log(response.status);
            expect(response.status).toBe(429);
        });
    });
});


/*============ FUNCTIONS ============*/

const tooManyRequests = () => {
    return new Promise(resolve => {
        setTimeout(async () => {
            const response = await request(app).get('/api');
            resolve(response);
        }, 1); // 1 millisecond between each requests
    });
};
