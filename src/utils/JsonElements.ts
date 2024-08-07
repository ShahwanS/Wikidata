import { getTitle, checkImage, simpleHtmlToMarkdown } from "./utils";
import { getPropertyByName } from "./propgliederung";

/**
 * Adds the title from "Namensangaben" to the JSON output.
 * @param dataAsMap Map containing the data categorized by name
 * @param jsonOutput JSON output array
 */
export function addTitleToJson(dataAsMap: any, jsonOutput: any) {
  const title = getTitle(dataAsMap.get("Namensangaben"));
  jsonOutput.push({ h1: title });
}

/**
 * Adds the category as a subtitle to the JSON output.
 * @param category Category name
 * @param jsonOutput JSON output array
 */
export function addCategoryAsSubtitleToJson(category: any, jsonOutput: any) {
  jsonOutput.push({ h2: category });
}

/**
 * Adds data from a category to the JSON output.
 * @param dataList List of data items from the category
 * @param jsonOutput JSON output array
 */
export function addDataFromCategoryToJson(
  dataList: any,
  jsonOutput: any,
  isShowedWikiProps: boolean
) {
  let previousDataWikiProperty = "";

  dataList.forEach(([dataName, inputData, wikiprop]: [string, any, string]) => {
    let isNotFromAdditionalField = previousDataWikiProperty != wikiprop;
    const isUrl = wikiprop === "P856";
    const isRichtext = wikiprop === "richtext";
    const isImage = checkImage(inputData, wikiprop);

    if (isImage) {
      if (isNotFromAdditionalField) {
        addImageToJson(
          wikiprop,
          dataName,
          inputData,
          jsonOutput,
          isShowedWikiProps
        );
      } else {
        addImageFromAdditionalFieldToJson(inputData, dataName, jsonOutput);
      }
    } else if (isUrl) {
      addUrlToJson(
        wikiprop,
        dataName,
        inputData,
        jsonOutput,
        isShowedWikiProps
      );
    } else if (isRichtext) {
      addRichTextToJson(wikiprop, dataName, inputData, jsonOutput);
    } else {
      if (isNotFromAdditionalField) {
        addNormalDataToJson(
          wikiprop,
          dataName,
          inputData,
          jsonOutput,
          isShowedWikiProps
        );
      } else {
        addDataFromAdditionalFieldToJson(inputData, jsonOutput);
      }
    }

    previousDataWikiProperty = wikiprop;
  });
}

/**
 * Adds image data to the JSON output.
 * @param wikiprop Wiki property associated with the data
 * @param dataName Name of the data
 * @param inputData Image data
 * @param jsonOutput JSON output array
 */
function addImageToJson(
  wikiprop: string,
  dataName: string,
  inputData: any,
  jsonOutput: any,
  isShowedWikiProps: boolean
) {
  const containsImage = inputData.name !== "";
  if (containsImage) {
    const imagePath = `./images/${inputData.name}`;
    isShowedWikiProps
      ? jsonOutput.push({
          p: `### ${wikiprop}\t${dataName}\n![${dataName}](${imagePath})`,
        }) // with wikiProp
      : jsonOutput.push({ p: `### ${dataName}\n![${dataName}](${imagePath})` }); // Without wikiprop
  }
}

/**
 * Adds image from an additional field to the JSON output.
 * @param inputData Additional field data
 * @param jsonOutput JSON output array
 */
function addImageFromAdditionalFieldToJson(
  inputData: any,
  dataName: String,
  jsonOutput: any
) {
  const containsImage = inputData.name !== "";
  if (containsImage) {
    const imagePath = `./images/${inputData.name}`;
    jsonOutput.push({ p: `![${dataName}](${imagePath})` });
  }
}

/**
 * Adds a URL to the JSON output.
 * @param wikiprop Wiki property associated with the data
 * @param dataName Name of the data
 * @param inputData URL data
 * @param jsonOutput JSON output array
 */
function addUrlToJson(
  wikiprop: string,
  dataName: string,
  inputData: any,
  jsonOutput: any,
  isShowedWikiProps: boolean
) {
  isShowedWikiProps
    ? jsonOutput.push({
        p: `### ${wikiprop}\t${dataName}\n[${dataName}](${inputData})`,
      })
    : jsonOutput.push({ p: `### ${dataName}\n[${dataName}](${inputData})` });
}

/**
 * Adds rich text data to the JSON output.
 * @param wikiprop Wiki property associated with the data
 * @param dataName Name of the data
 * @param inputData Rich text data
 * @param jsonOutput JSON output array
 */
function addRichTextToJson(
  wikiprop: string,
  dataName: string,
  inputData: any,
  jsonOutput: any
) {
  const markdown = simpleHtmlToMarkdown(inputData);
  jsonOutput.push({ p: `${markdown}` });
}

/**
 * Adds normal data (non-URL, non-rich text) to the JSON output.
 * @param wikiprop Wiki property associated with the data
 * @param dataName Name of the data
 * @param inputData Normal data
 * @param jsonOutput JSON output array
 */
function addNormalDataToJson(
  wikiprop: string,
  dataName: string,
  inputData: any,
  jsonOutput: any,
  isShowedWikiProps: boolean
) {
  isShowedWikiProps
    ? jsonOutput.push({
        p: `### ${wikiprop}\t${dataName}\n-\t${inputData}${
          getPropertyByName(dataName).unit
            ? " " + getPropertyByName(dataName).unit
            : ""
        }`,
      })
    : jsonOutput.push({
        p: `### ${dataName}\n-\t${inputData}${
          getPropertyByName(dataName).unit
            ? " " + getPropertyByName(dataName).unit
            : ""
        }`,
      });
}

/**
 * Adds data from an additional field to the JSON output.
 * @param inputData Additional field data
 * @param jsonOutput JSON output array
 */
function addDataFromAdditionalFieldToJson(inputData: any, jsonOutput: any) {
  jsonOutput.push({ p: `-\t${inputData}` });
}
