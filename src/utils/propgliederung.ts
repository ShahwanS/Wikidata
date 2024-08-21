import { z } from "zod";

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

/** Structure for a subcategory */
export type SubCategory = {
  name: string;
  description: string;
  properties: Property[];
};

/** Structure for a category */
export type Category = {
  title: string;
  description: string;
  subcategories: SubCategory[];
};

/**  Defines index signature to get properties by giving the name of a category and subcategory*/
type Properties = {
  [category: string]: {
    [subCategory: string]: {
      name: string;
      properties: string[];
      description: string;
    };
  };
};

// Initialize the necessary objects
export const categories: Record<string, Category> = {};
export const properties: Properties = {};
export const propertyInputTypes: Record<string, string> = {};
export const categoryNameForProperty: Record<string, string> = {};
export const valueNameForProperty: Record<string, string[]> = {};
export const choicesForProperty: Record<string, string[]> = {};
export const uniqueForProperty: Record<string, boolean> = {};
export const requiredForProperty: Record<string, boolean> = {};
export const PropertyByName: Record<string, Property> = {};

/** Porperties-Gliederung
 *  (orientiert sich an der Pdf-Datei)
 */
export const propgliederung: Category[] = [
  {
    title: "Gebäudemaße und -eigenschaften",
    description:
      "Größe des Gebäudes und Angaben zu Räumen Stockwerken, Fahrstühlen",
    subcategories: [
      {
        name: "Dimensionen",
        description: "Gebäudemaße: Breite, Länge und Höhe.",
        properties: [
          {
            name: "Höhe",
            type: "number",
            wikidataprop: "P2048",
            unique: true,
            unit: "Meter",
            placeholder: "Höhe eingeben",
          },
          {
            name: "Länge",
            type: "number",
            wikidataprop: "P2043",
            unique: true,
            unit: "Meter",
            placeholder: "Länge in Metern eingeben",
          },
          {
            name: "Breite",
            type: "number",
            wikidataprop: "P2049",
            unique: true,
            unit: "Meter",
            placeholder: "Breite in Metern eingeben",
          },
        ],
      },
      {
        name: "Flächenangaben",
        description: "Angaben zur Fläche",
        properties: [
          {
            name: "Grundfläche",
            type: "number",
            wikidataprop: "P2046",
            unique: true,
            unit: "Quadratmeter",
            placeholder: "Grundfläche in Quadratmetern eingeben",
          },
        ],
      },
      {
        name: "Stockwerke",
        description: "Anzahl an Stockwerke und Fahrstühlen",
        properties: [
          {
            name: "Oberirdische Stockwerke",
            type: "number",
            wikidataprop: "P1101",
            unique: true,
            placeholder: "Anzahl der Etagen über Grund eingeben",
          },
          {
            name: "Unterirdische Stockwerke",
            type: "number",
            wikidataprop: "P1139",
            unique: true,
            placeholder: "Anzahl der Etagen unter Grund eingeben",
          },
          {
            name: "Anzahl an Fahrstühlen",
            type: "number",
            wikidataprop: "P1301",
            unique: true,
            placeholder: "Anzahl der Aufzüge eingeben",
          },
        ],
      },
      {
        name: "Räume, Zugehörigkeit",
        description: "Anzahl Räume; bedeutende Räume; ist Teil von",
        properties: [
          {
            name: "Anzahl Räume",
            type: "number",
            wikidataprop: "P8733",
            unique: true,
            placeholder: "Anzahl der Räume eingeben",
          },
          {
            name: "Ist Teil von",
            type: "text",
            description: "z.B. größerer Gebäudekomplex",
            wikidataprop: "P361",
            placeholder: "z.B. ein größerer Gebäudekomplex?",
          },
          {
            name: "Enthält",
            type: "text",
            description: "z.B. einzelne bedeutende Räume",
            wikidataprop: "P527",
            placeholder: "z.B. wichtige Räume oder ähnliches",
          },
        ],
      },
      {
        name: "Zugänglichkeit",
        description: "Rollstuhl geeignet",
        properties: [
          {
            name: "Rollstuhl geeignet",
            type: "radio",
            wikidataprop: "P2846",
            choices: [
              "Sehr gut zugänglich mit Rollstuhl",
              "teilweise zugänglich mit Rollstuhl",
              "nicht zugänglich mit Rollstuhl",
            ],
            unique: true,
            placeholder: "Ja/Nein eingeben",
          },
        ],
      },
    ],
  },
  {
    title: "Namensangaben",
    description: "Verschiedene Namen des Gebäudes sowie Namensgeber",
    subcategories: [
      {
        name: "Namen",
        description: "offizieller Name, Kurzname, Spitzname, Namensgeber",
        properties: [
          {
            name: "Offizieller Name",
            type: "text",
            wikidataprop: "P1448",
            unique: true,
            placeholder: "Offiziellen Namen eingeben",
            required: true,
          },
          {
            name: "Kurzname",
            type: "text",
            wikidataprop: "P1813",
            placeholder: "Kurzname eingeben",
          },
          {
            name: "Spitzname",
            type: "text",
            wikidataprop: "P1449",
            placeholder: "Spitzname eingeben",
          },
          {
            name: "Namensgeber",
            type: "text",
            wikidataprop: "P138",
            placeholder: "Namensgeber eingeben",
          },
        ],
      },
    ],
  },
  {
    title: "Architektonische Angaben",
    description: "Stil, Inspiration, Architekt",
    subcategories: [
      {
        name: "Architektur",
        description: " Architekturstil, Inspiriert von, Architekt",
        properties: [
          {
            name: "Architekturstil",
            type: "text",
            wikidataprop: "P149",
            placeholder: "Architektonischen Stil eingeben",
          },
          {
            name: "Inspiriert von",
            type: "text",
            wikidataprop: "P941",
            placeholder: "Inspiriert von eingeben",
          },
          {
            name: "Architekt",
            type: "text",
            wikidataprop: "P84",
            placeholder: "Architekt eingeben",
          },
        ],
      },
    ],
  },
  {
    title: "Baudetails",
    description:
      "Angaben zu Material, Baumethode, Bauunternehmen, Kosten u.a. ",
    subcategories: [
      {
        name: " Bauwesen",
        description: " Baumaterial, Baumethode, Bauunternehmen, Kosten",
        properties: [
          {
            name: "Baumaterial",
            type: "text",
            wikidataprop: "P186",
            placeholder: "Wesentlichste Baumaterialien",
          },
          {
            name: "Baumethode",
            type: "text",
            wikidataprop: "P2079",
            placeholder: "Baumethode eingeben",
          },
          {
            name: "Bauunternehmen",
            type: "text",
            wikidataprop: "P193",
            placeholder: "Bauunternehmen eingeben",
          },
          {
            name: "Immobilienentwickler",
            type: "text",
            wikidataprop: "P6237",
            placeholder: "Immobilienentwickler eingeben",
          },
          {
            name: "Statiker / Ingenieur",
            type: "text",
            wikidataprop: "P631",
            placeholder: "Ingeniuer eingeben",
          },
          {
            name: "Baukosten",
            type: "number",
            description: "in EUR",
            wikidataprop: "P2130",
            unique: true,
            unit: "EUR",
            placeholder: "Baukosten in EUR eingeben",
          },
        ],
      },
    ],
  },
  {
    title: "Geographische Angaben",
    description: "Standort, Ausrichtung, Nachbarn",
    subcategories: [
      {
        name: "Standort",
        description: "Nachbarschaft, Koordinaten, Blickrichtung",
        properties: [
          {
            name: "Angrenzende Gebäude",
            type: "text",
            wikidataprop: "P3032",
            placeholder: "physisch verbunden mit",
          },
          {
            name: "Physisch verbunden mit",
            type: "text",
            wikidataprop: "P2789",
            placeholder: "z.B. einem größeren Gebäudekomplex?",
          },
          {
            name: "Koordinaten",
            type: "text",
            wikidataprop: "P625",
            unique: true,
            placeholder: "Längen- / Breitengrad eingeben",
          },
          {
            name: "Zeitzone",
            type: "text",
            value: ["MEZ"],
            wikidataprop: "P6237",
            unique: true,
            placeholder: "Zeitzone eingeben",
          },
          {
            name: "Land",
            type: "text",
            value: ["Deutschland"],
            wikidataprop: "P17",
            unique: true,
            placeholder: "Land eingeben",
          },
          {
            name: "Blickrichtung",
            type: "text",
            wikidataprop: "P7787",
            unique: true,
            placeholder: "Blickrichtung eingeben",
          },
        ],
      },
      {
        name: "Adresse",
        description: "Adressangaben zu dem Gebäude",
        properties: [
          {
            name: "Straße",
            type: "text",
            wikidataprop: "P669",
            unique: true,
            placeholder: "Befindet Sich Auf Straße eingeben",
          },
          {
            name: "Komplette Adresse",
            type: "text",
            wikidataprop: "P6375",
            unique: true,
            placeholder: "Straße und Hausnummer eingeben",
          },
          {
            name: "Postleitzahl",
            type: "text",
            wikidataprop: "P281",
            unique: true,
            placeholder: "Postleitzahl eingeben",
          },
        ],
      },
    ],
  },
  {
    title: "Historische Daten",
    description: "Bahjahr, Begründer, Eröffnung, Schließung, Abriss u.a.",
    subcategories: [
      {
        name: " Historische Daten",
        description:
          " Baujahr, Eröffnungsdatum, Schließungsdatum, Abrissdatum, Schlüsselereignis, Schlüsselperson, Auftraggeber, Begründer, Vorgängerbauwerk, Nachfolgebauwerk",
        properties: [
          {
            name: "Baujahr",
            type: "text",
            wikidataprop: "P571",
            unique: true,
            placeholder: "Datum : MM/YY oder Jahr",
          },
          {
            name: "Datum der offiziellen Eröffnung",
            type: "text",
            wikidataprop: "P1619",
            unique: true,
            placeholder: "Datum : MM/YY oder Jahr",
          },
          {
            name: "Schließungsdatum",
            type: "text",
            wikidataprop: "P3999",
            unique: true,
            placeholder: "Datum : MM/YY oder Jahr",
          },
          {
            name: "Abrissdatum",
            type: "text",
            wikidataprop: "P576",
            unique: true,
            placeholder: "Datum : MM/YY oder Jahr",
          },
          {
            name: "Schlüsselereignis",
            type: "text",
            wikidataprop: "P793",
            placeholder:
              "Wichtiges historisches Ereignis (z.B. Religionsgespräche)",
          },
          {
            name: "Schlüsselperson",
            type: "text",
            wikidataprop: "P3342",
            placeholder: "z.B. Landgraf Philipp",
          },
          {
            name: "Auftraggeber",
            type: "text",
            wikidataprop: "P88",
            placeholder: "Auftraggeber eingeben",
          },
          {
            name: "Begründer",
            type: "text",
            wikidataprop: "P112",
            placeholder: "Begründer eingeben",
          },
          {
            name: "Vorgängerbauwerk",
            type: "text",
            wikidataprop: "P1398",
            placeholder: "Vorgängerbauwerk eingeben",
          },
          {
            name: "Nachfolgebauwerk",
            type: "text",
            wikidataprop: "P167",
            placeholder: "Nachfolgebauwerk eingeben",
          },
        ],
      },
    ],
  },
  {
    title: "Nutzung",
    description: "Wer nutzt das Gebäude für was? Zustand des Gebäudes",
    subcategories: [
      {
        name: "Nutzung und Zustand",
        description:
          " Nutzungszustand, Erhaltungszustand, Nutzer, Verwendungszweck, Betreiber, Unterhalten durch, Eigentümer, Konfessionszugehörigkeit",
        properties: [
          {
            name: "Nutzungszustand",
            type: "text",
            wikidataprop: "P5817",
            unique: true,
            placeholder: "sehr schlecht/schlecht/normal/gut/sehr gut",
          },
          {
            name: "Erhaltungszustand",
            type: "text",
            wikidataprop: "P5816",
            unique: true,
            placeholder: "sehr schlecht/schlecht/normal/gut/sehr gut",
          },
          {
            name: "Nutzer",
            type: "text",
            wikidataprop: "P466",
            placeholder: "Nutzer eingeben",
          },
          {
            name: "Verwendungszweck",
            type: "text",
            wikidataprop: "P366",
            placeholder: "Verwendungszweck eingeben",
          },
          {
            name: "Betreiber",
            type: "text",
            wikidataprop: "P137",
            placeholder: "Betreibender eingeben",
          },
          {
            name: "Unterhalten durch",
            type: "text",
            wikidataprop: "P126",
            placeholder: "Wer unterhält das Gebäude?",
          },
          {
            name: "Eigentümer",
            type: "text",
            wikidataprop: "P127",
            placeholder: "Eigentümer des Gebäudes eingeben",
          },
          {
            name: "Konfessionszugehörigkeit",
            type: "text",
            wikidataprop: "P140",
            placeholder: "Falls Zugehörigkeit gegeben",
          },
        ],
      },
    ],
  },
  {
    title: "Klassifizierung",
    description: "Angaben zur Klassifizierung, Schutzkategorie, Denkmalliste",
    subcategories: [
      {
        name: "Klassifizierung",
        description: "Schutzkategorie, Denkmalliste, Ist Instanz von",
        properties: [
          {
            name: "Ist Instanz von",
            value: ["Gebäude"],
            type: "text",
            wikidataprop: "P31",
            placeholder: "Instanz Von eingeben",
          },
          {
            name: "Commons-Kategorie",
            type: "text",
            wikidataprop: "P373",
            placeholder: "Commons Kategorie eingeben",
          },
          {
            name: "Schutzkategorie",
            type: "text",
            wikidataprop: "P1435",
            placeholder: "Schutzkategorie eingeben",
          },
          {
            name: "Steht in der Denkmalliste",
            type: "text",
            wikidataprop: "P2817",
            placeholder: "Denkmaliste eingeben",
          },
        ],
      },
    ],
  },
  {
    title: "Links",
    description: "Links zur offiziellen Website",
    subcategories: [
      {
        name: "",
        description: "",
        properties: [
          {
            name: "Webseite",
            type: "url",
            wikidataprop: "P856",
            placeholder: "URL eingeben",
          },
        ],
      },
    ],
  },
  {
    title: "Medien",
    description: "Bilder im Zusammenhang mit dem Gebäude",
    subcategories: [
      {
        name: "",
        description: "",
        properties: [
          {
            name: "Bild",
            type: "file",
            wikidataprop: "P18",
            placeholder: "Bild eingeben",
          },
          {
            name: "Bild der Rückseite",
            type: "file",
            wikidataprop: "P7417",
            placeholder: "Bild der Rückseite eingeben",
          },
          {
            name: "Bild des Eingangs",
            type: "file",
            wikidataprop: "P9721",
            placeholder: "Bild des Eingangs eingeben",
          },
          {
            name: "Luftbild",
            type: "file",
            wikidataprop: "P8592",
            placeholder: "Luftbild eingeben",
          },
          {
            name: "Innenansicht",
            type: "file",
            wikidataprop: "P5775",
            placeholder: "Innenansicht eingeben",
          },
          {
            name: "Grundrissdarstellung",
            type: "file",
            wikidataprop: "P3311",
            placeholder: "Grundrissdarstellung eingeben",
          },
        ],
      },
    ],
  },
];

