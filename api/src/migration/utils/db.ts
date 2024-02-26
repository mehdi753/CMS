import * as mongoose from 'mongoose';
import { config } from 'dotenv';

export const connectMongoDB = async () => {
  config();
  await mongoose.connect(
    `${process.env.MONGO_SCHEME}://${process.env.MONGO_DOMAIN}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE_NAME}`,
  );
  return mongoose.connection.db;
};

export const disconnectMongoDB = async () => mongoose.connection.close();
