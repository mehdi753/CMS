import { User } from "./user";
import { Website } from "./website";
import { Location as ILocation } from "./misc";

export interface Property {
  _id?: string;
  picture?: string;
  name: string;
  active: boolean;
  location: ILocation;
  users: Array<User | string>;
  website?: Website;
}

export type AddOrUpdateProperty = Omit<Property, "users"> & {
  websiteName?: string;
  websiteUrl?: string;
};