// Bei nur einer Unterkategorie: Setze Name und Beschreibung gleich denen der Kategorie
propgliederung.forEach((cat) => {
  if (cat.subcategories.length == 1) {
    cat.subcategories[0].name = cat.title;
    cat.subcategories[0].description = cat.description;
  }
});

/**
 * Given the name of a property, the function delivers the property object
 * @param propertyName Name of the property
 * @returns Property object from the propgliederung, if not exist: a default object with type text
 */
export function getPropertyByName(propertyName: string): Property {
  const property = PropertyByName[propertyName];
  if (!property) {
    return { name: propertyName, type: "text" };
  }
  return property;
}

//generate it from the propgliederung
propgliederung.forEach((cat) => {
  categories[cat.title] = cat;
  properties[cat.title] = {};
  cat.subcategories.forEach((subcat) => {
    properties[cat.title][subcat.name] = {
      name: subcat.name,
      properties: subcat.properties.map((prop) => prop.name),
      description: subcat.description,
    };
    subcat.properties.forEach((prop) => {
      propertyInputTypes[prop.name] = prop.type;
      if (prop.name) PropertyByName[prop.name] = prop;
      prop.category = cat.title;
      if (prop.unique) uniqueForProperty[prop.name] = prop.unique;
      if (prop.required) requiredForProperty[prop.name] = prop.required;
      if (prop.choices) choicesForProperty[prop.name] = prop.choices;
      if (prop.value) valueNameForProperty[prop.name] = prop.value;
      categoryNameForProperty[prop.name] = cat.title;
    });
  });
});

