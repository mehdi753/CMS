import { FilterQuery, Types } from 'mongoose';
import { PropertyQueryFilters } from 'src/@types/filters';
const ObjectId = Types.ObjectId;
export class QueriesConstructor {
  filters = (
    filters: Partial<PropertyQueryFilters>,
    strict?: boolean,
  ): FilterQuery<any> => {
    let query: FilterQuery<PropertyQueryFilters> = {};
    if (filters) {
      query = { ...filters };
      if (filters._id) {
        query._id = new ObjectId(query._id);
      }
      if (filters.name && !strict) {
        delete query.name;
        Object.assign(query, {
          name: { $regex: new RegExp(`.*${filters.name}.*`, 'i') },
        });
      }
    }
    return query;
  };
}
