import { Page } from "./page";
import { Property } from "./property";

export interface Website {
  _id?: string;
  name: string;
  url: string;
  property: Property | string;
  pages?: Array<Page>;
}
