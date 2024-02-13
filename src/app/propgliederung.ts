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
          { name: "Offizieller Name", type: "text", wikidataprop: "P1448" },
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
            name: "Physisch verbunden mit",
            type: "text",
            wikidataprop: "P2789",
          },
          { name: "Koordinaten", type: "text", wikidataprop: "P625" },
          /*{
            name: "Zeitzone",
            type: "text",
            fixed: true,
            wikidataprop: "P6237",
          },*/ //immer MEZ
          //{ name: "Land", type: "text", fixed: true, wikidataprop: "P17" }, // immer Deutschland
          { name: "Blickrichtung", type: "text", wikidataprop: "P7787" },
        ],
      },
      {
        name: "Adresse",
        description: "Adressangaben zu dem Gebäude",
        properties: [
          { name: "Straße", type: "text", wikidataprop: "P669" }, //wenn Straße als eigenständiges Item vorhanden
          { name: "Komplette Adresse", type: "text", wikidataprop: "P6375" }, // wenn Straße nicht als eigenständiges Item
          //{ name: "Postleitzahl", type: "text", wikidataprop: "P281" },
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
          { name: "Baujahr", type: "text", wikidataprop: "P571" },
          { name: "Eröffnungsdatum", type: "text", wikidataprop: "P1619" },
          { name: "Schließungsdatum", type: "text", wikidataprop: "P3999" },
          { name: "Abrissdatum", type: "text", wikidataprop: "P576" },
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
            name: "Ist Instanz von",
            fixed: true,
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
        properties: [
          { name: "Offizielle Website", type: "url", wikidataprop: "P856" },
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

export const categoryNameForProperty: Record<string, string> = {};
propgliederung.forEach((cat) => {
  cat.subcategories.forEach((subcat) => {
    subcat.properties.forEach((prop) => {
      categoryNameForProperty[prop.name] = cat.title;
    });
  });
});

/**
 * TODO: gute Placeholder entwickeln und in propgliederung einfügen
 */
export const propertyInputPlaceholder: Record<string, string> = {
  Title: "Titel eingeben",
  "Architekturstil": "Architektonischen Stil eingeben",
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
  "Enthält" : "z.B. wichtige Räume oder ähnliches",
  "Baumaterial": "Wesentlichste Baumaterialien",
  "Baumethode" : "Baumethode eingeben",
  "Bauunternehmen" : "Bauunternehmen eingeben",
  "Immobilienentwickler": "Immobilienentwickler eingeben",
  "Statiker / Ingenieur" : "Ingeniuer eingeben",
  "Hat Teile": "weitere Gebäudeteile eingeben",
  "Angrenzende Gebäude" : "physisch verbunden mit",
  "Verbindet Mit": "z.B. einem größeren Gebäudekomplex?",
  "Commons-Kategorie": "Commons Kategorie eingeben",
  "Ist Instanz von": "Instanz Von eingeben",
  "Erscheint im Kulturerberegister": "Ja/Nein eingeben",
  "Ist Teil von": "z.B. ein größerer Gebäudekomplex?",
  "Kulturerbe-Bezeichnung": "Kulturerbe-Bezeichnung eingeben",
  "Straße": "Befindet Sich Auf Straße eingeben",
  //Standort: "z.B. Berlin eingeben",
  //"Befindet Sich in Zeitzone": "Befindet Sich in Zeitzone eingeben",
  "Komplette Adresse": "Straße und Hausnummer eingeben",
  //Postleitzahl: "Postleitzahl eingeben",
  "Koordinaten": "Längen- / Breitengrad eingeben",
  "Blickrichtung" : "Blickrichtung eingeben",
  Gründung: "Gründungsjahr eingeben",
  "Offizieller Name" : "Offiziellen Namen eingeben",
  "Ersetzt Struktur": "Ersetzt Struktur eingeben",
  "Namensgeber" : "Namensgeber eingeben",
  "Benannt nach": "Benannt nach eingeben",
  "Baujahr" : "Datum : MM/YY oder Jahr",
  "Eröffnungsdatum" : "Datum : MM/YY oder Jahr",
  "Schließungsdatum" : "Datum : MM/YY oder Jahr",
  "Abrissdatum" : "Datum : MM/YY oder Jahr",
  Spitzname: "Spitzname eingeben",
  "Nutzer" : "Nutzer eingeben",
  "Nutzungszustand" : "sehr schlecht/schlecht/normal/gut/sehr gut", //  
  "Erhaltungszustand": "sehr schlecht/schlecht/normal/gut/sehr gut", // 
  //"Hat Verwendung": "Hat Verwendung eingeben",
  "Verwendungszweck" : "Verwendungszweck eingeben",
  "Bedeutsames Ereignis": "Bedeutsames Ereignis eingeben",
  Kurzname: "Kurzname eingeben",
  "Gegründet Von": "Names des/der Gründer eingeben",
  "In Auftrag Gegeben Von": "Auftrggeber eingeben",
  Architekt: "Architekt eingeben",
  "Gewartet Von": "Name der Wartungsfirma eingeben",
  Bewohner: "Anzahl der Bewohnern eingeben",
  Hauptgebäudeunternehmer: "Hauptgebäudeunternehmer eingeben",
  "Betreiber": "Betreibender eingeben",
  Hauptauftragnehmer: "Hauptauftragnehmer eingeben",
  "Schlüsselereignis" : "Wichtiges historisches Ereignis (z.B. Religionsgespräche)",
  "Schlüsselperson" : "z.B. Landgraf Philipp",
  "Auftraggeber" : "Auftraggeber eingeben",
  "Begründer" : "Begründer eingeben",
  "Vorgängerbauwerk" : "Vorgängerwerk eingeben",
  "Nachfolgebauwerk" : "Nachfolgebauwerk eingeben",
  "Unterhalten durch" : "Wer unterhält das Gebäude?",
  "Eigentümer" : "Eigenrümer des Gebäudes eingeben",
  "Konfessionszugehörigkeit" : "Falls Zugehörigkeit gegeben",
  "Schutzkategorie" : "Schutzkategorie eingeben",
  "Steht in der Denkmalliste" : "Denkmaliste eingeben",
  "Offizielle Website" : "URL eingeben"
};