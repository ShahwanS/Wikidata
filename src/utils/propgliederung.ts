import { z } from "zod";
import { useTranslations } from "next-intl";

/** Defines the structure of a property */
export type Property = {
  name: string;
  type: string; // e.g., "string", "number", "boolean", "file", "url"
  description?: string;
  placeholder?: string; // Hint for filling out the field
  unique?: boolean; // true if only one value is allowed (e.g., number of elevators)
  maxvalues?: number; // Maximum number of values allowed
  required?: boolean; // true if the property must be filled out
  value?: string[]; // Pre-filled value(s)
  wikidataprop?: string; // Associated Wikidata property ID, if exists
  choices?: string[]; // List of predefined values
  category?: string; // Category of the Property
  unit?: string; // Unit of measurement
};

/** Structure for a category */
export type Category = {
  title: string;
  description: string;
  subcategories: SubCategory[];
};

/** Structure for a subcategory */
export type SubCategory = {
  name: string;
  description: string;
  properties: Property[];
};

/**  Defines index signature to get properties by giving the name of a category and subcategory*/
export type Properties = {
  [category: string]: {
    [subCategory: string]: {
      name: string;
      properties: string[];
      description: string;
    };
  };
};

/** Porperties-Gliederung
 *  (orientiert sich an der Pdf-Datei)
 */
