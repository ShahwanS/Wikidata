"use client";
import React, { useState } from "react";
import Field from "./components/Field";
import Popup from "./components/Popup";
import RichTextField from "./components/RichTextField";
import { convert2Markup } from "./convertToMarkup";
import { revalidatePath } from "next/cache";
import { Property } from "./propgliederung";
// Define the Home component
export default function Home() {
  // Define state variables
  const [fields, setFields] = useState<Property[]>([
    // Initial fields
    {
      name: "Offizieller Name",
      type: "text",
      placeholder: "Name",
      unique: true,
      required: true
    },
    {
      name: "Datum der offiziellen Eröffnung",
      type: "text",
      placeholder: "Datum : MM/YY oder Jahr",
      unique: true
    },
    { name: "Bild", type: "file" },
    {
      name: "Webseite",
      type: "text",
      placeholder: "https://example.com",
    },
  ]);
  const [richTextState, setRichTextState] = useState<{ [key: string]: string }>(
    {}
  );

  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Function to add new fields
  const addFields = (newFields: Property[]) => {
    const uniqueFields = newFields.filter((newField) => {
      return !fields.some(
        (field: { name: string; type: string }) =>
          field.name === newField.name && field.type === newField.type
      );
    });
    setFields([...fields, ...uniqueFields]);
  };

  const updateRichTextContent = (fieldName: string, content: string) => {
    setRichTextState((prevState) => ({
      ...prevState,
      [fieldName]: content,
    }));
  };

  // Function to add a rich text field
  const addRichTextField = () => {
    const richTextField: Property = {
      name: "Rich Text",
      type: "richtext",
    };
    setFields([...fields, richTextField]);
  };
  // Function to remove a field
  const removeField = (fieldssss: Property) => {
    const updatedFields = fields.filter(
      (field: Property) => field !== fieldssss
    );
    setFields(updatedFields);
  };

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Initialize formData with existing form fields
    const formData = new FormData(event.target as HTMLFormElement);
    let fieldsData = Object.fromEntries(formData.entries());

    // Directly add rich text content from state to fieldsData
    Object.keys(richTextState).forEach((fieldName) => {
      fieldsData[fieldName] = richTextState[fieldName];
    });

    console.log("Fields Data:", fieldsData);
    const markupOutput = convert2Markup(fieldsData);

    if (markupOutput !== undefined) {
      const blob = new Blob([markupOutput], { type: "text/markdown" });
      const title = fieldsData["Offizieller Name"];
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Wikidata_` + title + `.md`;
      a.click();
    } else {
      alert("Bitte füllen Sie alle Felder aus");
    }
  };

  // Interface to group fields by category
  interface GroupedFields {
    [category: string]: Property[];
  }

  // Group fields by their category for rendering
  const fieldsByCategory = fields.reduce<GroupedFields>(
    (acc: GroupedFields, field: Property) => {
      const category = field.category || ""; // Assign to 'Other' if category is undefined
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(field);
      return acc;
    },
    {}
  );

  const handleReset = (event: any) => {
    const confirmReset = window.confirm(
      "Möchten Sie wirklich alle Felder zurücksetzen?"
    );
    if (!confirmReset) {
      // If the user clicks "Cancel", prevent the form from resetting
      event.preventDefault();
    } else {
      // Reset the whole page to initial state deleting all old info
      window.location.reload();
    }
  };

  // Render the component
  return (
    <div className="min-h-screen bg-wikipediaGray flex justify-center items-center">
      <div className="max-w-5xl mx-auto">
        <header className="text-3xl font-semibold text-center mb-4">
          Wikidata Formular
        </header>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md"
        >
          {Object.entries(fieldsByCategory).map(([category, fields], index) => (
            <div key={index}>
              <h2 className="flex justify-center items-center text-xl font-bold mb-10 mt-4">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {fields.map((field, fieldIndex) => {
                  if (field.type === "richtext") {
                    return (
                      <div key={fieldIndex} className="col-span-2">
                        <RichTextField
                          name={field.name}
                          wikiDataProp="richtext"
                          updateContent={updateRichTextContent}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <Field
                        key={category+field.name}
                        property={field}
                        onDelete={() => removeField(field)}
                      />
                    );
                  }
                })}
              </div>
            </div>
          ))}

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
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                alle Felder zurücksetzen
              </button>
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
