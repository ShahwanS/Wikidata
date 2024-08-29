import {
  addTitleToJson,
  addCategoryAsSubtitleToJson,
  addDataFromCategoryToJson,
} from "@/utils/JsonElements";
import { getTitle } from "./utils";

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
  const title = getTitle(dataAsMap.get("Namensangaben"));
  addTitleToJson(title, jsonOutput); // Add Title to JSON

  // Add all Data in Map to JSON
  dataAsMap.forEach((dataList, category) => {
    let hasValidData = dataList.length > 0; // Flag to check if the category has valid data
    if (hasValidData) {
      addCategoryAsSubtitleToJson(category, jsonOutput); // Add category name as Subtitle
      addDataFromCategoryToJson(dataList, jsonOutput, isShowedWikiProps, title); // Add input in each category to JSON
    }
  });

  return jsonOutput;
};