/** Main function that defines the structure of categories and properties with i18n */
export const propgliederung = (t: (key: string) => string): Category[] => [
  {
    title: t("building.title"),
    description: t("building.description"),
    subcategories: [
      {
        name: t("building.dimensions.title"),
        description: t("building.dimensions.description"),
        properties: [
          {
            name: t("building.dimensions.height.label"),
            type: "number",
            wikidataprop: "P2048",
            unique: true,
            unit: "Meter",
            placeholder: t("building.dimensions.height.placeholder"),
          },
          {
            name: t("building.dimensions.length.label"),
            type: "number",
            wikidataprop: "P2043",
            unique: true,
            unit: "Meter",
            placeholder: t("building.dimensions.length.placeholder"),
          },
          {
            name: t("building.dimensions.width.label"),
            type: "number",
            wikidataprop: "P2049",
            unique: true,
            unit: "Meter",
            placeholder: t("building.dimensions.width.placeholder"),
          },
        ],
      },
      {
        name: t("building.areas.title"),
        description: t("building.areas.description"),
        properties: [
          {
            name: t("building.areas.groundArea.label"),
            type: "number",
            wikidataprop: "P2046",
            unique: true,
            unit: "Quadratmeter",
            placeholder: t("building.areas.groundArea.placeholder"),
          },
        ],
      },
      {
        name: t("building.floors.title"),
        description: t("building.floors.description"),
        properties: [
          {
            name: t("building.floors.aboveGround.label"),
            type: "number",
            wikidataprop: "P1101",
            unique: true,
            placeholder: t("building.floors.aboveGround.placeholder"),
          },
          {
            name: t("building.floors.belowGround.label"),
            type: "number",
            wikidataprop: "P1139",
            unique: true,
            placeholder: t("building.floors.belowGround.placeholder"),
          },
          {
            name: t("building.floors.elevators.label"),
            type: "number",
            wikidataprop: "P1301",
            unique: true,
            placeholder: t("building.floors.elevators.placeholder"),
          },
        ],
      },
      {
        name: t("building.rooms.title"),
        description: t("building.rooms.description"),
        properties: [
          {
            name: t("building.rooms.roomCount.label"),
            type: "number",
            wikidataprop: "P8733",
            unique: true,
            placeholder: t("building.rooms.roomCount.placeholder"),
          },
          {
            name: t("building.rooms.partOf.label"),
            type: "text",
            wikidataprop: "P361",
            placeholder: t("building.rooms.partOf.placeholder"),
          },
          {
            name: t("building.rooms.contains.label"),
            type: "text",
            wikidataprop: "P527",
            placeholder: t("building.rooms.contains.placeholder"),
          },
        ],
      },
      {
        name: t("building.accessibility.title"),
        description: t("building.accessibility.description"),
        properties: [
          {
            name: t("building.accessibility.wheelchairAccessible.label"),
            type: "radio",
            wikidataprop: "P2846",
            choices: [
              t(
                "building.accessibility.wheelchairAccessible.choices.veryAccessible"
              ),
              t(
                "building.accessibility.wheelchairAccessible.choices.partiallyAccessible"
              ),
              t(
                "building.accessibility.wheelchairAccessible.choices.notAccessible"
              ),
            ],
            unique: true,
            placeholder: t(
              "building.accessibility.wheelchairAccessible.placeholder"
            ),
          },
        ],
      },
    ],
  },
  {
    title: t("nameDetails.title"),
    description: t("nameDetails.description"),
    subcategories: [
      {
        name: t("nameDetails.title"),
        description: t("nameDetails.description"),
        properties: [
          {
            name: t("nameDetails.officialName.label"),
            type: "text",
            wikidataprop: "P1448",
            unique: true,
            placeholder: t("nameDetails.officialName.placeholder"),
            required: true,
          },
          {
            name: t("nameDetails.shortName.label"),
            type: "text",
            wikidataprop: "P1813",
            placeholder: t("nameDetails.shortName.placeholder"),
          },
          {
            name: t("nameDetails.nickname.label"),
            type: "text",
            wikidataprop: "P1449",
            placeholder: t("nameDetails.nickname.placeholder"),
          },
          {
            name: t("nameDetails.namesake.label"),
            type: "text",
            wikidataprop: "P138",
            placeholder: t("nameDetails.namesake.placeholder"),
          },
        ],
      },
    ],
  },
  {
    title: t("architectureDetails.title"),
    description: t("architectureDetails.description"),
    subcategories: [
      {
        name: t("architectureDetails.title"),
        description: t("architectureDetails.description"),
        properties: [
          {
            name: t("architectureDetails.style.label"),
            type: "text",
            wikidataprop: "P149",
            placeholder: t("architectureDetails.style.placeholder"),
          },
          {
            name: t("architectureDetails.inspiredBy.label"),
            type: "text",
            wikidataprop: "P941",
            placeholder: t("architectureDetails.inspiredBy.placeholder"),
          },
          {
            name: t("architectureDetails.architect.label"),
            type: "text",
            wikidataprop: "P84",
            placeholder: t("architectureDetails.architect.placeholder"),
          },
        ],
      },
    ],
  },
  {
    title: t("constructionDetails.title"),
    description: t("constructionDetails.description"),
    subcategories: [
      {
        name: t("constructionDetails.title"),
        description: t("constructionDetails.description"),
        properties: [
          {
            name: t("constructionDetails.materials.label"),
            type: "text",
            wikidataprop: "P186",
            placeholder: t("constructionDetails.materials.placeholder"),
          },
          {
            name: t("constructionDetails.method.label"),
            type: "text",
            wikidataprop: "P2079",
            placeholder: t("constructionDetails.method.placeholder"),
          },
          {
            name: t("constructionDetails.company.label"),
            type: "text",
            wikidataprop: "P193",
            placeholder: t("constructionDetails.company.placeholder"),
          },
          {
            name: t("constructionDetails.developer.label"),
            type: "text",
            wikidataprop: "P6237",
            placeholder: t("constructionDetails.developer.placeholder"),
          },
          {
            name: t("constructionDetails.engineer.label"),
            type: "text",
            wikidataprop: "P631",
            placeholder: t("constructionDetails.engineer.placeholder"),
          },
          {
            name: t("constructionDetails.cost.label"),
            type: "number",
            description: t("constructionDetails.cost.description"),
            wikidataprop: "P2130",
            unique: true,
            unit: "EUR",
            placeholder: t("constructionDetails.cost.placeholder"),
          },
        ],
      },
    ],
  },
  {
    title: t("geographicDetails.title"),
    description: t("geographicDetails.description"),
    subcategories: [
      {
        name: t("geographicDetails.location.title"),
        description: t("geographicDetails.location.description"),
        properties: [
          {
            name: t("geographicDetails.location.adjacentBuildings.label"),
            type: "text",
            wikidataprop: "P3032",
            placeholder: t(
              "geographicDetails.location.adjacentBuildings.placeholder"
            ),
          },
          {
            name: t("geographicDetails.location.connectedTo.label"),
            type: "text",
            wikidataprop: "P2789",
            placeholder: t(
              "geographicDetails.location.connectedTo.placeholder"
            ),
          },
          {
            name: t("geographicDetails.location.coordinates.label"),
            type: "text",
            wikidataprop: "P625",
            unique: true,
            placeholder: t(
              "geographicDetails.location.coordinates.placeholder"
            ),
          },
          {
            name: t("geographicDetails.location.timezone.label"),
            type: "text",
            value: [t("geographicDetails.location.timezone.value")],
            wikidataprop: "P6237",
            unique: true,
            placeholder: t("geographicDetails.location.timezone.placeholder"),
          },
          {
            name: t("geographicDetails.location.country.label"),
            type: "text",
            value: [t("geographicDetails.location.country.value")],
            wikidataprop: "P17",
            unique: true,
            placeholder: t("geographicDetails.location.country.placeholder"),
          },
          {
            name: t("geographicDetails.location.orientation.label"),
            type: "text",
            wikidataprop: "P7787",
            unique: true,
            placeholder: t(
              "geographicDetails.location.orientation.placeholder"
            ),
          },
        ],
      },
      {
        name: t("geographicDetails.address.label"),
        description: t("geographicDetails.address.description"),
        properties: [
          {
            name: t("geographicDetails.address.street.label"),
            type: "text",
            wikidataprop: "P669",
            unique: true,
            placeholder: t("geographicDetails.address.street.placeholder"),
          },
          {
            name: t("geographicDetails.address.fullAddress.label"),
            type: "text",
            wikidataprop: "P6375",
            unique: true,
            placeholder: t("geographicDetails.address.fullAddress.placeholder"),
          },
          {
            name: t("geographicDetails.address.postalCode.label"),
            type: "text",
            wikidataprop: "P281",
            unique: true,
            placeholder: t("geographicDetails.address.postalCode.placeholder"),
          },
        ],
      },
    ],
  },
  {
    title: t("historicalData.title"),
    description: t("historicalData.description"),
    subcategories: [
      {
        name: t("historicalData.title"),
        description: t("historicalData.description"),
        properties: [
          {
            name: t("historicalData.yearBuilt.label"),
            type: "text",
            wikidataprop: "P571",
            unique: true,
            placeholder: t("historicalData.yearBuilt.placeholder"),
          },
          {
            name: t("historicalData.openingDate.label"),
            type: "text",
            wikidataprop: "P1619",
            unique: true,
            placeholder: t("historicalData.openingDate.placeholder"),
          },
          {
            name: t("historicalData.closingDate.label"),
            type: "text",
            wikidataprop: "P3999",
            unique: true,
            placeholder: t("historicalData.closingDate.placeholder"),
          },
          {
            name: t("historicalData.demolitionDate.label"),
            type: "text",
            wikidataprop: "P576",
            unique: true,
            placeholder: t("historicalData.demolitionDate.placeholder"),
          },
          {
            name: t("historicalData.keyEvent.label"),
            type: "text",
            wikidataprop: "P793",
            placeholder: t("historicalData.keyEvent.placeholder"),
          },
          {
            name: t("historicalData.keyPerson.label"),
            type: "text",
            wikidataprop: "P3342",
            placeholder: t("historicalData.keyPerson.placeholder"),
          },
          {
            name: t("historicalData.contractor.label"),
            type: "text",
            wikidataprop: "P88",
            placeholder: t("historicalData.contractor.placeholder"),
          },
          {
            name: t("historicalData.founder.label"),
            type: "text",
            wikidataprop: "P112",
            placeholder: t("historicalData.founder.placeholder"),
          },
          {
            name: t("historicalData.predecessor.label"),
            type: "text",
            wikidataprop: "P1398",
            placeholder: t("historicalData.predecessor.placeholder"),
          },
          {
            name: t("historicalData.successor.label"),
            type: "text",
            wikidataprop: "P167",
            placeholder: t("historicalData.successor.placeholder"),
          },
        ],
      },
    ],
  },
  {
    title: t("usage.title"),
    description: t("usage.description"),
    subcategories: [
      {
        name: t("usage.state.label"),
        description: t("usage.description"),
        properties: [
          {
            name: t("usage.state.label"),
            type: "text",
            wikidataprop: "P5817",
            unique: true,
            placeholder: t("usage.state.placeholder"),
          },
          {
            name: t("usage.condition.label"),
            type: "text",
            wikidataprop: "P5816",
            unique: true,
            placeholder: t("usage.condition.placeholder"),
          },
          {
            name: t("usage.user.label"),
            type: "text",
            wikidataprop: "P466",
            placeholder: t("usage.user.placeholder"),
          },
          {
            name: t("usage.purpose.label"),
            type: "text",
            wikidataprop: "P366",
            placeholder: t("usage.purpose.placeholder"),
          },
          {
            name: t("usage.operator.label"),
            type: "text",
            wikidataprop: "P137",
            placeholder: t("usage.operator.placeholder"),
          },
          {
            name: t("usage.maintainedBy.label"),
            type: "text",
            wikidataprop: "P126",
            placeholder: t("usage.maintainedBy.placeholder"),
          },
          {
            name: t("usage.owner.label"),
            type: "text",
            wikidataprop: "P127",
            placeholder: t("usage.owner.placeholder"),
          },
          {
            name: t("usage.denomination.label"),
            type: "text",
            wikidataprop: "P140",
            placeholder: t("usage.denomination.placeholder"),
          },
        ],
      },
    ],
  },
  {
    title: t("classification.title"),
    description: t("classification.description"),
    subcategories: [
      {
        name: t("classification.title"),
        description: t("classification.description"),
        properties: [
          {
            name: t("classification.instanceOf.label"),
            value: [t("classification.instanceOf.value")],
            type: "text",
            wikidataprop: "P31",
            placeholder: t("classification.instanceOf.placeholder"),
          },
          {
            name: t("classification.commonsCategory.label"),
            type: "text",
            wikidataprop: "P373",
            placeholder: t("classification.commonsCategory.placeholder"),
          },
          {
            name: t("classification.protectionCategory.label"),
            type: "text",
            wikidataprop: "P1435",
            placeholder: t("classification.protectionCategory.placeholder"),
          },
          {
            name: t("classification.monumentList.label"),
            type: "text",
            wikidataprop: "P2817",
            placeholder: t("classification.monumentList.placeholder"),
          },
        ],
      },
    ],
  },
  {
    title: t("links.title"),
    description: t("links.description"),
    subcategories: [
      {
        name: t("links.title"),
        description: t("links.description"),
        properties: [
          {
            name: t("links.website.label"),
            type: "url",
            wikidataprop: "P856",
            placeholder: t("links.website.placeholder"),
          },
        ],
      },
    ],
  },
  {
    title: t("media.title"),
    description: t("media.description"),
    subcategories: [
      {
        name: t("media.title"),
        description: t("media.description"),
        properties: [
          {
            name: t("media.image.label"),
            type: "file",
            wikidataprop: "P18",
            placeholder: t("media.image.placeholder"),
          },
          {
            name: t("media.backImage.label"),
            type: "file",
            wikidataprop: "P7417",
            placeholder: t("media.backImage.placeholder"),
          },
          {
            name: t("media.entranceImage.label"),
            type: "file",
            wikidataprop: "P9721",
            placeholder: t("media.entranceImage.placeholder"),
          },
          {
            name: t("media.aerialView.label"),
            type: "file",
            wikidataprop: "P8592",
            placeholder: t("media.aerialView.placeholder"),
          },
          {
            name: t("media.interiorView.label"),
            type: "file",
            wikidataprop: "P5775",
            placeholder: t("media.interiorView.placeholder"),
          },
          {
            name: t("media.floorPlan.label"),
            type: "file",
            wikidataprop: "P3311",
            placeholder: t("media.floorPlan.placeholder"),
          },
        ],
      },
    ],
  },
];

