const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Initialize indexes for geospatial queries
        await Promise.all([
            mongoose.model('Project').createIndexes({ location: '2dsphere' }),
            mongoose.model('Grievance').createIndexes({ location: '2dsphere' })
        ]);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Handle MongoDB events
mongoose.connection.on('error', err => {
    console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

process.on('SIGINT', async() => {
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = connectDB();