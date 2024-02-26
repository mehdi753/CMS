import { FEATURE } from 'src/@types/features';
import { I18nText } from 'src/@types/language';

interface Base<T extends FEATURE> {
  _id?: string;
  name: T;
  index: number;
  page?: string;
}

export type Feature<T extends FEATURE = FEATURE> = T extends FEATURE.GALLERY
  ? Base<T> & { images: string[] }
  : T extends FEATURE.CONTENT
  ? Base<T> & { title: I18nText; description: I18nText; images?: string[] }
  : Base<T>;
