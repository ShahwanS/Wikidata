import json2md from 'json2md';
import { dataToMap } from './dataMapping';
import { convertDataToJson } from './JsonConversion';

/**
 * Simple method to convert data from website to markdown-content
 * @param data
 * @returns makdown-data
 */
export const convert2Markup = (
  data: any,
  translatedPropgliederung: any,
  locale: string,
  sources: Record<string, string>,
  userInfo: Record<string, string>,
): string => {
  const dataAsMap = dataToMap(data, translatedPropgliederung, sources);
  const dataAsJson = convertDataToJson(dataAsMap, locale, userInfo);
  return json2md(dataAsJson);
};
