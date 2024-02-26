import { I18nText } from "./language";
import { Page } from "./page";

export enum FEATURE {
  CONTENT = "content",
  LOCATION = "location",
  CONTACT = "contact",
  GALLERY = "gallery",
}

export enum FEATURE_NAME {
  content = "Content",
  location = "Location",
  contact = "Contact",
  gallery = "Gallery",
}

interface Base<T extends FEATURE> {
  _id?: string;
  name: T;
  index: number;
  page?: Page | string;
}

export type Feature<T extends FEATURE = FEATURE> = T extends FEATURE.GALLERY
  ? Base<T> & { images: string[] }
  : T extends FEATURE.CONTENT
  ? Base<T> & { title: I18nText; description: I18nText; images?: string[] }
  : Base<T>;
