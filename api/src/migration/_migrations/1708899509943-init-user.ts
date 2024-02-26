import { ROLE } from 'src/@types/roles';
import { connectMongoDB, disconnectMongoDB } from 'src/migration/utils/db';
import { User, UsersSchema } from 'src/modules/users/schemas/user.schema';
import CustomLogger from 'src/utils/custom-logger';
import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const Logger = new CustomLogger('INIT USER MIGRATION');

/**
 * @description Init a super admin user in database
 *
 */
export const up = async (next) => {
  Logger.debug('Started migration...');
  await connectMongoDB();
  const userModel = mongoose.model(User.name, UsersSchema, User.name);
  const user = {
    firstName: 'Admin',
    lastName: 'Admin',
    email: 'admin@hcm.com',
    password: 'admin123456',
    picture: `${process.env.URL}/storage/avatar.png`,
    role: ROLE.SUPER_ADMIN,
    verified: true,
    properties: [],
  };
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
  await userModel.insertMany([user]);
  await disconnectMongoDB();
  Logger.debug('...ended migration');
  next();
};

export const down = async (next) => {
  Logger.debug('Started revert...');
  await connectMongoDB();
  const userModel = mongoose.model(User.name, UsersSchema, User.name);
  await userModel.deleteOne({ email: 'admin@hcm.com' });
  await disconnectMongoDB();
  Logger.debug('...revert done');
  next();
};
