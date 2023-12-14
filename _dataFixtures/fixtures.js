/*============ IMPORT USED MODULES ============*/
const express = require('express');
const argon2 = require('argon2');
const { faker } = require('@faker-js/faker');

const connectDB = require('./../db.config');

const User = require('./../_models/IUser');
const ErrorHandler = require('../_errors/errorHandler');


/*============ APP INITIALIZATION ============*/
const app = express();


/*============ DATABASE SINGLETON CONNEXION ============*/
connectDB();


/*============ FIXTURES ============*/

/*=== ARGON2 ===*/
const timeCost = parseInt(process.env.ARGON2_TIME_COST);
const memoryCost = parseInt(process.env.ARGON2_MEMORY_COST);

/*=== USER ===*/
const password = 'Xxggxx!1';

const createUsers = async (res) => {
    try {
        const hash = await argon2.hash(password, {
            saltLength: 8,
            timeCost: timeCost,
            memoryCost: memoryCost
        });

        const users = [
            {
                email: 'emmanuel@protonmail.com',
                nickname: 'Manu',
                password: hash,
                registeredAt: faker.date.past(),
            },
            {
                email: 'charlotte@yahoo.fr',
                nickname: 'Charlotte',
                password: hash,
                registeredAt: faker.date.past(),
            },
            {
                email: 'florent@orange.fr',
                nickname: 'Florent',
                password: hash,
                registeredAt: faker.date.past(),
            },
        ];

        // Drop users if collection not empty
        await User.deleteMany({});
        console.log('All users deleted!');

        // Add users
        await User.insertMany(users);
        console.log('Users added!');
    }
    catch (error) {
        return ErrorHandler.sendDatabaseError(res, error);
    }
};


/*============ INSERT FIXTURES ============*/
createUsers();


/*============ LAUNCH SERVER WITH DB TEST ============*/
const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`This server is running on port ${port}. Have fun!`);
});
