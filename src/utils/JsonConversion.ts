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
  getPropertyByName: any,
  locale: string,
  userInfo: Record<string, string>
) => {
  const jsonOutput: { h1?: string; h2?: string; p?: string }[] = [];
  const title =
    locale === "de"
      ? getTitle(dataAsMap.get("Namensangaben"))
      : getTitle(dataAsMap.get("Name Information"));

  addTitleToJson(title, jsonOutput);
  const userInfoSection = [
    { h2: "User Information" },
    { p: `User ID: ${userInfo.userId}` },
    { p: `Name: ${userInfo.userFirstName} ${userInfo.userLastName}` },
    { p: `Email: ${userInfo.userEmail}` }
  ];
  jsonOutput.push(...userInfoSection);
  // Add all Data in Map to JSON
  dataAsMap.forEach((dataList, category) => {
    let hasValidData = dataList.length > 0; // Flag to check if the category has valid data
    if (hasValidData) {
      addCategoryAsSubtitleToJson(category, jsonOutput); // Add category name as Subtitle
      addDataFromCategoryToJson(dataList, jsonOutput, title, getPropertyByName); // Add input in each category to JSON
    }
  });

  return jsonOutput;
};
