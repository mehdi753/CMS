import { connectMongoDB, disconnectMongoDB } from 'src/migration/utils/db';
import CustomLogger from 'src/utils/custom-logger';

const Logger = new CustomLogger('?');

/**
 * @description what does the script do?
 *
 */
export const up = async (next) => {
  Logger.debug('Started migration...');
  await connectMongoDB();
  // @Todo use the model you need and wipe the rest.
  /*

      Code your update script here!

   */
  await disconnectMongoDB();
  Logger.debug('...ended migration');
  next();
};

export const down = async (next) => {
  Logger.debug('Started revert...');
  await connectMongoDB();
  /*

      Code you downgrade script here!

   */
  await disconnectMongoDB();
  Logger.debug('...revert done');
  next();
};
