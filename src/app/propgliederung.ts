export interface Property {
  name: string;
  type: string; // Typ der Eigenschaft, z.B. "string", "number", "boolean", "file", "url"
  description?: string;
  placeholder?: string;
  maxvalues?: number; // maximale Anzahl an Werten, z.B es gibt nur max. ein Eröffnungsdatum
  required?: boolean; // Es muss angegeben werden, um welches Gebäude es geht.
  fixed?: boolean; // Eigenschaft ist festgelegt, z.B. die Gebäude befinden sich immer in Deutschland.
  wikidataprop?: string;
  // selected?: boolean; // ob der Nutzer Angaben zu dieser property machen möchte
  // setSelected?: (setvalue: boolean) => void;
}

export interface SubCategory {
  name: string;
  description: string;
  properties: Property[];
  // selected?: boolean;
  // setSelected?: (setvalue: boolean) => void;
}

export interface Category {
  title: string;
  description: string;
  subcategories: SubCategory[];
  // selected?: boolean;
  // setSelected?: (setvalue: boolean) => void;
}

/** Porperties-Gliederung */
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
          { name: "Höhe", type: "number", wikidataprop: "P2048" },
          { name: "Länge", type: "number", wikidataprop: "P2043" },
          { name: "Breite", type: "number", wikidataprop: "P2049" },
        ],
      },
      {
        name: "Flächenangaben",
        description: "Angaben zur Fläche",
        properties: [
          { name: "Grundfläche", type: "number", wikidataprop: "P2046" },
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
          },
          {
            name: "Unterirdische Stockwerke",
            type: "number",
            wikidataprop: "P1139",
          },
          {
            name: "Anzahl an Fahrstühlen",
            type: "number",
            wikidataprop: "P1301",
          }, // nur wenn es mehrere Stockwerke gibt
        ],
      },
      {
        name: "Räume, Zugehörigkeit",
        description: "Anzahl Räume; bedeutende Räume; ist Teil von",
        properties: [
          { name: "Anzahl Räume", type: "number", wikidataprop: "P8733" },
          {
            name: "ist Teil von",
            type: "text",
            description: "z.B. größerer Gebäudekomplex",
            wikidataprop: "P361",
          },
          {
            name: "enthält",
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
            type: "checkbox",
            wikidataprop: "P2846",
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
          { name: "offizieller Name", type: "text", wikidataprop: "P1448" },
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
        name: "",
        description: "",
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
        name: "",
        description: "",
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
            wikidataprop: "P2130",
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
        name: "",
        description: "Nachbarschaft, Koordinaten, Blickrichtung",
        properties: [
          { name: "Angrenzende Gebäude", type: "text", wikidataprop: "P3032" },
          {
            name: "physisch verbunden mit",
            type: "text",
            wikidataprop: "P2789",
          },
          { name: "Koordinaten", type: "text", wikidataprop: "P625" },
          {
            name: "Zeitzone",
            type: "text",
            fixed: true,
            wikidataprop: "P6237",
          }, //immer MEZ
          { name: "Land", type: "text", fixed: true, wikidataprop: "P17" }, // immer Deutschland
          { name: "Blickrichtung", type: "text", wikidataprop: "P7787" },
        ],
      },
      {
        name: "Adresse",
        description: "Adressangaben zu dem Gebäude",
        properties: [
          { name: "Straße", type: "text", wikidataprop: "P669" }, //wenn Straße als eigenständiges Item vorhanden
          { name: "Komplette Adresse", type: "text", wikidataprop: "P6375" }, // wenn Straße nicht als eigenständiges Item
          { name: "Postleitzahl", type: "text", wikidataprop: "P281" },
        ],
      },
    ],
  },
  {
    title: "Historische Daten",
    description: "Bahjahr, Begründer, Eröffnung, Schließung, Abriss u.a.",
    subcategories: [
      {
        name: "",
        description: "",
        properties: [
          { name: "Baujahr", type: "date", wikidataprop: "P571" },
          { name: "Eröffnungsdatum", type: "date", wikidataprop: "P1619" },
          { name: "Schließungsdatum", type: "date", wikidataprop: "P3999" },
          { name: "Abrissdatum", type: "date", wikidataprop: "P576" },
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
        name: "",
        description: "",
        properties: [
          { name: "Nutzungszustand", type: "text", wikidataprop: "P5817" },
          { name: "Erhaltungszustand", type: "text", wikidataprop: "P5816" },
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
        name: "",
        description: "",
        properties: [
          {
            name: "ist Instanz von",
            fixed: true,
            type: "text",
            wikidataprop: "P31",
          }, // immer Gebäude
          { name: "Commons-Kategorie", type: "text", wikidataprop: "P373" },
          { name: "Schutzkategorie", type: "text", wikidataprop: "P1435" },
          {
            name: "steht in der Denkmalliste",
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
        properties: [
          { name: "offizielle Website", type: "url", wikidataprop: "P856" },
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
export const categories: Record<string, Category> = {};
propgliederung.forEach((cat) => {
  categories[cat.title] = cat;
});

type Properties = {
  [category: string]: {
    [subCategory: string]: {
      name: string;
      properties: string[];
      description: string;
    };
  };
};
export const properties: Properties = {};
propgliederung.forEach((cat) => {
  properties[cat.title] = {};
  cat.subcategories.forEach((subcat) => {
    properties[cat.title][subcat.name] = {
      name: subcat.name,
      properties: subcat.properties.map((prop) => prop.name),
      description: subcat.description,
    };
  });
});

export const propertyInputTypes: Record<string, string> = {};
propgliederung.forEach((cat) => {
  cat.subcategories.forEach((subcat) => {
    subcat.properties.forEach((prop) => {
      propertyInputTypes[prop.name] = prop.type;
    });
  });
});

/**
 * TODO: gute Placeholder entwickeln und in propgliederung einfügen
 */
export const propertyInputPlaceholder: Record<string, string> = {
  Title: "Titel eingeben",
  "Architektonischer Stil": "Architektonischer Stil eingeben",
  Breite: "Breite eingeben",
  Länge: "Länge eingeben",
  "Anzahl der Aufzüge": "Anzahl der Aufzüge eingeben",
  "Anzahl der Räume": "Anzahl der Räume eingeben",
  "Etagen unter Grund": "Etagen unter Grund eingeben",
  "Etagen über Grund": "Etagen über Grund eingeben",
  "Inspiriert Von": "Inspiriert Von eingeben",
  Fläche: "Fläche eingeben",
  Höhe: "Höhe eingeben",
  Rollstuhlzugänglichkeit: "Rollstuhlzugänglichkeit eingeben",
  "Aus Material Gefertigt": "Aus Material Gefertigt eingeben",
  "Hat Teile": "Hat Teile eingeben",
  "Verbindet Mit": "Verbindet Mit eingeben",
  "Commons Kategorie": "Commons Kategorie eingeben",
  "Instanz Von": "Instanz Von eingeben",
  "Erscheint im Kulturerberegister": "Erscheint im Kulturerberegister eingeben",
  "Teil Von": "Teil Von eingeben",
  "Kulturerbe-Bezeichnung": "Kulturerbe-Bezeichnung eingeben",
  "Befindet Sich Auf Straße": "Befindet Sich Auf Straße eingeben",
  Standort: "z.B. Berlin eingeben",
  "Befindet Sich in Zeitzone": "Befindet Sich in Zeitzone eingeben",
  Straßenadresse: "Straßenadresse eingeben",
  Postleitzahl: "Postleitzahl eingeben",
  Koordinatenlage: "Koordinatenlage eingeben",
  Gründung: "Gründung eingeben",
  "Ersetzt Struktur": "Ersetzt Struktur eingeben",
  "Benannt Nach": "Benannt Nach eingeben",
  Spitzname: "Spitzname eingeben",
  "Zustand der Erhaltung": "Zustand der Erhaltung eingeben",
  "Hat Verwendung": "Hat Verwendung eingeben",
  "Bedeutsames Ereignis": "Bedeutsames Ereignis eingeben",
  Kurzname: "Kurzname eingeben",
  "Gegründet Von": "Gegründet Von eingeben",
  "In Auftrag Gegeben Von": "In Auftrag Gegeben Von eingeben",
  Architekt: "Architekt eingeben",
  "Gewartet Von": "Gewartet Von eingeben",
  Bewohner: "Bewohner eingeben",
  Hauptgebäudeunternehmer: "Hauptgebäudeunternehmer eingeben",
  Betreibender: "Betreibender eingeben",
  Hauptauftragnehmer: "Hauptauftragnehmer eingeben",
};
