import json2md from "json2md";
import { dataToMap } from "./dataMapping";
import { convertDataToJson } from "./JsonConversion";

/**
 * Simple method to convert data from website to markdown-content
 * @param data
 * @returns makdown-data
 */
export const convert2Markup = (
  data: any,
  t: any,
  getPropertyByName: any,
  locale: string
) => {
  const dataAsMap = dataToMap(data, t); // First mapping properties to categories
  const dataAsJson = convertDataToJson(dataAsMap, getPropertyByName, locale); // Then maped data to json
  console.log(
    "Final dataAsJson before markdown conversion:",
    JSON.stringify(dataAsJson, null, 2)
  );
  const dataAsMd = json2md(dataAsJson); // Finally json to markdown
  return dataAsMd;
};