// Adjusting generateFormSchema to apply validations based on type and requirements
export function generateFormSchema() {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  Object.values(categories).forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.properties.forEach((property) => {
        let fieldSchema;
        switch (property.type) {
          case "text":
            // Apply basic string validation and check for required
            fieldSchema = property.required
              ? z.string().min(1, `${property.name} is required.`)
              : z.string().optional();
            break;
          case "url":
            // Validate URLs properly
            fieldSchema = property.required
              ? z.string().url(`${property.name} must be a valid URL.`)
              : z.string().url().optional();
            break;
          case "number":
            // Validate numbers, consider using min, max or other methods if needed
            fieldSchema = property.required
              ? z.number()
              : z.number().optional();
            break;
          case "file":
            // For file, ensure it's an instance of File
            fieldSchema = property.required
              ? z.instanceof(File)
              : z.instanceof(File).optional();
            break;
          case "radio":
            // Radio buttons must have one of the predefined choices selected
            if (property.choices) {
              fieldSchema = property.required
                ? z.enum(property.choices as [string, ...string[]])
                : z.enum(property.choices as [string, ...string[]]).optional();
            }
            break;
          default:
            fieldSchema = z.string().optional(); // Default fallback for any unspecified types
        }
        if (fieldSchema) {
          schemaFields[property.name] = fieldSchema;
        }
      });
    });
  });

  return z.object(schemaFields);
}

export type FormSchema = z.infer<ReturnType<typeof generateFormSchema>>;
