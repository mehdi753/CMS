import { User } from 'src/modules/users/interfaces/user.interface';
import { Website } from 'src/modules/websites/interfaces/website.interface';

export interface Property {
  _id: string;
  picture?: string;
  name: string;
  location: {
    longitude: number;
    latitude: number;
    country?: string;
    locality?: string;
    state?: string;
    countryCode?: string;
  };
  website?: Website | string;
  users: Array<User | string>;
}
