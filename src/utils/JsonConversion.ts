import {
  addTitleToJson,
  addCategoryAsSubtitleToJson,
  addDataFromCategoryToJson,
} from "./JsonElements";

/**
 * Convert data to JSON
 * @param dataAsMap (map with category and data)
 * @return JSON (array of objects)
 */
export const convertDataToJson = (
  dataAsMap: Map<any, any>,
  isShowedWikiProps: boolean
) => {
  const jsonOutput: { h1?: string; h2?: string; p?: string }[] = [];

  addTitleToJson(dataAsMap, jsonOutput); // Add Title to JSON

  // Add all Data in Map to JSON
  dataAsMap.forEach((dataList, category) => {
    let hasValidData = dataList.length > 0; // Flag to check if the category has valid data
    if (hasValidData) {
      addCategoryAsSubtitleToJson(category, jsonOutput); // Add category name as Subtitle
      addDataFromCategoryToJson(dataList, jsonOutput, isShowedWikiProps); // Add input in each category to JSON
    }
  });

  return jsonOutput;
};
