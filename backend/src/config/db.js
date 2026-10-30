import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ev_sahayak';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000, // Quick timeout so server can run even before local mongo is started
    });
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(` MongoDB Connection Warning: ${error.message}`);
    console.info(' Running in Memory/Mock-Fallback Mode for standalone demonstration.');
    return false;
  }
};
