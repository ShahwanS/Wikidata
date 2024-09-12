import { propgliederung } from "./propgliederung";
import { Buffer } from "buffer";

export function getTitle(dataList: any[]): string {
  if (!dataList) {
    return "Default Title";
  }

  for (let i = 0; i < dataList.length; i++) {
    const data = dataList[i];
    if (data[0] === "Offizieller Name") {
      return data[1];
    }
  }
  return "Default Title";
}

export function checkImage(inputData: any, wikiprop: string): boolean {
  const IMAGEWIKIPROPS = ["P18", "P7417", "P9721", "P8592", "P5775", "P3311"];
  const isImageFile = inputData instanceof File;
  const wikipropExists = IMAGEWIKIPROPS.includes(wikiprop);
  return isImageFile && wikipropExists;
}

/**
 * Simple function to translate html-tags to markdown-tags
 */
export function simpleHtmlToMarkdown(html: string) {
  let markdown = html
    .replace(/<b>(.*?)<\/b>/g, "**$1**") // Bald texts
    .replace(/<i>(.*?)<\/i>/g, "_$1_") // Italic texts
    .replace(/<ul>(.*?)<\/ul>/g, (match, p1) => {
      // Unordered lists
      return p1.replace(/<li>(.*?)<\/li>/g, "- $1\n").trim();
    })
    .replace(/<ol>(.*?)<\/ol>/g, (match, p1) => {
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
 * This method returns a map, which contains all data with category and wikiproperty and dataName as key
 * @returns map (Key : DataName, Value: [Category,Wikiprop] )
 */
export function getAllCategoryAndWikiprop() {
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
 * This method is for data, which comes from "Weitere Felder",
 * because dataName of this data contains trailing digits
 * Removes trailing numbers from a given string.
 * If no trailing numbers are present, the input string is returned unchanged.
 * @param input The input string from which to remove trailing numbers.
 * @returns The input string with trailing numbers removed.
 */
export function removeTrailingNumber(input: any): string {
  const strInput = typeof input === "string" ? input : input.toString(); // convert to string
  return strInput.replace(/\d+$/, ""); // Remove trailing digits
}

/**
 * Add rich text data to the map
 * @param dataName The name of the data
 * @param inputData The data itself
 * @param resultMap The map to store the data
 */
export function setRichttextInMap(
  dataName: String,
  inputData: String,
  resultMap: any
) {
  const category = "Weitere Angaben als Freitext";
  const wikiprop = "richtext";
  const dataEntry = [dataName, inputData, wikiprop];
  // Check if the category already exists in the map and add the data accordingly else create a new category
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
export function setNormalDataInMap(
  dataName: string,
  inputData: String,
  resultMap: any,
  allCategoryAndPropertyMap: any
) {
  // Normal field processing
  const categoryAndWikiprop = getCategoryAndWikipropAsList(
    dataName,
    allCategoryAndPropertyMap
  );
  if (!categoryAndWikiprop) {
    console.error("No category and WikiProp found for:", dataName);
    return; // Handle this case appropriately
  }
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
export function getCategoryAndWikipropAsList(
  dataName: string,
  allCategoryAndPropertyMap: Map<any, any>
): [string, string] {
  return allCategoryAndPropertyMap.get(dataName);
}

// Helper function to convert File to base64
export async function serverFileToBase64(
  arrayBuffer: ArrayBuffer
): Promise<string> {
  return Buffer.from(arrayBuffer).toString("base64");
}

//helper function to format date for filename
export const formatDateForFilename = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}_${date.getHours()}}`;
};
