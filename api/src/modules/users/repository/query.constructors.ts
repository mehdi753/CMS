import { FilterQuery, Types } from 'mongoose';
import { UserQueryFilters } from 'src/@types/filters';
import { Query } from 'src/@types/misc';
const ObjectId = Types.ObjectId;
export class QueriesConstructor {
  filters = (filters: Query<UserQueryFilters>): FilterQuery<any> => {
    let query: FilterQuery<any> = {};
    if (filters) {
      query = { ...filters };
      delete query.search;
      if (filters.search) {
        delete query.search;
        Object.assign(query, {
          $or: [
            {
              firstName: {
                $regex: new RegExp(`.*${filters.search}.*`, 'i'),
              },
            },
            {
              lastName: {
                $regex: new RegExp(`.*${filters.search}.*`, 'i'),
              },
            },
            {
              email: {
                $regex: new RegExp(`.*${filters.search}.*`, 'i'),
              },
            },
          ],
        });
      }
      if (filters.properties) {
        delete query.properties;
        query.properties = {
          $in: filters.properties.map((property) => new ObjectId(property)),
        };
      }
      if (filters.$not) {
        delete query.$not;
        for (const key in filters.$not) {
          if (key === 'properties') {
            query[key] = {
              $nin: filters.$not[key].map((property) => new ObjectId(property)),
            };
          } else {
            query[key] = { $neq: filters.$not[key] };
          }
        }
      }
    }
    return query;
  };
}
