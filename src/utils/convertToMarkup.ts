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
  translatedPropgliederung: any,
  getPropertyByName: any,
  locale: string,
  sources: Record<string, string>
) => {
  //creating a map between the categories and the properties
  const dataAsMap = dataToMap(data, translatedPropgliederung, sources);
  //create a json structure and fill it up with the mapped data
  const dataAsJson = convertDataToJson(dataAsMap, getPropertyByName, locale);
  //convert the json to markdown
  const dataAsMd = json2md(dataAsJson);
  return dataAsMd;
};
