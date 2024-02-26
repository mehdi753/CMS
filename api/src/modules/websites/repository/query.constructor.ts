import { FilterQuery, Types } from 'mongoose';
import { WebsiteQueryFilters } from 'src/@types/filters';

const ObjectId = Types.ObjectId;

export class QueriesConstructor {
  filters = (filters: Partial<WebsiteQueryFilters>): FilterQuery<any> => {
    let query: FilterQuery<WebsiteQueryFilters> = {};
    if (filters) {
      query = { ...filters };
      if (filters._id) {
        delete query._id;
        query._id = new ObjectId(filters._id);
      }
      if (filters.property) {
        query.property = new ObjectId(filters.property);
      }
      if (filters.search) {
        delete query.search;
        Object.assign(query, {
          $or: [
            {
              name: {
                $regex: new RegExp(`.*${filters.search}.*`, 'i'),
              },
            },
            {
              url: {
                $regex: new RegExp(`.*${filters.search}.*`, 'i'),
              },
            },
          ],
        });
      }
    }
    return query;
  };
}
