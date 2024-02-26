import CustomLogger from 'src/utils/custom-logger';
import { connectMongoDB, disconnectMongoDB } from './db';

const logger = new CustomLogger();

export default class MongoStateStore {
  async load(fn) {
    const db = await connectMongoDB();
    let data = null;
    try {
      data = await db.collection('migrations').find().toArray();
      if (data.length !== 1) {
        logger.warn(
          'Cannot read migrations from database. If this is the first time you run migrations, then this is normal.',
        );
        return fn(null, {});
      }
    } catch (err) {
      logger.error(err);
      throw err;
    } finally {
      await disconnectMongoDB();
    }
    return fn(null, data[0]);
  }
  async save(set, fn) {
    const db = await connectMongoDB();
    let result = null;
    try {
      result = await db.collection('migrations').updateOne(
        {},
        {
          $set: {
            lastRun: set.lastRun,
          },
          $push: {
            migrations: set.migrations,
          },
        },
        { upsert: true },
      );
    } catch (err) {
      logger.error(err);
      throw err;
    } finally {
      await disconnectMongoDB();
    }
    return fn(null, result);
  }
}
