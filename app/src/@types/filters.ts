import { FEATURE } from "./feature";

export interface PropertyQueryFilters {
  _id: string;
  name: string;
}

export interface WebsiteQueryFilters {
  _id: string;
  name: string;
  url: string;
  property: string;
  search: string;
}

export interface UserQueryFilters {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  search: string;
  properties: string[];
}

export interface PageQueryFilters {
  _id: string;
  name: string;
  website: string;
}

export interface FeatureQueryFilter {
  _id: string;
  name: FEATURE;
  index: number;
  page: string;
}
