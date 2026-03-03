const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // In a real app we would use process.env.MONGO_URI
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/intellimeet');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
