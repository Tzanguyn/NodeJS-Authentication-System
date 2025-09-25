import mongoose from "mongoose";  // Importing mongoose for MongoDB interactions
import dotenv from "dotenv";      // Importing dotenv to load environment variables

dotenv.config();  // Loading environment variables from .env file
const url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/authdatabase';  // Fallback to local DB

// Function to connect to MongoDB using Mongoose
export const connectUsingMongoose = async () => {
    try {
        // Attempting to connect to MongoDB using Mongoose
        await mongoose.connect(url);

        // If connection is successful, log a success message
        console.log("Mongodb connected using mongoose");
    } catch (err) {
        // If an error occurs during connection, log the error details
        console.error("Error while connecting to db", err?.message || err);
    }
}
