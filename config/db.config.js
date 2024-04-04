import mongoose from 'mongoose'
import env from "../env.js";
env(process.env['APP_ENV'])

console.log(process.env.DATABASE)
export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
    console.log("database connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

