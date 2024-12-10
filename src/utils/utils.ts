import { Buffer } from 'buffer';
import { Property } from '@/types/property';
import { z } from 'zod';
import { Category } from '@/types/category';

/**
 * Extracts the title from a data list by looking for specific name fields
 * @param dataList Array of data entries to search through
 * @returns The title string found or 'Default Title' if none found
 */
export function getTitle(dataList: any[]): string {
  if (!dataList) return 'Default Title';

  const titleField = dataList.find(
    (data) => data[0] === 'Name des Gebäudes/Adresse' || data[0] === 'Name of the building/Address',
  );

  return titleField ? titleField[1] : 'Default Title';
}

/**
 * Checks if the input data is an image file with a valid wiki property
 * @param inputData Data to check
 * @param wikiprop Wiki property to validate
 * @returns Boolean indicating if input is valid image data
 */
export function checkImage(inputData: any, wikiprop: string): boolean {
  const IMAGEWIKIPROPS = ['P18', 'P7417', 'P9721', 'P8592', 'P5775', 'P3311'];
  return inputData instanceof File && IMAGEWIKIPROPS.includes(wikiprop);
}

/**
 * Converts HTML formatted text to Markdown format
 * @param html HTML string to convert
 * @returns Markdown formatted string
 */
export function simpleHtmlToMarkdown(html: string) {
  return (
    html
      // Basic text formatting
      .replace(/<b>(.*?)<\/b>/g, '**$1**')
      .replace(/<i>(.*?)<\/i>/g, '_$1_')
      .replace(/<b><i>(.*?)<\/i><\/b>/g, '**_$1_**')

      // Lists
      .replace(/<ul>(.*?)<\/ul>/g, (_, p1) => p1.replace(/<li>(.*?)<\/li>/g, '- $1\n').trim())
      .replace(/<ol>(.*?)<\/ol>/g, (_, p1) => {
        let counter = 1;
        return p1
          .replace(
            /<li>(.*?)<\/li>/g,
            (match: string) => `${counter++}. ${match.replace(/<li>(.*?)<\/li>/, '$1')}\n`,
          )
          .trim();
      })

      // Links and structure
      .replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')
      .replace(/<p>(.*?)<\/p>/g, '$1\n')
      .replace(/<br\s*\/?>/g, '\n')

      // Headers
      .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
      .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')

      // Remove underline tags (no markdown equivalent)
      .replace(/<\/?u>/g, '')
      .trim()
  );
}

/**
 * Creates a mapping between data names and their categories/wiki properties
 * @param translatedPropgliederung Structured property data
 * @returns Map with data name as key and [category, wikiprop] as value
 */
export function getAllCategoryAndWikiprop(translatedPropgliederung: any) {
  const categoryAndPropertyMap = new Map();

  translatedPropgliederung.forEach((category: { subcategories: any[]; title: any }) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.properties.forEach((property: { name: any; wikidataprop: any }) => {
        categoryAndPropertyMap.set(property.name, [category.title, property.wikidataprop]);
      });
    });
  });

  return categoryAndPropertyMap;
}

/**
 * Removes trailing numbers from a string
 * @param input Input string or value that can be converted to string
 * @returns String with trailing numbers removed
 */
export function removeTrailingNumber(input: any): string {
  return (typeof input === 'string' ? input : input.toString()).replace(/\d+$/, '');
}

/**
 * Adds rich text data to the result map under a specific category
 */
export function setRichttextInMap(
  dataName: String,
  inputData: String,
  resultMap: Map<string, any[]>,
  sources: Record<string, string>,
) {
  const category = 'Weitere Angaben als Freitext';
  const wikiprop = 'richtext';
  const dataEntry = [dataName, inputData, wikiprop, sources[wikiprop]];

  if (resultMap.has(category)) {
    resultMap.get(category)?.push(dataEntry);
  } else {
    resultMap.set(category, [dataEntry]);
  }
}

/**
 * Processes and adds normal (non-rich text) data to the result map
 */
export function setNormalDataInMap(
  dataName: string,
  inputData: String,
  sources: Record<string, string>,
  resultMap: Map<string, any[]>,
  CATEGORY_AND_PROPERTY_MAP: Map<string, [string, string]>,
) {
  // Handle copyright fields
  if (dataName.startsWith('copyright_')) {
    handleCopyrightField(dataName, inputData as string, resultMap, CATEGORY_AND_PROPERTY_MAP);
    return;
  }

  // Handle fields with units
  if (dataName.includes('unit')) {
    handleUnitField(dataName, inputData as string, resultMap, CATEGORY_AND_PROPERTY_MAP);
    return;
  }

  // Handle regular fields
  const categoryAndWikiprop = getCategoryAndWikipropAsList(dataName, CATEGORY_AND_PROPERTY_MAP);
  if (!categoryAndWikiprop) {
    console.error('No category and WikiProp found for:', dataName);
    return;
  }

  const [category, wikiprop] = categoryAndWikiprop;
  const source = sources[wikiprop];

  if (!resultMap.has(category)) {
    resultMap.set(category, []);
  }

  const categoryData = resultMap.get(category)!;
  const existingEntry = categoryData.find((entry) => entry[2] === wikiprop);

  categoryData.push([dataName, inputData, existingEntry?.[2] || wikiprop, source]);
}

/**
 * Helper function to handle fields with units
 */
