/*============ IMPORT USED MODULES ============*/
const mongoose = require('mongoose');


/*============ DATABASE SINGLETON CONNEXION ============*/
const connectDB = async () => {
    try {
        const mongoURI = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        await mongoose.connect(mongoURI);
        console.log('MongoDB is connected!');
    }
    catch (err) {
        console.error('Database error connexion!', err);
        process.exit(1);
    }
};


/*============ EXPORT MODULE ============*/
module.exports = connectDB;
