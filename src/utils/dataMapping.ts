import {
  getAllCategoryAndWikiprop,
  removeTrailingNumber,
  setRichttextInMap,
  setNormalDataInMap,
} from './utils';

type Sources = Record<string, string>;

/**
 * Maps data to categories based on wikiData properties and translates properties.
 * @param data - Input data object.
 * @param translatedPropgliederung - Translations for categories.
 * @param sources - Mapping of sources for the data.
 * @returns A Map with categorized data.
 */
export const dataToMap = (
  data: Record<string, any>,
  translatedPropgliederung: Record<string, any>,
  sources: Sources,
): Map<string, any[]> => {
  const resultMap = new Map<string, any[]>();
  const CATEGORY_AND_PROPERTY_MAP = getAllCategoryAndWikiprop(translatedPropgliederung);

  for (let dataName in data) {
    const inputData = data[dataName];
    dataName = removeTrailingNumber(dataName);

    if (inputData) {
      const isRichtext =
        dataName.startsWith('Rich Text') || dataName.startsWith('Enter section title');
      if (isRichtext) {
        setRichttextInMap(dataName, inputData, resultMap, sources);
      } else {
        setNormalDataInMap(dataName, inputData, sources, resultMap, CATEGORY_AND_PROPERTY_MAP);
      }
    }
  }

  return resultMap;
};
