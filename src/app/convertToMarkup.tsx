import json2md from "json2md";
import { propgliederung } from "./propgliederung";
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
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, "[$2]($1)") // Links
    .replace(/<p>(.*?)<\/p>/g, "$1\n") // Convert paragraphs to text followed by a newline
    .replace(/<br\s*\/?>/g, "\n") // Convert <br> tags to newlines
    .replace(/<b><i>(.*?)<\/i><\/b>/g, "**_$1_**")
  return markdown.trim(); // Trim the final string to remove any leading/trailing whitespace
}

/**
 * Simple method to convert data from website to markdown-content
 * @param data
 * @returns makdown-data
 */
export const convert2Markup = (data: any) => {
  //console.log("Sended Data : " + data)
  const dataAsMap = dataToMap(data); // First mapping properties to categories
  const dataAsJson = convertDataToJson(dataAsMap); // Then maped data to json
  const dataAsMd = json2md(dataAsJson); // Finally json to markdown
  return dataAsMd;
};

/**
 * Convert data to JSON
 * @param dataAsMap (map with category and data)
 * @return JSON (array of objects)
 */
const convertDataToJson = (dataAsMap: Map<any, any>) => {
  const jsonOutput = [];

  // Adding the title from "Namensangaben"
  const title = getTitle(dataAsMap.get("Namensangaben"));
  jsonOutput.push({ h1: title });

  dataAsMap.forEach((dataList, category) => {
    let hasValidData = false; // Flag to check if the category has valid data

    // Preprocess data list to filter out invalid data (e.g., empty images)
    const processedDataList = dataList.filter(
      ([dataName, inputData, wikiprop]: [string, any, string]) => {
        if (wikiprop === "P18" || wikiprop === "P7417") {
          return inputData instanceof File ? inputData.name : inputData;
        }
        return true; // Keep all non-image data by default
      }
    );

    // Check if processedDataList has valid data
    hasValidData = processedDataList.length > 0;

    if (hasValidData) {
      jsonOutput.push({ h2: category }); // Add the category if it has valid data

      processedDataList.forEach(
        ([dataName, inputData, wikiprop]: [string, any, string]) => {
          //console.log("Data Length : " + inputData)
          if (isImage(inputData,wikiprop)) { // Check if data is image
            const hasImage = inputData.name !== ""
            if(hasImage){
                const imagePath = `./images/${inputData.name}`;
                jsonOutput.push({
                  p: `### ${wikiprop}\t${dataName}\n![Image](${imagePath})`,
                });
            }
            else{ 
              // There aren't ontput if inputData is empty
            }
          } else if (wikiprop === "P856") {
            jsonOutput.push({
              p: `### ${wikiprop}\t${dataName}\n[Link](${inputData})`,
            });
          } else if (wikiprop === "richtext") {
            const markdown = simpleHtmlToMarkdown(inputData);
            //jsonOutput.push({ p: `### ${wikiprop}\t${dataName}\n${markdown}` });
            jsonOutput.push({ p: `### ${'FreiText'}\t${dataName}\n${markdown}` });
            console.log(inputData.name)
          } else {
            jsonOutput.push({
              p: `### ${wikiprop}\t${dataName}\n${inputData}`,
            });
          }
        }
      );
    }
  });

  return jsonOutput;
};

/**
 * Special Method to combine wikiData-props with corresponding categories
 * @param data
 * @returns properties mapped to categories
 */
const dataToMap = (data: any) => {
  const resultMap = new Map();
  const CATEGORYANDPROPERTYMAP = allCategoryAndWikiprop();
  for (let dataName in data) {
    const inputData = data[dataName]; // Get name from page.tsx/fieldsdata
    dataName = removeTrailingNumber(dataName) // Remove trailing number of dataName(spitzName1 -> spitzName)
    const containsData = inputData !== ""; // this property contains data
    if (containsData) {
      // Handle rich text fields differently
      if (
        dataName.startsWith("Rich Text") ||
        dataName.startsWith("Abschnittstitel eingeben")
      ) {
        const category = "Abschnitte";
        const wikiprop = "richtext";
        const dataEntry = [dataName, inputData, wikiprop];

        if (resultMap.has(category)) {
          resultMap.get(category).push(dataEntry);
        } else {
          resultMap.set(category, [dataEntry]);
        }
      } else {
        // Normal field processing
        const categoryAndWikiprop = CATEGORYANDPROPERTYMAP.get(dataName );
        if (categoryAndWikiprop) {
          const category = categoryAndWikiprop[0];
          const wikiprop = categoryAndWikiprop[1];
          const categoryExistsInMap = resultMap.has(category);
          if (categoryExistsInMap) {
            resultMap.get(category).push([dataName , inputData, wikiprop]);
          } else {
            resultMap.set(category, [[dataName , inputData, wikiprop]]);
          }
        }
      }
    }
  }
  return resultMap;
};

/**
 * This method returns a map, which contains all data with category and wikiproperty and dataName as key
 * @returns map (Key : DataName, Value: [Category,Wikiprop] )
 */
function allCategoryAndWikiprop() {
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
 *
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

/**
 * check, whether inputData is image
 * @param inputData any
 * @param wikiprop Wikipediaproperty
 * @returns boolen
 */
function isImage(inputData: any, wikiprop: String ): boolean {
  const IMAGEWIKIPROPS = ["P18","P7417","P9721","P8592","P5775","P3311"];
  const isImageFile = inputData instanceof File;
  const wikipropExists = IMAGEWIKIPROPS.includes(wikiprop);
  return isImageFile && wikipropExists;
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
  const strInput = typeof input === 'string' ? input : input.toString();  // convert to string
  return strInput.replace(/\d+$/, '');   // Remove trailing digits
}
