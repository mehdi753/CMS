import { FEATURE } from 'src/@types/features';
import { ContentDto } from './misc/content.dto';
import { GalleryDto } from './misc/gallery.dto';
import { FeatureDto } from './misc/feature.dto';

export type AddOrUpdateFeatureDto<T extends FEATURE = FEATURE> =
  T extends FEATURE.GALLERY
    ? FeatureDto<T> & GalleryDto
    : T extends FEATURE.CONTENT
    ? FeatureDto<T> & ContentDto
    : FeatureDto<T>;

export type BaseContentDto<T extends FEATURE = FEATURE> =
  T extends FEATURE.GALLERY
    ? GalleryDto
    : T extends FEATURE.CONTENT
    ? ContentDto
    : never;
