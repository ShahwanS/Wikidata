"use client";
import React, { useState } from "react";
import Field from "@/components/Field";
import Popup from "@/components/Popup";
import RichTextField from "@/components/RichTextField";
import { convert2Markup } from "@/utils/convertToMarkup";
import { Property } from "@/utils/propgliederung";
import { exampleFields, exampleRichtexts } from "./loadexample";
import { commitToGitLab } from "./action";
/** Define the Home component */
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

    // Convert form data to Markdown content
    const markupOutput = convert2Markup(fieldsData, showWikiProps);
    if (markupOutput !== undefined) {
      // Name the file based on a form field, or default to "output"
      const fileName = fieldsData["Offizieller Name0"] || "output";

      // Send the generated Markdown file to GitLab
      try {
        await commitToGitLab(fileName.toString(), markupOutput);
        alert("Markup file successfully sent to GitLab!");
      } catch (error) {
        console.error("Failed to send the markup file to GitLab:", error);
        alert("There was an error sending the file to GitLab.");
      }
    } else {
      alert("Bitte füllen Sie alle Felder aus");
    }
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
      const category = field.category || "";
      if (!acc[category]) acc[category] = [];
      acc[category].push(field);
      return acc;
    }, {});
  }

  /** Handles resetting the whole page */
  const handleReset = (event: React.FormEvent) => {
    if (window.confirm("Möchten Sie wirklich alle Felder zurücksetzen?")) {
      window.location.reload();
    } else {
      event.preventDefault();
    }
  };

  // Render the component
  return (
    <div className="min-h-screen bg-wikipediaGray flex justify-center items-center">
      <div className="max-w-5xl mx-auto">
        <header className="text-3xl font-semibold text-center mb-4">
          Wikidata Formular
        </header>
        {/* uncomment this button to quickly have some sample data available
            intended for testing purposes */}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md"
        >
          <>
            {Object.entries(fieldsByCategory).map(
              ([category, fields], index) => (
                <div key={index}>
                  <h2 className="flex justify-center items-center text-xl font-bold mb-10 mt-4">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {fields.map((field, fieldIndex) => {
                      return (
                        <Field
                          key={category + field.name}
                          property={field}
                          onDelete={() => removeField(field)}
                          showWikiProp={showWikiProps}
                        />
                      );
                    })}
                  </div>
                </div>
              )
            )}
            {Object.keys(richTextState).map((richtextName, index) => {
              return (
                <>
                  {index === 0 ? (
                    <h2 className="flex justify-center items-center text-xl font-bold mb-10 mt-4">
                      Weitere Angaben als Freitext
                    </h2>
                  ) : (
                    ""
                  )}
                  <RichTextField
                    key={richtextName}
                    property={{ name: richtextName, type: "richie" }}
                    updateContent={updateRichTextContent}
                    onDelete={() => removeRichTextField(richtextName)}
                    initContent={richTextState[richtextName]}
                    initTitle={richTextTitle[richtextName]}
                    onChange={(e: { target: { value: string } }) =>
                      updateRichTextTitle(richtextName, e.target.value)
                    } // dieses onChange bezieht sich auf das Feld mit dem Abschnittstitel
                  />
                </>
              );
            })}
          </>
          <div className="flex-col items-center justify-between mt-4 space-y-10">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowPopup(true)}
                className="bg-wikipediaBlue hover:bg-wikipediaBlueDark text-white font-bold py-2 px-4 rounded transition duration-300 mr-2"
              >
                Weitere Felder hinzufügen
              </button>
              <button
                type="button"
                onClick={addRichTextField}
                className="bg-wikipediaBlue hover:bg-wikipediaBlueDark text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Freitext hinzufügen
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
                className="bg-wikipediaBlue hover:bg-wikipediaBlueDark text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Lade Beispieldaten
              </button>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                alle Felder zurücksetzen
              </button>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  onChange={(e) => {
                    setShowWikiProps(e.target.checked);
                  }}
                />
                <label className="text-sm">
                  Wikidata-Propertynummern anzeigen
                </label>
              </div>

              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Speichern
              </button>
            </div>
          </div>
        </form>
        {showPopup && (
          <Popup onAddFields={addFields} onClose={() => setShowPopup(false)} />
        )}
      </div>
    </div>
  );
}
