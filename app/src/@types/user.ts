import { Property } from "./property";
import { ROLE } from "./role";

export interface User {
  _id?: string;
  picture?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  properties: Array<Property | string>;
  role: ROLE;
}

export type AddOrUpdateUser = Omit<User, "verified" | "_id" | "properties"> & {
  password?: string;
  properties?: string[];
};
