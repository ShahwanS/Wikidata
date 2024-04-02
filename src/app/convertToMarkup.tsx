import json2md from "json2md";
import { propgliederung } from "./propgliederung";

function simpleHtmlToMarkdown(html: string) {
  let markdown = html
    .replace(/<b>(.*?)<\/b>/g, "**$1**")
    .replace(/<i>(.*?)<\/i>/g, "_$1_")
    .replace(/<ul>(.*?)<\/ul>/gs, (match, p1) => {
      return p1.replace(/<li>(.*?)<\/li>/g, "- $1").trim();
    })
    .replace(/<ol>(.*?)<\/ol>/gs, (match, p1) => {
      let counter = 1;
      return p1.replace(/<li>(.*?)<\/li>/g, () => `${counter++}. $1`).trim();
    })
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, "[$2]($1)")
    .replace(/<p>(.*?)<\/p>/g, "$1\n") // Convert paragraphs to text followed by a newline
    .replace(/<br\s*\/?>/g, "\n"); // Convert <br> tags to newlines
  return markdown.trim(); // Trim the final string to remove any leading/trailing whitespace
}

export const convert2Markup = (data: any) => {
  const dataAsMap = dataToMap(data);
  const dataAsJson = convertDataToJson(dataAsMap);
  const dataAsMd = json2md(dataAsJson);
  return dataAsMd;
};

/**
 * Convert data to JSON
 * @param dataAsMap (map with category and data)
 * @return JSON (array of objects)
 */
const convertDataToJson = (dataAsMap: Map<any, any>) => {
  const jsonOutput = [];

  // Pick up officail name as title
  const title = getTitle(dataAsMap.get("Namensangaben"));
  jsonOutput.push({ h1: title });
  dataAsMap.forEach((dataList, category) => {
    // print category as subtitle (as ##category)
    jsonOutput.push({ h2: category });
    // Iterate over data list
    dataList.forEach(
      ([dataName, inputData, wikiprop]: [string, string, string]) => {
        // Handle different types of data
        if (wikiprop === "P18") {
          // Image data
          jsonOutput.push({
            img: [{ title: "Image", source: inputData }],
          });
        } else if (wikiprop === "P856") {
          // URL data
          jsonOutput.push({
            p: `[Link Text](${inputData})`,
          });
        } else if (wikiprop === "richtext") {
          const markdown = simpleHtmlToMarkdown(inputData);
          if (dataName === "Abschnittstitel") {
            jsonOutput.push({
              h1: [`${dataName}: ${markdown}`, `wikiProperty : ${wikiprop}`],
            });
          }
          jsonOutput.push({
            p: [`${dataName}: ${markdown}`, `wikiProperty : ${wikiprop}`],
          });
        } else {
          jsonOutput.push({
            ol: [`${dataName}: ${inputData}`, `wikiProperty : ${wikiprop}`],
          });
        }
      }
    );
  });

  //console.log(jsonOutput)

  return jsonOutput;
};

const dataToMap = (data: any) => {
  const resultMap = new Map();
  const CATEGORYANDPROPERTYMAP = allCategoryAndWikiprop();
  for (const dataName in data) {
    const inputData = data[dataName]; // Get name from page.tsx/fieldsdata
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
        const categoryAndWikiprop = CATEGORYANDPROPERTYMAP.get(dataName);
        if (categoryAndWikiprop) {
          const category = categoryAndWikiprop[0];
          const wikiprop = categoryAndWikiprop[1];
          const categoryExistsInMap = resultMap.has(category);
          if (categoryExistsInMap) {
            resultMap.get(category).push([dataName, inputData, wikiprop]);
          } else {
            resultMap.set(category, [[dataName, inputData, wikiprop]]);
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
