/** Defines the structure of a property */
export type Property = {
  name: string;
  type: string; // Typ der Eigenschaft, z.B. "string", "number", "boolean", "file", "url"
  description?: string;
  placeholder?: string; // Platzhalter, kann ein Hinweis enthalten, wie das Propertyfeld ausgefüllt werden soll
  unique?: boolean; // true, wenn eine Property nur genau einen Wert haben kann, Bsp: Anzahl Fahrstühle: ein Gebäude kann nicht gleichzeitig 2 und 4 Fahrstühle haben, wenn nichts angegeben: null, also false
  maxvalues?: number; // maximale Anzahl an Werten, z.B es gibt nur max. ein Eröffnungsdatum
  required?: boolean; // gibt an, ob die Property ausgefüllt werden muss; z.B.: Es muss angegeben werden, um welches Gebäude es geht. wenn nichts angegeben: null, also false
  value?: string; // Vorausgefüllter Wert
  wikidataprop?: string; // Associated wikidataproperty-number, if exists; some properties do not have one
  choices?: string[]; // if the property have predefined values: list of all possible values
  category?: string; // Category of the Property
}
/** Structure how a subcategorie could be described */
export type SubCategory = {
  name: string;
  description: string;
  properties: Property[];
  // selected?: boolean;
  // setSelected?: (setvalue: boolean) => void;
}

