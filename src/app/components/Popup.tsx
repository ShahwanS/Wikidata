import React, { useState } from "react";
import { FieldProps } from "./Field";

interface PopupProps {
  onAddFields: (fields: FieldProps[]) => void;
  onClose: () => void;
}

interface Category {
  title: string;
  description: string;
}

interface Properties {
  [category: string]: {
    [subCategory: string]: SubCategory;
  };
}

interface SubCategory {
  description: string;
  properties: string[];
}

const Popup: React.FC<PopupProps> = ({ onAddFields, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const categories: Record<string, Category> = {
    Architektur: {
      title: "Architektur",
      description:
        "Architektonischer Stil, Breite, Länge, Anzahl der Aufzüge, usw.",
    },
    Klassifizierung: {
      title: "Klassifizierung",
      description:
        "Eigenschaften wie 'hat Teil(e)', 'verbindet mit', 'Commons-Kategorie', usw.",
    },
    Geographisch: {
      title: "Geographisch",
      description:
        "Eigenschaften im Zusammenhang mit dem Standort, wie 'befindet sich auf der Straße', 'Land', usw.",
    },
    Kopfdaten: {
      title: "Kopfdaten",
      description: "Gründung, ersetzt Struktur, benannt nach, usw.",
    },
    Unternehmen: {
      title: "Unternehmen",
      description:
        "Informationen über Wartung, Bewohner, Hauptgebäudeunternehmer, usw.",
    },
    Medien: {
      title: "Medien",
      description: "Medienbezogene Eigenschaften wie Bilder.",
    },
  };

  const properties: Properties = {
    Architektur: {
      Dimensionen: {
        description:
          "Eigenschaften im Zusammenhang mit den physischen Abmessungen der Struktur, wie Breite, Länge und Höhe.",
        properties: ["Breite", "Länge", "Höhe", "Fläche"],
      },
      Gebäudedetails: {
        description:
          "Details zu den Merkmalen und Komponenten des Gebäudes, wie Räume und Aufzüge.",
        properties: [
          "Anzahl der Aufzüge",
          "Anzahl der Räume",
          "Etagen unter Grund",
          "Etagen über Grund",
        ],
      },
      MaterialUndZugänglichkeit: {
        description:
          "Informationen über verwendete Materialien und Zugänglichkeitsmerkmale.",
        properties: ["Rollstuhlgängigkeit", "Aus Material Gefertigt"],
      },
      Design: {
        description:
          "Aspekte des architektonischen Designs, einschließlich Stil und Inspirationen.",
        properties: ["Architektonischer Stil", "Inspiriert Von"],
      },
    },
    Klassifizierung: {
      Einordnung: {
        description:
          "Eigenschaften im Zusammenhang mit Klassifizierung und Ordnung, wie Teil einer Serie oder Erbe-Status.",
        properties: [
          "Hat Teile",
          "Verbindet Mit",
          "Commons Kategorie",
          "Instanz Von",
          "Erscheint im Kulturerberegister",
          "Teil Von",
          "Kulturerbe-Bezeichnung",
        ],
      },
    },
    Geographisch: {
      Standortdetails: {
        description:
          "Geographische und Standorteigenschaften der Struktur, einschließlich Straße und Postleitzahl.",
        properties: [
          "Befindet Sich Auf Straße",
          "Standort",
          "Befindet Sich in Zeitzone",
          "Straßenadresse",
          "Postleitzahl",
          "Koordinatenlage",
        ],
      },
    },
    Kopfdaten: {
      HistorischeUndFunktionaleDaten: {
        description:
          "Historische Daten und funktionale Informationen über die Struktur.",
        properties: [
          "Gründung",
          "Ersetzt Struktur",
          "Benannt Nach",
          "Spitzname",
          "Zustand der Erhaltung",
          "Hat Verwendung",
          "Bedeutsames Ereignis",
          "Kurzname",
          "Gegründet Von",
          "In Auftrag Gegeben Von",
          "Architekt",
        ],
      },
    },
    Unternehmen: {
      Unternehmensdetails: {
        description:
          "Details im Zusammenhang mit dem Unternehmen, einschließlich Wartung und Auftragnehmern.",
        properties: [
          "Gewartet Von",
          "Bewohner",
          "Hauptgebäudeunternehmer",
          "Betreibender",
          "Hauptauftragnehmer",
        ],
      },
    },
    Medien: {
      Bilder: {
        description: "Medienbezogene Eigenschaften, wie Bilder der Struktur.",
        properties: ["Bild der Rückseite"],
      },
    },
  };

  const propertyInputTypes: Record<string, string> = {
    "Architektonischer Stil": "text",
    Breite: "number",
    Länge: "number",
    "Anzahl der Aufzüge": "number",
    "Anzahl der Räume": "number",
    "Etagen unter Grund": "number",
    "Etagen über Grund": "number",
    "Inspiriert Von": "text",
    Fläche: "number",
    Höhe: "number",
    Rollstuhlgängigkeit: "text",
    "Aus Material Gefertigt": "text",
    "Hat Teile": "text",
    "Verbindet Mit": "text",
    "Commons Kategorie": "text",
    "Instanz Von": "text",
    "Erscheint im Kulturerberegister": "text",
    "Teil Von": "text",
    "Kulturerbe-Bezeichnung": "text",
    "Befindet Sich Auf Straße": "text",
    Standort: "text",
    "Befindet Sich in Zeitzone": "text",
    Straßenadresse: "text",
    Postleitzahl: "text",
    Koordinatenlage: "text",
    Gründung: "date",
    "Ersetzt Struktur": "text",
    "Benannt Nach": "text",
    Spitzname: "text",
    "Zustand der Erhaltung": "text",
    "Hat Verwendung": "text",
    "Bedeutsames Ereignis": "text",
    Kurzname: "text",
    "Gegründet Von": "text",
    "In Auftrag Gegeben Von": "text",
    Architekt: "text",
    "Gewartet Von": "text",
    Bewohner: "text",
    Hauptgebäudeunternehmer: "text",
    Betreibender: "text",
    Hauptauftragnehmer: "text",
    "Bild der Rückseite": "file",
    Titel: "text",
  };

  const propertyInputPlaceholder: Record<string, string> = {
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
    "Erscheint im Kulturerberegister":
      "Erscheint im Kulturerberegister eingeben",
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

  const getInputTypeForProperty = (property: string): string => {
    return propertyInputTypes[property] || "text";
  };

  const getInputPlaceholderForProperty = (property: string): string => {
    return propertyInputPlaceholder[property] || "";
  };

  //loading Properties based on Category
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setStep(2);
  };

  // Create fields based on selected properties
  const handleSubmit = () => {
    const fields = selectedProperties.map((property) => ({
      name: property,
      type: getInputTypeForProperty(property),
      placeholder: getInputPlaceholderForProperty(property),
    }));
    onAddFields(fields);
    onClose();
  };

  const handleSubCategorySelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const subCategory = event.target.value;
    let updatedProperties = [...selectedProperties];

    // Ensure selectedCategory is not null before proceeding
    if (selectedCategory && properties[selectedCategory]) {
      if (event.target.checked) {
        // Add all properties from the sub-category
        updatedProperties.push(
          ...properties[selectedCategory][subCategory].properties
        );
      } else {
        // Remove all properties from the sub-category
        updatedProperties = updatedProperties.filter(
          (p) =>
            !properties[selectedCategory][subCategory].properties.includes(p)
        );
      }

      setSelectedProperties(updatedProperties);
    }
  };

  return (
    <div className="popup fixed inset-0 bg-gray-700 bg-opacity-75 overflow-y-auto h-full w-full">
      <div className="relative top-10 mx-auto p-8 border w-3/4 max-w-6xl shadow-xl rounded-lg bg-white">
        {/* Category Selection */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Select a Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.values(categories).map((category) => (
                <div
                  key={category.title}
                  className="flex flex-col border p-4 rounded-lg shadow-sm transition duration-300 h-full hover:border-gray-800 hover:shadow-md"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-1">
                      {category.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCategorySelect(category.title)}
                    className="px-4 py-2 w-full text-white bg-gray-800 hover:bg-gray-900 rounded-md transition duration-300 self-end"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Property Selection */}
        {step === 2 && selectedCategory && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Select Sub-category in {selectedCategory}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(properties[selectedCategory]).map(
                ([subCategory, info]) => (
                  <label
                    key={subCategory}
                    className="block p-4 border rounded-lg shadow-sm transition duration-300 hover:border-gray-800 hover:shadow-md"
                  >
                    <input
                      type="checkbox"
                      value={subCategory}
                      onChange={handleSubCategorySelect}
                      className="form-checkbox h-5 w-5 text-gray-600 rounded-md border-gray-300 focus:ring-gray-500 mr-2"
                    />
                    <span className="text-gray-700 font-bold">
                      {subCategory}
                    </span>
                    <p className="text-gray-600">{info.description}</p>
                  </label>
                )
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleSubmit}
                className=" bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-md shadow transition duration-300 mt-6  w-[250px]"
              >
                Felder hinzufügen{" "}
              </button>
              <button
                onClick={onClose}
                className=" w-[250px] bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow transition duration-300 mt-6"
              >
                Schließen
              </button>
            </div>
          </div>
        )}
        {/* Close Button */}
        <div className="mt-6"></div>
      </div>
    </div>
  );
};
export default Popup;
