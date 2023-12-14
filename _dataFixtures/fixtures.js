/*============ IMPORT USED MODULES ============*/
const express = require('express');
const { faker } = require('@faker-js/faker');

const connectDB = require('./../db.config');

const User = require('./../_models/IUser');


/*============ APP INITIALIZATION ============*/
const app = express();


/*============ DATABASE SINGLETON CONNEXION ============*/
connectDB();


/*============ FIXTURES ============*/

/*=== USER ===*/
const generateFakeUserData = () => {
    return {
        email: faker.internet.email(),
        nickname: faker.internet.userName(),
        password: faker.internet.password(),
        registeredAt: faker.date.past()
    };
};

const createFakeUser = async () => {
    const fakeUserData = generateFakeUserData();

    try {
        const newUser = new User(fakeUserData);
        await newUser.save();
        console.log('User added:', newUser);
    }
    catch (error) {
        console.error('Error adding user in database:', error);
    }
};


/*============ DROP EXISTING USERS ============*/
const dropExistingUsers = async () => {
    try {
        await User.deleteMany({});
        console.log('All users deleted!');
    } catch (error) {
        console.error('Error deleting users in database:', error);
    }
};


/*============ INSERT FIXTURES ============*/
// Check if collection contains users, then delete them
dropExistingUsers().then(() => {
    // Generate user
    createFakeUser();

});

/*============ LAUNCH SERVER WITH DB TEST ============*/
const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`This server is running on port ${port}. Have fun!`);
});
