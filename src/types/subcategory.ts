import { Property } from "./property";

/** Structure for a subcategory */
export type SubCategory = {
  name: string;
  description: string;
  properties: Property[];
};