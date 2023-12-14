/*============ IMPORT USED MODULES ============*/
const express = require('express');
const argon2 = require('argon2');
const { faker } = require('@faker-js/faker');

const connectDB = require('./../db.config');

const User = require('./../_models/IUser');
const Article = require('./../_models/IArticle');
const ErrorHandler = require('../_errors/errorHandler');


/*============ APP INITIALIZATION ============*/
const app = express();


/*============ DATABASE SINGLETON CONNEXION ============*/
connectDB();


/*============ FIXTURES ============*/

/*=== ARGON2 ===*/
const timeCost = parseInt(process.env.ARGON2_TIME_COST);
const memoryCost = parseInt(process.env.ARGON2_MEMORY_COST);

/*=== USERS ===*/
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
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
};

/*=== ARTICLES ===*/
const createArticles = async (res) => {
    try {
        // Get all users
        const users = await User.find();
        if (users === 0) {
            return ErrorHandler.handleUserNotFound(res);
        }

        // Create 5 articles for each user
        const articles = [];
        users.forEach((user) => {
            for (let i = 1; i <= 5; i++) {
                articles.push({
                    title: faker.lorem.words(4),
                    content: faker.lorem.paragraph({ min: 3, max: 6 }),
                    author: user._id,
                    createdAt: faker.date.past()
                });
            }
        });

        // Drop articles if collection not empty
        await Article.deleteMany({});
        console.log('All articles deleted!');

        // Add articles
        await Article.insertMany(articles);
        console.log('Articles added!');
    }
    catch (err) {
        return ErrorHandler.sendDatabaseError(res, err);
    }
}

/*============ INSERT FIXTURES ============*/
createUsers();
createArticles();


/*============ LAUNCH SERVER WITH DB TEST ============*/
const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`This server is running on port ${port}. Have fun!`);
});
