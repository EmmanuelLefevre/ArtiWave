/*============ IMPORT USED MODULES ============*/
const express = require('express');
const argon2 = require('argon2');
const { faker } = require('@faker-js/faker');

const connectDB = require('./../db.config');

const User = require('./../_models/IUser');
const Article = require('./../_models/IArticle');


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

const createFixtures = async (res) => {
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
        deleteResult = await User.deleteMany({});
        console.log('\n-----------------------------------------\n');
        if (deleteResult.deletedCount > 0) {
            console.log('All users deleted!');
        }

        // Add users
        await User.insertMany(users);
        console.log('Users added!');

        // Call createArticles() after users insert
        await createArticles(res);
        console.log('\n-----------------------------------------\n');
        console.log('ALL FIXTURES LOADED!');

        // Close server
        console.log('\n-----------------------------------------\n');
        console.log(`This server running on port ${port} was closed. Goodbye see you soon!`);
        process.exit(0);
    }
    catch (err) {
        console.error('An error occurred:', err);
        process.exit(1);
    }
};

/*=== ARTICLES ===*/
const createArticles = async () => {
    try {
        // Get all users
        const users = await User.find();

        // Drop articles if collection not empty
        console.log('\n-----------------------------------------\n');
        deleteResult = await Article.deleteMany({});
        if (deleteResult.deletedCount > 0) {
            console.log('All articles deleted!');
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

        // Add articles
        await Article.insertMany(articles);
        console.log('Articles added!');
    }
    catch (err) {
        console.error('An error occurred:', err);
        process.exit(1);
    }
}

/*============ INSERT FIXTURES ============*/
createFixtures();


/*============ LAUNCH SERVER WITH DB TEST ============*/
const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`This server is running on port ${port}. Have fun!`);
});
