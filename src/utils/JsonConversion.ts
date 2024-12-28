import {
  addTitleToJson,
  addCategoryAsSubtitleToJson,
  addDataFromCategoryToJson,
} from '@/utils/JsonElements';
import { getTitle } from './utils';



type DataMap = [string, any, string?, string?, string?][]; // [dataName, inputData, wikiprop?, source?, copyright?]

/**
 * Converts mapped data to JSON for Markdown conversion.
 * @param dataAsMap - Mapped data categorized by name.
 * @param locale - The locale of the output ('en' or 'de').
 * @param userInfo - Information about the user.
 * @returns JSON-ready array for Markdown conversion.
 */
export const convertDataToJson = (
  dataAsMap: Map<any, any>,
  locale: string,
  userInfo: Record<string, string>,
) => {
  const jsonOutput: { h1?: string; h2?: string; p?: string }[] = [];

  // Get title based on locale
  const titleCategory = locale === 'de' ? 'Namensangaben' : 'Name Information';
  const title = getTitle(dataAsMap.get(titleCategory));
  addTitleToJson(title, jsonOutput);

  // Add user information section
  const userInfoSection =
    locale === 'de'
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
  dataAsMap.forEach((dataList: DataMap, category: string) => {
    const hasValidData = dataList.some(([_, inputData]) => inputData);

    if (hasValidData) {
      addCategoryAsSubtitleToJson(category, jsonOutput);
      addDataFromCategoryToJson(dataList, jsonOutput, title);
    }
  });

  return jsonOutput;
};