function handleUnitField(
  dataName: string,
  inputData: any, // Accept any type
  resultMap: Map<string, any[]>,
  CATEGORY_AND_PROPERTY_MAP: Map<string, [string, string]>,
) {
  const originalFieldName = dataName.replace('_unit', '').replace(/\d+$/, '');
  const categoryAndWikiprop = getCategoryAndWikipropAsList(
    originalFieldName,
    CATEGORY_AND_PROPERTY_MAP,
  );

  if (!categoryAndWikiprop) {
    console.error('No category and WikiProp found for:', dataName);
    return;
  }

  const [category, wikiprop] = categoryAndWikiprop;
  if (!resultMap.has(category)) {
    resultMap.set(category, []);
  }

  // Check if inputData is a string and parse it, otherwise assume it's already an object
  const { value, selectedUnit } = typeof inputData === 'string' ? JSON.parse(inputData) : inputData;

  // Find existing entry or create new one
  const categoryData = resultMap.get(category)!;
  const existingEntryIndex = categoryData.findIndex((entry) => entry[0] === originalFieldName);
  if (existingEntryIndex !== -1) {
    categoryData[existingEntryIndex][1] = value;
    categoryData[existingEntryIndex][3] = selectedUnit;
  } else {
    categoryData.push([originalFieldName, value, wikiprop, '', selectedUnit]);
  }
}
/**
 * Helper function to handle copyright fields
 */
function handleCopyrightField(
  dataName: string,
  inputData: string,
  resultMap: Map<string, any[]>,
  CATEGORY_AND_PROPERTY_MAP: Map<string, [string, string]>,
) {
  const originalFieldName = dataName.replace('copyright_', '').replace(/\d+$/, '');
  const categoryAndWikiprop = getCategoryAndWikipropAsList(
    originalFieldName,
    CATEGORY_AND_PROPERTY_MAP,
  );

  if (!categoryAndWikiprop) return;

  const [category] = categoryAndWikiprop;
  if (!resultMap.has(category)) return;

  const categoryData = resultMap.get(category)!;
  const imageEntry = categoryData.find((entry) => entry[0] === originalFieldName);

  if (imageEntry) {
    const { text, license } = JSON.parse(inputData);
    imageEntry[4] = `${text} ${license}`;
  }
}

/**
 * Retrieves category and wiki property for a given data name
 */
export function getCategoryAndWikipropAsList(
  dataName: string,
  allCategoryAndPropertyMap: Map<any, any>,
): [string, string] {
  return allCategoryAndPropertyMap.get(dataName);
}

/**
 * Converts an ArrayBuffer to base64 string
 */
export async function serverFileToBase64(arrayBuffer: ArrayBuffer): Promise<string> {
  return Buffer.from(arrayBuffer).toString('base64');
}

/**
 * Generates a timestamp-based filename
 */
export const formatDateForFilename = (): string => {
  const date = new Date();
  return `${date.getUTCFullYear()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCDate()}_${date.getUTCHours()}-${date.getUTCMinutes()}-${date.getUTCSeconds()}`;
};

/**
 * Formats rich text content with optional title
 */
export const formatRichTextContent = (
  fieldName: string,
  richTextTitle: Record<string, string>,
  richTextState: Record<string, string>,
): string => {
  const title = richTextTitle[fieldName] ? `# ${richTextTitle[fieldName]}\n` : '';
  return title + richTextState[fieldName];
};

/**
 * Groups fields by their category for organization
 */
export function groupFieldsByCategory(
  fields: Property[],
  tInitial: (key: string) => string,
): Record<string, Property[]> {
  return fields.reduce<Record<string, Property[]>>((acc, field) => {
    const category = field.category || tInitial('form.mainCategory');
    if (!acc[category]) acc[category] = [];
    acc[category].push(field);
    return acc;
  }, {});
}

/**
 * Generates a Zod validation schema based on form data
 */
export function generateFormSchema(
  formData: Record<string, any>,
  tErrors: (key: string) => string,
) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  for (const [key, value] of Object.entries(formData)) {
    const fieldName = removeTrailingNumber(key);
    schemaFields[key] = generateFieldSchema(value, fieldName, tErrors);
  }

  return z.object(schemaFields).strict();
}

/**
 * Helper function to generate schema for individual fields
 */
function generateFieldSchema(
  value: any,
  fieldName: string,
  tErrors: (key: string) => string,
): z.ZodTypeAny {
  if (typeof value === 'number') {
    return z
      .number()
      .int(fieldName + ': ' + tErrors('mustBeInteger'))
      .min(1, fieldName + ': ' + tErrors('min'))
      .max(1000000, fieldName + ': ' + tErrors('max'));
  }

  if (typeof value === 'string') {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return generateUrlSchema(fieldName, tErrors);
    }
    return generateStringSchema(fieldName, tErrors);
  }

  if (typeof value === 'boolean') {
    return z.boolean();
  }

  return z.unknown();
}

/**
 * Helper function to generate URL validation schema
 */
function generateUrlSchema(fieldName: string, tErrors: (key: string) => string) {
  return z
    .string()
    .url(fieldName + ': ' + tErrors('invalidURL'))
    .max(2000, fieldName + ': ' + tErrors('maxLength'))
    .refine(
      (url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      fieldName + ': ' + tErrors('invalidURL'),
    );
}

/**
 * Helper function to generate string validation schema
 */
function generateStringSchema(fieldName: string, tErrors: (key: string) => string) {
  return z
    .string()
    .min(1, fieldName + ': ' + tErrors('required'))
    .max(1000, fieldName + ': ' + tErrors('maxLength'))
    .refine((text) => !/^\s*$/.test(text), fieldName + ': ' + tErrors('emptyField'));
}
