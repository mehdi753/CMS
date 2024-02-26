import { Feature } from 'src/modules/features/interfaces/feature.interface';
import { Website } from 'src/modules/websites/interfaces/website.interface';

export interface Page {
  _id?: string;
  name: string;
  index: number;
  website: Website | string;
  features?: Feature[];
}
