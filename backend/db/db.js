import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = () => {
    const conn = mongoose.connect()
};
