import json2md from "json2md";
import { getPropertyByName, propgliederung } from "./propgliederung";

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

/**
 * Simple function to translate html-tags to markdown-tags
 */
function simpleHtmlToMarkdown(html: string) {
  let markdown = html
    .replace(/<b>(.*?)<\/b>/g, "**$1**") // Bald texts
    .replace(/<i>(.*?)<\/i>/g, "_$1_") // Italic texts
    .replace(/<ul>(.*?)<\/ul>/gs, (match, p1) => {
      // Unordered lists
      return p1.replace(/<li>(.*?)<\/li>/g, "- $1\n").trim();
    })
    .replace(/<ol>(.*?)<\/ol>/gs, (match, p1) => {
      // Ordered lists
      let counter = 1;
      return p1
        .replace(
          /<li>(.*?)<\/li>/g,
          (match: any) =>
            `${counter++}. ${match.replace(/<li>(.*?)<\/li>/, "$1")}\n`
        )
        .trim();
    })
    .replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/g, "[$2]($1)") // Links
    .replace(/<p>(.*?)<\/p>/g, "$1\n") // Convert paragraphs to text followed by a newline
    .replace(/<br\s*\/?>/g, "\n") // Convert <br> tags to newlines
    .replace(/<b><i>(.*?)<\/i><\/b>/g, "**_$1_**")
    .replace(/<h1>(.*?)<\/h1>/g, "# $1\n") // convert h1
    .replace(/<h2>(.*?)<\/h2>/g, "## $1\n") // convert h2
    .replace(/<h3>(.*?)<\/h3>/g, "### $1\n") // convert h3
    // there is no underline in markdown: delete <u>-tags because otherwise they become _..._ and this is not correct
    .replace(/<u>/g, "")
    .replace(/<\/u>/g, "");
  return markdown.trim(); // Trim the final string to remove any leading/trailing whitespace
}

/**
 * Convert data to JSON
 * @param dataAsMap (map with category and data)
 * @return JSON (array of objects)
 */
const convertDataToJson = (
  dataAsMap: Map<any, any>,
  isShowedWikiProps: boolean
) => {
  const jsonOutput: { h1?: string; h2?: any; p?: string }[] = [];

  addTitleToJson(dataAsMap, jsonOutput); // Add Title to Json

  // Add all Data in Map to Json
  dataAsMap.forEach((dataList, category) => {
    let hasValidData = dataList.length > 0; // Flag to check if the category has valid data
    if (hasValidData) {
      addCategoryAsSubtitleToJson(category, jsonOutput); // Add category name as Subtitle
      addDataFromCategoryToJson(dataList, jsonOutput, isShowedWikiProps); // Add input in each category to json
    }
  });

  return jsonOutput;
};

/**
 * Method to map data to categories based on wikiData-props
 * @param data The data to map
 * @returns Properties mapped to categories
 */
const dataToMap = (data: any) => {
  const resultMap = new Map();
  const CATEGORY_AND_PROPERTY_MAP = getAllCategoryAndWikiprop();

  for (let dataName in data) {
    const inputData = data[dataName]; // Fetch data from page.tsx/fieldsdata
    dataName = removeTrailingNumber(dataName); // Remove trailing numbers from dataName (e.g., spitzName1 -> spitzName)
    const containsData = inputData !== ""; // Check if this property contains data

    if (containsData) {
      // Handle rich text fields differently
      const isRichtext =
        dataName.startsWith("Rich Text") ||
        dataName.startsWith("Enter section title");
      if (isRichtext) {
        setRichttextInMap(dataName, inputData, resultMap);
      } else {
        setNormalDataInMap(
          dataName,
          inputData,
          resultMap,
          CATEGORY_AND_PROPERTY_MAP
        );
      }
    }
  }

  return resultMap;
};

/**
 * Add rich text data to the map
 * @param dataName The name of the data
 * @param inputData The data itself
 * @param resultMap The map to store the data
 */
function setRichttextInMap(
  dataName: String,
  inputData: String,
  resultMap: any
) {
  const category = "Weitere Angaben als Freitext";
  const wikiprop = "richtext";
  const dataEntry = [dataName, inputData, wikiprop];
  if (resultMap.has(category)) {
    resultMap.get(category).push(dataEntry);
  } else {
    resultMap.set(category, [dataEntry]);
  }
}

/**
 * Add normal data (non-rich text) to the map
 * @param dataName The name of the data
 * @param inputData The data itself
 * @param resultMap The map to store the data
 * @param allCategoryAndPropertyMap Map containing all categories and wiki properties
 */
function setNormalDataInMap(
  dataName: String,
  inputData: String,
  resultMap: any,
  allCategoryAndPropertyMap: any
) {
  // Normal field processing
  const categoryAndWikiprop = getCategoryAndWikipropAsList(
    dataName,
    allCategoryAndPropertyMap
  );
  const category = categoryAndWikiprop[0];
  const wikiprop = categoryAndWikiprop[1];
  const categoryExistsInMap = resultMap.has(category);
  if (categoryExistsInMap) {
    resultMap.get(category).push([dataName, inputData, wikiprop]);
  } else {
    resultMap.set(category, [[dataName, inputData, wikiprop]]);
  }
}

