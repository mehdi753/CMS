import { ROLE } from 'src/@types/roles';
import { Property } from 'src/modules/properties/interfaces/property.interface';

export interface User {
  _id?: string;
  picture?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  verified: boolean;
  properties?: Array<Property | string>;
  role: ROLE;
}
