import { Property } from 'src/modules/properties/interfaces/property.interface';

export interface Website {
  _id: string;
  name: string;
  url: string;
  property: Property | string;
}
