import {
  getAllCategoryAndWikiprop,
  removeTrailingNumber,
  setRichttextInMap,
  setNormalDataInMap,
} from "./utils";

/**
 * Method to map data to categories based on wikiData-props
 * @param data The data to map
 * @returns Properties mapped to categories
 */
export const dataToMap = (data: any) => {
  const resultMap = new Map();
  const CATEGORY_AND_PROPERTY_MAP = getAllCategoryAndWikiprop();

  for (let dataName in data) {
    const inputData = data[dataName]; // Fetch data from page.tsx/fieldsdata
    dataName = removeTrailingNumber(dataName); // Remove trailing numbers from dataName (e.g., spitzName1 -> spitzName)

    if (inputData !== "") {
      // Handle rich text fields differently
      const isRichtext =
        dataName.startsWith("Rich Text") ||
        dataName.startsWith("Enter section title");
      if (isRichtext) {
        setRichttextInMap(dataName, inputData, resultMap);
      } else {
        setNormalDataInMap(
          dataName,
          inputData,
          resultMap,
          CATEGORY_AND_PROPERTY_MAP
        );
      }
    }
  }

  return resultMap;
};