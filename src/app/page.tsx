"use client";
import React, { useState } from "react";
import Field, { FieldProps } from "./components/Field";
import Popup from "./components/Popup";
import RichTextField from "./components/RichTextField";
import { convert2Markup} from "./convertToMarkup";

// Define the Home component
export default function Home() {
  // Define state variables
  const [fields, setFields] = useState<FieldProps[]>([
    // Initial fields
    {
      name: "Offizieller Name",
      type: "text",
      placeholder: "Name",
    },
    {
      name: "Datum der offiziellen Eröffnung",
      type: "text",
      placeholder: "Datum : MM/YY oder Jahr",
    },
    { name: "Bild", type: "file" },
    {
      name: "Webseite",
      type: "url",
      placeholder: "https://example.com",
    },
    // {
    //   name: "Land",
    //   type: "text",
    //   placeholder: "Land",
    //   category: "Land oder Zeitzone",
    //   value: "Deutschland",
    // },
    // {
    //   name: "Zeitzone",
    //   type: "text",
    //   placeholder: "Zeitzone",
    //   category: "Land oder Zeitzone",
    //   value: "CET",
    // },
  ]);

  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Function to add new fields
  const addFields = (newFields: FieldProps[]) => {
    const uniqueFields = newFields.filter((newField) => {
      return !fields.some(
        (field: { name: string; type: string; }) => field.name === newField.name && field.type === newField.type
      );
    });
    setFields([...fields, ...uniqueFields]);
  };

  // Function to add a rich text field
  const addRichTextField = () => {
    const richTextField: FieldProps = {
      name: "Rich Text",
      type: "richtext",
    };
    setFields([...fields, richTextField]);
  };
  // Function to remove a field
  const removeField = (fieldssss: FieldProps) => {
    const updatedFields = fields.filter((field: FieldProps) => field !== fieldssss);
    setFields(updatedFields);
  };

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Saving the form data
    const formData = new FormData(event.target as HTMLFormElement);
    const fieldsData = Object.fromEntries(formData.entries());
    //console.log(formData);
    console.log(fieldsData);
    //convertToMarkup(fieldsData);
    convert2Markup(fieldsData);
  };

  // Interface to group fields by category
  interface GroupedFields {
    [category: string]: FieldProps[];
  }

  // Group fields by their category for rendering
  const fieldsByCategory = fields.reduce<GroupedFields>((acc: { [x: string]: any[]; }, field: { category: string; }) => {
    const category = field.category || ""; // Assign to 'Other' if category is undefined
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(field);
    return acc;
  }, {});

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
                      <div key={index} className="col-span-2">
                        <Field
                          name="Abschnittstitel eingeben"
                          type={field.type}
                          placeholder={field.placeholder}
                          onDelete={() => removeField(field)}
                        />
                        <RichTextField name={field.name} />
                      </div>
                    );
                  } else {
                    return (
                      <Field
                        key={index}
                        name={field.name}
                        type={field.type}
                        value={field.value}
                        placeholder={field.placeholder}
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
                type="reset"
                //on click reset take all the current fields that we have right now and recreate them with an empty value
                onClick={() => {
                  setFields([
                    {
                      name: "Offizieller Name",
                      type: "text",
                      placeholder: "Name",
                    },
                    {
                      name: "Datum der offiziellen Eröffnung",
                      type: "text",
                      placeholder: "Datum : MM/YY oder Jahr",
                    },
                    { name: "Bild", type: "file" },
                    {
                      name: "Webseite",
                      type: "url",
                      placeholder: "https://example.com",
                    },
                  ]);
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                alle Felder zurücksetzen
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Einreichen
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