//   // Initialize the necessary objects
// export const categories: Record<string, Category> = {};
// export const properties: Properties = {};
// export const propertyInputTypes: Record<string, string> = {};
// export const categoryNameForProperty: Record<string, string> = {};
// export const valueNameForProperty: Record<string, string[]> = {};
// export const choicesForProperty: Record<string, string[]> = {};
// export const uniqueForProperty: Record<string, boolean> = {};
// export const requiredForProperty: Record<string, boolean> = {};
// export const PropertyByName: Record<string, Property> = {};

// // Bei nur einer Unterkategorie: Setze Name und Beschreibung gleich denen der Kategorie
// propgliederung.forEach((cat) => {
//   if (cat.subcategories.length == 1) {
//     cat.subcategories[0].name = cat.title;
//     cat.subcategories[0].description = cat.description;
//   }
// });

// /**
//  * Given the name of a property, the function delivers the property object
//  * @param propertyName Name of the property
//  * @returns Property object from the propgliederung, if not exist: a default object with type text
//  */
// export function getPropertyByName(propertyName: string): Property {
//   const property = PropertyByName[propertyName];
//   if (!property) {
//     return { name: propertyName, type: "text" };
//   }
//   return property;
// }

// //generate it from the propgliederung
// propgliederung.forEach((cat) => {
//   categories[cat.title] = cat;
//   properties[cat.title] = {};
//   cat.subcategories.forEach((subcat) => {
//     properties[cat.title][subcat.name] = {
//       name: subcat.name,
//       properties: subcat.properties.map((prop) => prop.name),
//       description: subcat.description,
//     };
//     subcat.properties.forEach((prop) => {
//       propertyInputTypes[prop.name] = prop.type;
//       if (prop.name) PropertyByName[prop.name] = prop;
//       prop.category = cat.title;
//       if (prop.unique) uniqueForProperty[prop.name] = prop.unique;
//       if (prop.required) requiredForProperty[prop.name] = prop.required;
//       if (prop.choices) choicesForProperty[prop.name] = prop.choices;
//       if (prop.value) valueNameForProperty[prop.name] = prop.value;
//       categoryNameForProperty[prop.name] = cat.title;
//     });
//   });
// });

