"use client";

import React, { useState } from "react";
import Field, { FieldProps } from "./components/Field";
import Popup from "./components/Popup";
import RichTextField from "./components/RichTextField";

export default function Home() {
  const [fields, setFields] = useState<FieldProps[]>([
    { name: "Offizieller Name", type: "text", placeholder: "Name" },
    {
      name: "Datum der offiziellen Eröffnung",
      type: "text",
      placeholder: "Datum : MM/YY oder Jahr",
    },
    { name: "Bild", type: "file" },
    { name: "Webseite", type: "url", placeholder: "https://example.com" },
  ]);

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const addFields = (newFields: FieldProps[]) => {
    const uniqueFields = newFields.filter((newField) => {
      return !fields.some(
        (field) => field.name === newField.name && field.type === newField.type
      );
    });
    setFields([...fields, ...uniqueFields]);
  };

  const addRichTextField = () => {
    const richTextField: FieldProps = {
      name: "Reichhaltiger Text",
      type: "richtext",
    };
    setFields([...fields, richTextField]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // saving the form data
    const formData = new FormData(event.target as HTMLFormElement);
    const fieldsData = Object.fromEntries(formData.entries());
  };

  return (
    <div className="min-h-screen bg-wikipediaGray flex justify-center items-center ">
      <div className="max-w-5xl mx-auto">
        <header className="text-3xl font-semibold text-center mb-4  w-[64rem]">
          Wikidata Formular
        </header>
        <form
          onSubmit={handleSubmit}
          className="flex-grow flex flex-col justify-center "
        >
          <div className="max-w-7xl mx-auto bg-white p-6 rounded shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {fields.map((field, index) => {
                if (field.type === "richtext") {
                  return (
                    <div key={index} className="col-span-2">
                      <Field
                        name="Abschnittstitel eingeben"
                        type={field.type}
                        placeholder={field.placeholder}
                        onDelete={() => removeField(index)}
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
                      placeholder={field.placeholder}
                      onDelete={() => removeField(index)}
                    />
                  );
                }
              })}
            </div>
            <div className="flex justify-between mt-4">
              <div>
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
                  Abschnitt hinzufügen
                </button>
              </div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Einreichen
              </button>
            </div>
          </div>
        </form>
      </div>
      {showPopup && (
        <Popup onAddFields={addFields} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}
