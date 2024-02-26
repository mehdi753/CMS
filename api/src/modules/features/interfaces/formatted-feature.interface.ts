import { FEATURE } from 'src/@types/features';

interface Base<T extends FEATURE> {
  name: T;
  index: number;
}

export type FormattedFeature<T extends FEATURE = FEATURE> =
  T extends FEATURE.GALLERY
    ? Base<T> & { images: string[] }
    : T extends FEATURE.CONTENT
    ? Base<T> & { title: string; description: string; images?: string[] }
    : Base<T>;
