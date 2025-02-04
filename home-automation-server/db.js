
const mongoose = require('mongoose');

module.exports = async () => {
    try {
        const url = process.env.MONGO_URL;
        if (!url) {
            throw new Error('Database connection string is not defined');
        }
        console.log('Database connection string:', url);

        await mongoose.connect(url)
        console.log('Connected to database successfully');
    } catch (error) {
        console.log(error);
        console.log('Could not connect to database');
    }
};