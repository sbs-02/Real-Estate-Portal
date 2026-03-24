import app from './app.js';
import connectDB from './config/db.js';

let isDbConnected = false;

export default async (req: any, res: any) => {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }
  return app(req, res);
};
