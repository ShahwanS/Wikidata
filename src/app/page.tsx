"use client";

import React, { useState } from "react";
import Field, { FieldProps } from "./components/Field";
import Popup from "./components/Popup";

export default function Home() {
  const [fields, setFields] = useState<FieldProps[]>([
    { name: "Official name", type: "text" },
    { name: "Date of official opening", type: "date" },
    { name: "Image", type: "file" },
    { name: "Country", type: "text" },
    { name: "Website", type: "url" },
  ]);

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const addFields = (newFields: FieldProps[]) => {
    setFields([...fields, ...newFields]);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // saving the form data
  };

  return (
    <div className="flex flex-col h-screen bg-wikipediaGray">
      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col justify-center"
      >
        <div className="max-w-7xl mx-auto bg-white p-6 rounded shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <Field key={index} name={field.name} type={field.type} />
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setShowPopup(true)}
              className="bg-wikipediaBlue hover:bg-wikipediaBlueDark text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Add More Fields
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      {showPopup && (
        <Popup onAddFields={addFields} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}
