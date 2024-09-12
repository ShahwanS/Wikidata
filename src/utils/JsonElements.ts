"use client";

import {
  getTitle,
  checkImage,
  simpleHtmlToMarkdown,
  formatDateForFilename,
} from "./utils";
import { getPropertyByName } from "./propgliederung";
import { uploadImage } from "@/app/actions";
import { json } from "stream/consumers";

/**
 * Adds the title from "Namensangaben" to the JSON output.
 * @param dataAsMap Map containing the data categorized by name
 * @param jsonOutput JSON output array
 */
export function addTitleToJson(title: string, jsonOutput: any) {
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
 * @param title Title used for file naming
 */
export async function addDataFromCategoryToJson(
  dataList: any,
  jsonOutput: any,
  title: string
) {
  let previousDataWikiProperty = "";

  for (const [dataName, inputData, wikiprop] of dataList) {
    const isNotFromAdditionalField = previousDataWikiProperty !== wikiprop;
    const isUrl = wikiprop === "P856";
    const isRichtext = wikiprop === "richtext";
    const isImage = checkImage(inputData, wikiprop);

    if (isImage) {
      //if inputData is not an instance of File return
      if (inputData.size == 0) {
        console.warn(`No image data provided for ${dataName}. Skipping.`);
        continue;
      }
      // Always await async function to handle images correctly
      if (isNotFromAdditionalField) {
        uploadImageAndAddToJson(
          inputData,
          dataName,
          jsonOutput,
          title,
          wikiprop
        );
      } else {
        uploadImageAndAddToJson(inputData, dataName, jsonOutput, title);
      }
    } else if (isUrl) {
      addUrlToJson(wikiprop, dataName, inputData, jsonOutput);
    } else if (isRichtext) {
      addRichTextToJson(wikiprop, dataName, inputData, jsonOutput);
    } else if (isNotFromAdditionalField) {
      addNormalDataToJson(wikiprop, dataName, inputData, jsonOutput);
    } else {
      addDataFromAdditionalFieldToJson(inputData, jsonOutput);
    }

    previousDataWikiProperty = wikiprop;
  }
}

/**
 * Helper function to upload image and add its data to JSON output.
 * @param inputData Image data
 * @param dataName Name of the data
 * @param jsonOutput JSON output array
 * @param title Title used for file naming
 * @param wikiprop Wiki property associated with the data (optional)
 * @param isShowedWikiProps Boolean indicating if wiki properties should be shown (optional)
 * @returns {Promise<void>}
 */
async function uploadImageAndAddToJson(
  inputData: any,
  dataName: string,
  jsonOutput: any,
  title: string,
  wikiprop?: string,
  isShowedWikiProps?: boolean
): Promise<void> {
  if (!inputData || !title) {
    console.warn(
      `Input data or title is missing for ${dataName}. Skipping image upload.`
    );
    return;
  }

  const fileExtension = inputData.name.split(".").pop() || "jpg";
  const formattedFileName = `${
    inputData.name
  }_${formatDateForFilename()}.${fileExtension}`;
  const rawFilePath =
    `https://gitlab.uni-marburg.de/shahwan/project-wissensraeume-demo/-/raw/main/${title}/images/${formattedFileName}`.replace(
      / /g,
      "%20"
    );

  let newEntry;
  if (wikiprop !== undefined) {
    newEntry = {
      p: isShowedWikiProps
        ? `### ${wikiprop}\t${dataName}\n![${dataName}](${rawFilePath})`
        : `### ${dataName}\n![${dataName}](${rawFilePath})`,
    };
  } else {
    newEntry = {
      p: `### ${dataName}\n![${dataName}](${rawFilePath})`,
    };
  }

  // Optimistically push to jsonOutput
  console.log("Optimistically pushing new entry to jsonOutput:");
  jsonOutput.push(newEntry);
  const entryIndex = jsonOutput.length - 1; // Store the index of the new entry

  const formData = new FormData();
  formData.append("fileName", title);
  formData.append("fileContent", inputData);

  try {
    // Attempt to upload image with retries
    const success = await uploadImage(formData);
    if (!success) {
      console.warn(
        `Failed to upload image for ${dataName}. Reverting jsonOutput.`
      );
      jsonOutput.splice(entryIndex, 1); // Remove the specific entry on error
      console.log("popped entry from jsonOutput:", newEntry);
    }
  } catch (error: any) {
    console.error(
      `Error in uploadImageAndAddToJson for ${dataName}:`,
      error instanceof Error ? error.message : String(error)
    );
    jsonOutput.splice(entryIndex, 1); // Remove the specific entry on error
    console.log("popped entry from jsonOutput:", newEntry);
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
  jsonOutput: any
) {
  wikiprop
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
  jsonOutput: any
) {
  wikiprop
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
