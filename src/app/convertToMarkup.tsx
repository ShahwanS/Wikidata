
import json2md from "json2md"
import { propgliederung } from "./propgliederung";


export const convert2Markup = (data : any) => {

    const dataAsMap = dataToMap(data)
    const dataAsJson = convertDataToJson(dataAsMap)
    const dataAsMd = json2md(dataAsJson)
    console.log(dataAsMd)
 
}



const convertDataToJson = (dataAsMap) => {
    const jsonOutput = [];

    // Pick up officail name as title 
    const TITLE = (getTitle(dataAsMap.get("Namensangaben")))
    jsonOutput.push({h1: TITLE})
    dataAsMap.forEach((dataList, category) => {

      // print category as subtitle (as ##category)
      jsonOutput.push({ h2: category });

      // Iterate over data list
      dataList.forEach(([dataName, inputData, wikiprop]) => {

        
          // Handle different types of data
          if (wikiprop === "P18") {
              // Image data
              jsonOutput.push({
                  img: [
                      { title: "Image", source: inputData }
                  ]
              });
          } else if (wikiprop === "P856") {
              // URL data
              jsonOutput.push({
                  p: `[Link Text](${inputData})`
              });
          } else {
              jsonOutput.push({
              ol : [
              `${dataName}: ${inputData}`,
                `wikiProperty : ${wikiprop}`
              ]
              })
          }
          
      });
        
    });

    //console.log(jsonOutput)
    

    return jsonOutput;
};



/**
 * convert data to map
 * @param data (fieldsData from page.tsx/fieldsdata)
 * @return map (key : category , Value : [dataName , inputdata, wikiproperty])
 * For example    { Key : "Gebäudemaße und -eigenschaften" ,  : [ ["Höhe (Dimensionen)" , "12" , "P2048"] , [] , ..  ] }
 *                              Category                               DataName          input   Wikiproperty
 */
const dataToMap = (data: any) => {
    const resultMap = new Map();
    const CATEGORYANDPROPERTYMAP = allCategoryAndWikiprop();
    for (const dataName in data) {
        const inputData = data[dataName]; // Get name from page.tsx/fieldsdata
        const containsData = (inputData !== ""); // this property contains data 
        if (containsData) {
            const categoryAndWikiprop = CATEGORYANDPROPERTYMAP.get(dataName);
            const category = categoryAndWikiprop[0]
            const wikiprop = categoryAndWikiprop[1]
            const categoryExistsInMap = resultMap.has(category)
            if(categoryExistsInMap){
                resultMap.get(category).push([dataName,inputData,wikiprop])
            } 
            else{
                resultMap.set(category,[[dataName,inputData,wikiprop]]);
            }
        }
    }
    console.log (resultMap)
    return resultMap;
}


/**
 * This method returns a map, which contains all data with category and wikiproperty and dataName as key
 * @returns map (Key : DataName, Value: [Category,Wikiprop] )
 */
function allCategoryAndWikiprop() {
    const CATEGORYANDPROPERTYMAP = new Map();
    propgliederung.forEach(category => {
        category.subcategories.forEach(subcategory => {
            subcategory.properties.forEach(property => {
                const key = property.name;
                const value = [category.title,property.wikidataprop];
                CATEGORYANDPROPERTYMAP.set(key, value);
            });
        });
    });
    console.log(CATEGORYANDPROPERTYMAP);
    return CATEGORYANDPROPERTYMAP;
}

/**
 * 
 * @param dataList A list from the categorie
 * @param targetDataName 
 */
function getTitle(dataList: any[]) {
  for (let i = 0; i < dataList.length; i++) {
    const data = dataList[i];
    if (data[0] === 'Offizieller Name') {
      return data[1];
    }
  }
}





