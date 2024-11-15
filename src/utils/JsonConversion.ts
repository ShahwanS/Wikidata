import {
  addTitleToJson,
  addCategoryAsSubtitleToJson,
  addDataFromCategoryToJson,
} from '@/utils/JsonElements';
import { getTitle } from './utils';





type JsonOutputElement = {
  h1?: string;
  h2?: string;
  p?: string;
};

type UserInfo = {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
};

type DataMapValue = [string, any, string?, string?, string?][]; // [dataName, inputData, wikiprop?, source?, copyright?]



/**
 * Convert data to JSON
 * @param dataAsMap (map with category and data)
 * @return JSON (array of objects)
 */
export const convertDataToJson = (
  dataAsMap: Map<any, any>,
  getPropertyByName: any,
  locale: string,
  userInfo: Record<string, string>,
) => {
  const jsonOutput: { h1?: string; h2?: string; p?: string }[] = [];
 // Get title based on locale
  const titleCategory = locale === 'de' ? 'Namensangaben' : 'Name Information';
  const title = getTitle(dataAsMap.get(titleCategory));

  addTitleToJson(title, jsonOutput);
  // Create and add user info section
  const userInfoSection: JsonOutputElement[] = locale === 'de' 
    ? [
        { h2: 'Benutzerinformationen' },
        { p: `Benutzer-ID: ${userInfo.userId}` },
        { p: `Name: ${userInfo.userFirstName} ${userInfo.userLastName}` },
        { p: `E-Mail: ${userInfo.userEmail}` },
      ]
    : [
        { h2: 'User Information' },
        { p: `User ID: ${userInfo.userId}` },
        { p: `Name: ${userInfo.userFirstName} ${userInfo.userLastName}` },
        { p: `Email: ${userInfo.userEmail}` },
      ];
  jsonOutput.push(...userInfoSection);
  // Process each category in the data map
  dataAsMap.forEach((dataList: DataMapValue, category: string) => {
    const hasValidData = dataList.some(([_, inputData, , ,]: DataMapValue[number]) => {
      if (Array.isArray(inputData)) {
        return inputData.some((item: any) =>
          item !== null &&
          item !== undefined &&
          item !== '' && 
          !(item instanceof File && item.size === 0)
        );
      }
      return inputData !== null && 
             inputData !== undefined && 
             inputData !== '' &&
             !(inputData instanceof File && inputData.size === 0);
    });

    if (hasValidData) {
      addCategoryAsSubtitleToJson(category, jsonOutput);
      addDataFromCategoryToJson(dataList, jsonOutput, title, getPropertyByName);
    }
  });

  return jsonOutput;
};