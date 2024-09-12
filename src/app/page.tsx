"use client";
import React, { useState } from "react";
import Field from "@/components/Field";
import Popup from "@/components/Popup";
import RichTextField from "@/components/RichTextField";
import { convert2Markup } from "@/utils/convertToMarkup";
import { Property } from "@/utils/propgliederung";
import { exampleFields, exampleRichtexts } from "./loadexample";
import { commitToGitLab } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** Define the Home components */
export default function Home() {
  // State variables
  const [fields, setFields] = useState<Property[]>(initialFields());
  const [richTextState, setRichTextState] = useState<Record<string, string>>(
    {}
  );
  const [richTextTitle, setRichTextTitle] = useState<Record<string, string>>(
    {}
  );
  const [richtextCounter, setRichtextCounter] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showWikiProps, setShowWikiProps] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  /** Helper function to initialize the fields */
  function initialFields(): Property[] {
    return [
      {
        name: "Offizieller Name",
        type: "text",
        placeholder: "Name",
        wikidataprop: "P1448",
        unique: true,
        required: true,
      },
      {
        name: "Datum der offiziellen Eröffnung",
        type: "text",
        placeholder: "Datum : MM/YY oder Jahr",
        wikidataprop: "P1619",
        unique: true,
        required: true,
      },
      { name: "Bild", type: "file", wikidataprop: "P18", required: true },
      {
        name: "Webseite",
        type: "text",
        placeholder: "https://example.com",
        wikidataprop: "P856",
        required: true,
      },
    ];
  }

  /** Adds unique fields to the page */
  const addFields = (newFields: Property[]) => {
    const uniqueFields = newFields.filter(
      (newField) =>
        !fields.some(
          (field) =>
            field.name === newField.name && field.type === newField.type
        )
    );
    setFields((prevFields) => [...prevFields, ...uniqueFields]);
  };

  /** Updates the content of a RichText field */
  const updateRichTextContent = (fieldName: string, content: string) => {
    setRichTextState((prevState) => ({ ...prevState, [fieldName]: content }));
  };

  /** Updates the title of a RichText field */
  const updateRichTextTitle = (fieldName: string, newTitle: string) => {
    setRichTextTitle((prevState) => ({ ...prevState, [fieldName]: newTitle }));
  };

  /** Adds a new RichText field */
  const addRichTextField = () => {
    const richTextKey = `Rich Text${richtextCounter}`;
    setRichTextState((prevState) => ({ ...prevState, [richTextKey]: "" }));
    setRichTextTitle((prevState) => ({ ...prevState, [richTextKey]: "" }));
    setRichtextCounter((prevCounter) => prevCounter + 1);
  };

  /** Removes a RichText field */
  const removeRichTextField = (richTextName: string) => {
    setRichTextState((prevState) => {
      const newState = { ...prevState };
      delete newState[richTextName];
      return newState;
    });
    setRichTextTitle((prevState) => {
      const newState = { ...prevState };
      delete newState[richTextName];
      return newState;
    });
  };

  /** Removes a field from the page */
  const removeField = (fieldToRemove: Property) => {
    setFields((prevFields) =>
      prevFields.filter((field) => field !== fieldToRemove)
    );
  };

  /** Handles form submission */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    let fieldsData = Object.fromEntries(formData.entries());

    Object.keys(richTextState).forEach((fieldName) => {
      fieldsData[fieldName] = formatRichTextContent(fieldName);
      fieldsData[fieldName] = formatRichTextContent(fieldName);
    });
    console.log(fieldsData);

    // Convert form data to Markdown content
    const markupOutput = convert2Markup(fieldsData, showWikiProps);
    if (markupOutput !== undefined) {
      // Name the file based on a form field, or default to "output"
      const fileName = fieldsData["Offizieller Name0"] || "output";

      // Send the generated Markdown file to GitLab
      try {
        setIsLoading(true);
        await commitToGitLab(fileName.toString(), markupOutput);
        handleReset();
      } catch (error) {
        console.error("Failed to send the markup file to GitLab:", error);
        toast.error("Fehler beim Senden des Markup-Files an GitLab.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      setIsLoading(false);
    } else {
    }

    toast.info("Formular gespeichert", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  /** Formats the RichText content including the title */
  const formatRichTextContent = (fieldName: string): string => {
    const title = richTextTitle[fieldName]
      ? `# ${richTextTitle[fieldName]}\n`
      : "";
    return title + richTextState[fieldName];
  };

  /** Downloads the generated Markdown file */
  const downloadMarkdownFile = (
    markupOutput: string,
    title: FormDataEntryValue
  ) => {
    const blob = new Blob([markupOutput], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Wikidata_${title}.md`;
    a.click();
  };
  /** Groups fields by their category for rendering */
  const fieldsByCategory = groupFieldsByCategory(fields);

  /** Groups fields by their category */
  function groupFieldsByCategory(
    fields: Property[]
  ): Record<string, Property[]> {
    return fields.reduce<Record<string, Property[]>>((acc, field) => {
      const category = field.category || "Main";
      if (!acc[category]) acc[category] = [];
      acc[category].push(field);
      return acc;
    }, {});
  }

  /** Handles resetting the whole page */
  const handleReset = () => {
    // Show confirmation modal before resetting
    setShowResetModal(true);
  };

  const confirmReset = () => {
    //reload the page
    window.location.reload();
  };

  // Render the component
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {showPopup && (
            <div className="lg:w-1/3">
              <Popup
                onAddFields={addFields}
                onClose={() => setShowPopup(false)}
              />
            </div>
          )}

          <div className={`flex-grow ${showPopup ? "lg:w-3/4" : "w-full"}`}>
            <header
              className={`text-5xl font-extrabold text-center mb-12 text-gray-800`}
            >
              <h1 className="inline-block p-3 bg-white rounded-lg shadow-lg">
                Wikidata Formular
              </h1>
            </header>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
            >
              {isLoading && (
                <div className="absolute inset-0 bg-slate-500/20 flex items-center justify-center z-50">
                  <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
              )}
              <div className="p-8 space-y-12">
                {Object.entries(fieldsByCategory).map(
                  ([category, fields], index) => (
                    <div key={index} className="space-y-8">
                      <h2 className="text-3xl font-bold text-gray-700 border-b-2 border-gray-200 pb-3">
                        {category}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {fields.map((field, fieldIndex) => (
                          <Field
                            key={category + field.name}
                            property={field}
                            onDelete={() => removeField(field)}
                            showWikiProp={showWikiProps}
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}

                {Object.keys(richTextState).length > 0 && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-gray-700 border-b-2 border-gray-200 pb-3">
                      Weitere Angaben als Freitext
                    </h2>
                    {Object.keys(richTextState).map((richtextName, index) => (
                      <RichTextField
                        key={richtextName}
                        property={{ name: richtextName, type: "richie" }}
                        updateContent={updateRichTextContent}
                        onDelete={() => removeRichTextField(richtextName)}
                        initContent={richTextState[richtextName]}
                        initTitle={richTextTitle[richtextName]}
                        onChange={(e: { target: { value: string } }) =>
                          updateRichTextTitle(richtextName, e.target.value)
                        }
                      />
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={addRichTextField}
                  className="py-3 w-full bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                >
                  Freitext hinzufügen
                </button>
              </div>
              <div className="bg-gray-50 px-8 py-8 space-y-8">
                <div className="flex flex-wrap justify-between items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setShowPopup(!showPopup)}
                    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    {showPopup
                      ? "Sidebar schließen"
                      : "Weitere Felder hinzufügen"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFields([]);
                      setTimeout(() => {
                        setFields(exampleFields());
                        exampleRichtexts(setRichTextTitle, setRichTextState);
                        setRichtextCounter(2);
                      }, 0);
                    }}
                    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    Lade Beispieldaten
                  </button>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-6">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    Alle Felder zurücksetzen
                  </button>
                  {/* <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showWikiProps"
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-400 border-gray-300 transition duration-150 ease-in-out"
                      onChange={(e) => setShowWikiProps(e.target.checked)}
                    />
                    <label
                      htmlFor="showWikiProps"
                      className="text-sm font-medium text-gray-700"
                    >
                      Wikidata-Propertynummern anzeigen
                    </label>
                  </div> */}
                  <button
                    type="submit"
                    className="px-8 py-4 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">Formular zurücksetzen</h3>
              <p className="mb-6">
                Sind Sie sicher, dass Sie das Formular zurücksetzen wollen? Alle
                eingegebenen Daten werden gelöscht.
              </p>
              <div className="flex justify-start space-x-4">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Abbrechen
                </button>
                <button
                  onClick={confirmReset}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Zurücksetzen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
