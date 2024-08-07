import json2md from "json2md";
import { dataToMap } from "./dataMapping";
import { convertDataToJson } from "./JsonConversion";

/**
 * Simple method to convert data from website to markdown-content
 * @param data
 * @returns makdown-data
 */
export const convert2Markup = (data: any, isShowedWikiProps: boolean) => {
  const dataAsMap = dataToMap(data); // First mapping properties to categories
  const dataAsJson = convertDataToJson(dataAsMap, isShowedWikiProps); // Then maped data to json
  const dataAsMd = json2md(dataAsJson); // Finally json to markdown
  return dataAsMd;
};