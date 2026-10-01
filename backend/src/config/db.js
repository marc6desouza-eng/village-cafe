import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/village_cafe';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB connection to ${uri} failed (${error.message}).`);
    console.warn(`[Database] Running in High-Reliability Persistent Local Store mode (backend/data/).`);
    console.warn(`[Database] All data, menu items, reservations, and edits will persist to disk automatically.`);
    console.warn(`[Database] To use MongoDB Atlas, specify your MONGODB_URI in backend/.env.`);
    return false;
  }
};

export const getDBStatus = () => ({
  isMongoConnected,
  type: isMongoConnected ? 'MongoDB / Mongoose' : 'Persistent Local Store (Disk JSON)',
});
