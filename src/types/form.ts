/**  Defines index signature to get properties by giving the name of a category and subcategory*/
export type Form = {
  [category: string]: {
    [subCategory: string]: {
      name: string;
      properties: string[];
      description: string;
    };
  };
};
