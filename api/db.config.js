/*======================================*/
/*============ db.config.js ============*/
/*======================================*/


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
        // process.exit(1);
        throw err;
    }
};

/*============ DATABASE CLOSE CONNEXION ============*/
const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed!');
    }
    catch (err) {
        console.error('Error closing MongoDB connection:', err);
    }
}


/*============ EXPORT MODULE ============*/
module.exports = {connectDB, closeDB};