/** Structure how a categorie could be described */
export type Category = {
  title: string;
  description: string;
  subcategories: SubCategory[];
  // selected?: boolean;
  // setSelected?: (setvalue: boolean) => void;
}

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
          { name: "Höhe (Dimensionen)", type: "number", wikidataprop: "P2048", unique: true },
          { name: "Länge", type: "number", wikidataprop: "P2043", unique: true },
          { name: "Breite", type: "number", wikidataprop: "P2049", unique: true },
        ],
      },
      {
        name: "Flächenangaben",
        description: "Angaben zur Fläche",
        properties: [
          { name: "Grundfläche", type: "number", wikidataprop: "P2046", unique: true },
        ],
      },
      {
        name: "Stockwerke",
        description: "Anzahl an Stockwerke und Fahrstühlen",
        properties: [
          {
            name: "Oberirdische Stockwerke",
            type: "number",
            wikidataprop: "P1101", unique: true
          },
          {
            name: "Unterirdische Stockwerke",
            type: "number",
            wikidataprop: "P1139", unique: true
          },
          {
            name: "Anzahl an Fahrstühlen",
            type: "number",
            wikidataprop: "P1301", unique: true
          },
        ],
      },
      {
        name: "Räume, Zugehörigkeit",
        description: "Anzahl Räume; bedeutende Räume; ist Teil von",
        properties: [
          { name: "Anzahl Räume", type: "number", wikidataprop: "P8733", unique: true },
          {
            name: "Ist Teil von",
            type: "text",
            description: "z.B. größerer Gebäudekomplex",
            wikidataprop: "P361",
          },
          {
            name: "Enthält",
            type: "text",
            description: "z.B. einzelne bedeutende Räume",
            wikidataprop: "P527",
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
            /**describes disabled accessibility of location or event:
             * accessibility for wheelchair users |
             * easy access |
             * step-free access |
             * ADA |
             * wheelchair accessibility |
             * accessibility for people with visual disabilities
            */
            choices: ["Sehr gut zugänglich mit Rollstuhl", "teilweise zugänglich mit Rollstuhl", "nicht zugänglich mit Rollstuhl"],
            unique: true
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
          { name: "Offizieller Name", type: "text", wikidataprop: "P1448", unique: true },
          { name: "Kurzname", type: "text", wikidataprop: "P1813" },
          { name: "Spitzname", type: "text", wikidataprop: "P1449" },
          { name: "Namensgeber", type: "text", wikidataprop: "P138" },
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
          { name: "Architekturstil", type: "text", wikidataprop: "P149" },
          { name: "Inspiriert von", type: "text", wikidataprop: "P941" },
          { name: "Architekt", type: "text", wikidataprop: "P84" },
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
          { name: "Baumaterial", type: "text", wikidataprop: "P186" },
          { name: "Baumethode", type: "text", wikidataprop: "P2079" },
          { name: "Bauunternehmen", type: "text", wikidataprop: "P193" },
          { name: "Immobilienentwickler", type: "text", wikidataprop: "P6237" },
          { name: "Statiker / Ingenieur", type: "text", wikidataprop: "P631" },
          {
            name: "Baukosten",
            type: "number",
            description: "in EUR",
            wikidataprop: "P2130", unique: true
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
          { name: "Angrenzende Gebäude", type: "text", wikidataprop: "P3032" },
          {
            name: "Physisch verbunden mit",
            type: "text",
            wikidataprop: "P2789",
          },
          { name: "Koordinaten", type: "text", wikidataprop: "P625", unique: true },
          {
            name: "Zeitzone",
            type: "text",
            value: "MEZ",
            wikidataprop: "P6237", unique: true
          },
          {
            name: "Land",
            type: "text",
            value: "Deutschland",
            wikidataprop: "P17", unique: true
          },
          { name: "Blickrichtung", type: "text", wikidataprop: "P7787", unique: true },
        ],
      },
      {
        name: "Adresse",
        description: "Adressangaben zu dem Gebäude",
        properties: [
          { name: "Straße", type: "text", wikidataprop: "P669", unique: true }, //wenn Straße als eigenständiges Item vorhanden
          { name: "Komplette Adresse", type: "text", wikidataprop: "P6375", unique: true }, // wenn Straße nicht als eigenständiges Item
          { name: "Postleitzahl", type: "text", wikidataprop: "P281", unique: true },
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
          { name: "Baujahr", type: "text", wikidataprop: "P571", unique: true },
          {
            name: "Datum der offiziellen Eröffnung",
            type: "text",
            wikidataprop: "P1619", unique: true
          },
          { name: "Schließungsdatum", type: "text", wikidataprop: "P3999", unique: true },
          { name: "Abrissdatum", type: "text", wikidataprop: "P576", unique: true },
          { name: "Schlüsselereignis", type: "text", wikidataprop: "P793" },
          { name: "Schlüsselperson", type: "text", wikidataprop: "P3342" },
          { name: "Auftraggeber", type: "text", wikidataprop: "P88" },
          { name: "Begründer", type: "text", wikidataprop: "P112" }, // ?> vielleicht bei historischen Gebäuden eher zu verwenden?
          { name: "Vorgängerbauwerk", type: "text", wikidataprop: "P1398" },
          { name: "Nachfolgebauwerk", type: "text", wikidataprop: "P167" },
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
          { name: "Nutzungszustand", type: "text", wikidataprop: "P5817", unique: true },
          { name: "Erhaltungszustand", type: "text", wikidataprop: "P5816", unique: true },
          { name: "Nutzer", type: "text", wikidataprop: "P466" },
          { name: "Verwendungszweck", type: "text", wikidataprop: "P366" },
          { name: "Betreiber", type: "text", wikidataprop: "P137" },
          { name: "Unterhalten durch", type: "text", wikidataprop: "P126" },
          { name: "Eigentümer", type: "text", wikidataprop: "P127" },
          {
            name: "Konfessionszugehörigkeit",
            type: "text",
            wikidataprop: "P140",
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
            value: "Gebäude",
            type: "text",
            wikidataprop: "P31",
          }, // immer Gebäude
          { name: "Commons-Kategorie", type: "text", wikidataprop: "P373" },
          { name: "Schutzkategorie", type: "text", wikidataprop: "P1435" },
          {
            name: "Steht in der Denkmalliste",
            type: "text",
            wikidataprop: "P2817",
          }, // > Liste müsste erstellt werden
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
        properties: [{ name: "Webseite", type: "url", wikidataprop: "P856" }],
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
          { name: "Bild", type: "file", wikidataprop: "P18" },
          { name: "Bild der Rückseite", type: "file", wikidataprop: "P7417" },
          { name: "Bild des Eingangs", type: "file", wikidataprop: "P9721" },
          { name: "Luftbild", type: "file", wikidataprop: "P8592" },
          { name: "Innenansicht", type: "file", wikidataprop: "P5775" },
          { name: "Grundrissdarstellung", type: "file", wikidataprop: "P3311" },
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
 * Der folgende Code dient dazu, dass das Popupfenster funktioniert.
 */

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

export const categories: Record<string, Category> = {};
propgliederung.forEach((cat) => {
});
/**  Provides index signature to get properties by giving the name of a category and subcategory*/
export const properties: Properties = {};
/** Record for Porperties and their input types */
export const propertyInputTypes: Record<string, string> = {};
/** Record for Porperties and their category name */
export const categoryNameForProperty: Record<string, string> = {};
/** Record for properties and their the default input value */
export const valueNameForProperty: Record<string, string> = {};
/** Record for properties and their the default input value */
export const choicesForProperty: Record<string, string[]> = {};
/** Record for properties and their uniquevalue */
export const uniqueForProperty: Record<string, boolean> = {};
/** Record for properties and their uniquevalue */
export const requiredForProperty: Record<string, boolean> = {};
/** Record for property names and their property objects */
export const PropertyByName: Record<string, Property> = {};
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
/**
 * Given the name of a property, the function delivers the property object
 * @param propertyName Name of the property
 * @returns Property object from the propgliederung, if not exist: a default object with type text
 */
export function getPropertyByName(propertyName: string) :Property {
  const property = PropertyByName[propertyName];
  if (!property) {
    return {name: propertyName, type: "text"};
  }
  property.placeholder = propertyInputPlaceholder[property.name]
  return property;
}
/*************Helper functions***************/
/**
 * Helper function to get input type of a property
 * @param property the property name of the property
 * @returns Type of the given property
 */
const getInputTypeForProperty = (property: string): string => {
  return propertyInputTypes[property] || "text";
};
/**
 * Helper function to get placeholder of a property
 * @param property the property name of the property
 * @returns placeholder of the given property
 */
const getInputPlaceholderForProperty = (property: string): string => {
  return propertyInputPlaceholder[property] || "";
};
/**
 * Helper function to get the category name of a property
 * @param property the property name of the property
 * @returns category name of the given property
 */
const getCategoryNameForProperty = (property: string): string => {
  return categoryNameForProperty[property] || "";
};
/**
 * Helper function to get the default value of a property
 * @param property the property name of the property
 * @returns default value of the given property
 */
const getValueNameForProperty = (property: string): string => {
  return valueNameForProperty[property] || "";
};
/****************************************/


/**
 * TODO: gute Placeholder entwickeln und in propgliederung einfügen
 */
export const propertyInputPlaceholder: Record<string, string> = {
  Title: "Titel eingeben",
  Architekturstil: "Architektonischen Stil eingeben",
  Breite: "Breite in Metern eingeben",
  Länge: "Länge in Metern eingeben",
  "Anzahl der Aufzüge": "Anzahl der Aufzüge eingeben",
  "Anzahl der Räume": "Anzahl der Räume eingeben",
  "Etagen unter Grund": "Anzahl der Etagen unter Grund eingeben",
  "Etagen über Grund": " Anzahl der Etagen über Grund eingeben",
  "Inspiriert von": "Inspiriert von eingeben",
  Fläche: "Fläche in Quadratmetern eingeben",
  Grundfläche: "Grundfläche in Quadratmetern eingeben",
  Höhe: "Höhe eingeben",
  Rollstuhlzugänglichkeit: "Ja/Nein eingeben",
  Enthält: "z.B. wichtige Räume oder ähnliches",
  Baumaterial: "Wesentlichste Baumaterialien",
  Baumethode: "Baumethode eingeben",
  Bauunternehmen: "Bauunternehmen eingeben",
  Immobilienentwickler: "Immobilienentwickler eingeben",
  "Statiker / Ingenieur": "Ingeniuer eingeben",
  "Hat Teile": "weitere Gebäudeteile eingeben",
  "Angrenzende Gebäude": "physisch verbunden mit",
  "Verbindet Mit": "z.B. einem größeren Gebäudekomplex?",
  "Commons-Kategorie": "Commons Kategorie eingeben",
  "Ist Instanz von": "Instanz Von eingeben",
  "Erscheint im Kulturerberegister": "Ja/Nein eingeben",
  "Ist Teil von": "z.B. ein größerer Gebäudekomplex?",
  "Kulturerbe-Bezeichnung": "Kulturerbe-Bezeichnung eingeben",
  Straße: "Befindet Sich Auf Straße eingeben",
  //Standort: "z.B. Berlin eingeben",
  //"Befindet Sich in Zeitzone": "Befindet Sich in Zeitzone eingeben",
  "Komplette Adresse": "Straße und Hausnummer eingeben",
  //Postleitzahl: "Postleitzahl eingeben",
  Koordinaten: "Längen- / Breitengrad eingeben",
  Blickrichtung: "Blickrichtung eingeben",
  Gründung: "Gründungsjahr eingeben",
  "Offizieller Name": "Offiziellen Namen eingeben",
  "Ersetzt Struktur": "Ersetzt Struktur eingeben",
  Namensgeber: "Namensgeber eingeben",
  "Benannt nach": "Benannt nach eingeben",
  Baujahr: "Datum : MM/YY oder Jahr",
  Eröffnungsdatum: "Datum : MM/YY oder Jahr",
  Schließungsdatum: "Datum : MM/YY oder Jahr",
  Abrissdatum: "Datum : MM/YY oder Jahr",
  Spitzname: "Spitzname eingeben",
  Nutzer: "Nutzer eingeben",
  Nutzungszustand: "sehr schlecht/schlecht/normal/gut/sehr gut", //
  Erhaltungszustand: "sehr schlecht/schlecht/normal/gut/sehr gut", //
  //"Hat Verwendung": "Hat Verwendung eingeben",
  Verwendungszweck: "Verwendungszweck eingeben",
  "Bedeutsames Ereignis": "Bedeutsames Ereignis eingeben",
  Kurzname: "Kurzname eingeben",
  "Gegründet Von": "Names des/der Gründer eingeben",
  "In Auftrag Gegeben Von": "Auftrggeber eingeben",
  Architekt: "Architekt eingeben",
  "Gewartet Von": "Name der Wartungsfirma eingeben",
  Bewohner: "Anzahl der Bewohnern eingeben",
  Hauptgebäudeunternehmer: "Hauptgebäudeunternehmer eingeben",
  Betreiber: "Betreibender eingeben",
  Hauptauftragnehmer: "Hauptauftragnehmer eingeben",
  Schlüsselereignis:
    "Wichtiges historisches Ereignis (z.B. Religionsgespräche)",
  Schlüsselperson: "z.B. Landgraf Philipp",
  Auftraggeber: "Auftraggeber eingeben",
  Begründer: "Begründer eingeben",
  Vorgängerbauwerk: "Vorgängerwerk eingeben",
  Nachfolgebauwerk: "Nachfolgebauwerk eingeben",
  "Unterhalten durch": "Wer unterhält das Gebäude?",
  Eigentümer: "Eigenrümer des Gebäudes eingeben",
  Konfessionszugehörigkeit: "Falls Zugehörigkeit gegeben",
  Schutzkategorie: "Schutzkategorie eingeben",
  "Steht in der Denkmalliste": "Denkmaliste eingeben",
  "Offizielle Website": "URL eingeben",
};
