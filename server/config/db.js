import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        // Check if already connected
        if (mongoose.connections[0].readyState) {
            console.log('Already connected to MongoDB');
            return;
        }

        const connectionString = process.env.MONGO_URI;
        
        if (!connectionString) {
            throw new Error('MONGO_URI environment variable is not defined');
        }

        console.log('Attempting to connect to MongoDB...');
        
        const connectionInstance = await mongoose.connect(connectionString, {
            bufferCommands: false,
        });
        
        console.log(`Database connected successfully with host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error; // Don't exit process in serverless environment
    }
};

export default connectDB;
