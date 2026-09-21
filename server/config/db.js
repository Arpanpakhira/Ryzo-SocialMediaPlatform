import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://arpanpakhira8_db_user:RIwwWkOJVCmQmRCK@ryzo-cluster.7n6jvys.mongodb.net/ryzo?retryWrites=true&w=majority&appName=Ryzo-Cluster'
, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};
