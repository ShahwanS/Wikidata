import { SubCategory } from "./subcategory";

/** Structure for a category */
export type Category = {
  title: string;
  description: string;
  subcategories: SubCategory[];
};