// // Adjusting generateFormSchema to apply validations based on type and requirements
// export function generateFormSchema() {
//   const schemaFields: Record<string, z.ZodTypeAny> = {};

//   Object.values(categories).forEach((category) => {
//     category.subcategories.forEach((subcategory) => {
//       subcategory.properties.forEach((property) => {
//         let fieldSchema;
//         switch (property.type) {
//           case "text":
//             // Apply basic string validation and check for required
//             fieldSchema = property.required
//               ? z.string().min(1, `${property.name} is required.`)
//               : z.string().optional();
//             break;
//           case "url":
//             // Validate URLs properly
//             fieldSchema = property.required
//               ? z.string().url(`${property.name} must be a valid URL.`)
//               : z.string().url().optional();
//             break;
//           case "number":
//             // Validate numbers, consider using min, max or other methods if needed
//             fieldSchema = property.required
//               ? z.number()
//               : z.number().optional();
//             break;
//           case "file":
//             // For file, ensure it's an instance of File
//             fieldSchema = property.required
//               ? z.instanceof(File)
//               : z.instanceof(File).optional();
//             break;
//           case "radio":
//             // Radio buttons must have one of the predefined choices selected
//             if (property.choices) {
//               fieldSchema = property.required
//                 ? z.enum(property.choices as [string, ...string[]])
//                 : z.enum(property.choices as [string, ...string[]]).optional();
//             }
//             break;
//           default:
//             fieldSchema = z.string().optional(); // Default fallback for any unspecified types
//         }
//         if (fieldSchema) {
//           schemaFields[property.name] = fieldSchema;
//         }
//       });
//     });
//   });

//   return z.object(schemaFields);
// }

// export type FormSchema = z.infer<ReturnType<typeof generateFormSchema>>;
