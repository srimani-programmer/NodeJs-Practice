const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (err) {
        console.error(`Unable to connect with Database :: ${err.message}`);
    }
};

module.exports = connectDatabase;