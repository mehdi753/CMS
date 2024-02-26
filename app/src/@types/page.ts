import { Feature } from "./feature";
import { Website } from "./website";

export interface Page {
  _id?: string;
  name: string;
  index: number;
  features: Feature[];
  website?: Website | string;
}
