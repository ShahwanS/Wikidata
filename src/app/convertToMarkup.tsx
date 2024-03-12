
import json2md from "json2md"
import { propgliederung } from "./propgliederung";


export const convert2Markup = (data : any) => {

   
   //const test = dataToMap(data).get("Gebäudemaße und -eigenschaften")
    dataToMap(data)
 
    console.log(json2md([
        { h1: "a"}
      , { blockquote: "A JSON to Markdown converter." }
      , { img: [
            { title: "Some image", source: "https://example.com/some-image.png" }
          , { title: "Another image", source: "https://example.com/some-image1.png" }
          , { title: "Yet another image", source: "https://example.com/some-image2.png" }
          ]
        }
      , { h2: "Features" }
      , { ol: [
            "Easy to use"
          , "You can programmatically generate Markdown content"
          , "..."
          ]
        }
      , { h2: "How to contribute" }
      , { ol: [
            "Fork the project"
          , "Create your branch"
          , "Raise a pull request"
          ]
        }
      , { h2: "Code blocks" }
      , { p: "Below you can see a code block example." }
      , { "code": {
            language: "js"
          , content: [
              "function sum (a, b) {"
            , "   return a + b"
            , "}"
            , "sum(1, 2)"
            ]
          }
        }
    ]))
}

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