/**
 * Get the category and wiki property as a list for the given dataName
 * @param dataName The name of the data
 * @param allCategoryAndPropertyMap Map containing all categories and wiki properties
 * @returns [Category, Wiki property]
 */
function getCategoryAndWikipropAsList(
  dataName: string,
  allCategoryAndPropertyMap: Map<any, any>
): [string, string] {
  return allCategoryAndPropertyMap.get(dataName);
}

/**
 * This method returns a map, which contains all data with category and wikiproperty and dataName as key
 * @returns map (Key : DataName, Value: [Category,Wikiprop] )
 */
function getAllCategoryAndWikiprop() {
  const categoryAndPropertyMap = new Map();
  propgliederung.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.properties.forEach((property) => {
        const key = property.name;
        const value = [category.title, property.wikidataprop];
        categoryAndPropertyMap.set(key, value);
      });
    });
  });
  return categoryAndPropertyMap;
}

/**
 * check, whether inputData is image
 * @param inputData any
 * @param wikiprop Wikipediaproperty
 * @returns boolen
 */
function checkImage(inputData: any, wikiprop: String): boolean {
  const IMAGEWIKIPROPS = ["P18", "P7417", "P9721", "P8592", "P5775", "P3311"];
  const isImageFile = inputData instanceof File;
  const wikipropExists = IMAGEWIKIPROPS.includes(wikiprop);
  return isImageFile && wikipropExists;
}

/**
 * Adds data from a category to the JSON output.
 * @param dataList List of data items from the category
 * @param jsonOutput JSON output array
 */
function addDataFromCategoryToJson(
  dataList: any,
  jsonOutput: any,
  isShowedWikiProps: boolean
) {
  // Store the WikiProperty from the previous data to determine if the current data is from an additional field
  let previousDataWikiProperty = "";

  dataList.forEach(([dataName, inputData, wikiprop]: [string, any, string]) => {
    let isNotFromAdditionalField = previousDataWikiProperty != wikiprop; // true, if this data does not come from additional field

    const isUrl = wikiprop === "P856"; // URL
    const isRichtext = wikiprop === "richtext"; // Richtext
    const isImage = checkImage(inputData, wikiprop); // Image

    if (isImage) {
      if (isNotFromAdditionalField) {
        addImageToJson(
          // For image NOT from additional field
          wikiprop,
          dataName,
          inputData,
          jsonOutput,
          isShowedWikiProps
        );
      } else {
        addImageFromAdditonalFieldToJson(inputData, dataName, jsonOutput); // For image from additional field
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
        addDataFromAdditonalFieldToJson(inputData, jsonOutput);
      }
    }

    previousDataWikiProperty = wikiprop;
  });
}

/**
 * This method is for data, which comes from "Weitere Felder",
 * because dataName of this data contains trailing digits
 * Removes trailing numbers from a given string.
 * If no trailing numbers are present, the input string is returned unchanged.
 * @param input The input string from which to remove trailing numbers.
 * @returns The input string with trailing numbers removed.
 */
function removeTrailingNumber(input: any): string {
  const strInput = typeof input === "string" ? input : input.toString(); // convert to string
  return strInput.replace(/\d+$/, ""); // Remove trailing digits
}

/**
 * Adds the title from "Namensangaben" to the JSON output.
 * @param dataAsMap Map containing the data categorized by name
 * @param jsonOutput JSON output array
 */
function addTitleToJson(dataAsMap: any, jsonOutput: any) {
  // Adding the title from "Namensangaben"
  const title = getTitle(dataAsMap.get("Namensangaben"));
  jsonOutput.push({ h1: title });
}

/**
 * Adds the category as a subtitle to the JSON output.
 * @param category Category name
 * @param jsonOutput JSON output array
 */
function addCategoryAsSubtitleToJson(category: any, jsonOutput: any) {
  jsonOutput.push({ h2: category });
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
 * Adds image from an additional field to the JSON output.
 * @param inputData Additional field data
 * @param jsonOutput JSON output array
 */
function addImageFromAdditonalFieldToJson(
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
 * Adds data from an additional field to the JSON output.
 * @param inputData Additional field data
 * @param jsonOutput JSON output array
 */
function addDataFromAdditonalFieldToJson(inputData: any, jsonOutput: any) {
  jsonOutput.push({ p: `-\t${inputData}` });
}

/**
 * Get data of offizieller name to use it as title in .md data
 * @param dataList A list from the categorie
 * @param targetDataName
 */
function getTitle(dataList: any[]): string {
  if (!dataList) {
    // Check if dataList is undefined or null
    return "Default Title"; // Return a default title or handle the case as needed
  }

  for (let i = 0; i < dataList.length; i++) {
    const data = dataList[i];
    if (data[0] === "Offizieller Name") {
      return data[1];
    }
  }
  return "Default Title"; // Return a default title if "Offizieller Name" is not found
}
