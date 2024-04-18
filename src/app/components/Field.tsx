import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";

/**
 * Defines the structure of a property to generate a React component for a property.
 */
export interface FieldProps {
  name: string; // Name of the field
  type: string; // Type of the field
  placeholder?: string; // Placeholder text for the field
  wikidataprop?: string; // Associated Wikidata property number
  category?: string; // Category of the field
  onDelete?: () => void; // Function to handle delete action
  value?: string; // Value of the field
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options?: Array<{ label: string; value: string }>;
}

/**
 * Generiert eine Reactkomponente zur Darstellung einer Property
 * @param FieldProps Property welche durch die Komponente dargestellt werden soll 
 * @returns 
 */
const Field: React.FC<FieldProps> = ({
  name,
  type,
  onDelete,
  placeholder,
  wikidataprop,
  onChange,
  value,
  options,
}) => {
  const [fields, setFields] = useState<string[]>([]); // Array to store dynamically added fields
  const [inputValue, setInputValue] = useState(value || ""); // Initialize inputValue with the provided value or an empty string

  // Update the local state when the value prop changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // CSS styling starting point
  const baseInputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-300 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-sm text-gray-700 focus:shadow-md";
  
  /** Adds an additional Input field to the Property component */
  const addField = () => {
    setFields([...fields, `Field ${fields.length + 1}`]); // Add a new field to the fields array
  };

  /** Removes the last input field from the Property component */
  const removeSubfield = () => {
    // If there are additional fields, delete the last one from the array; otherwise, delete the entire property component.
    if (fields.length > 0) {
      const updatedFields = fields.slice(0, -1);
      setFields(updatedFields);
    } else {
      onDelete && onDelete();
    }
  };

  return (
    <div className="mb-6">
      {/* HEADER of the Property component */}
      <div className="flex justify-between">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {name}
        </label>
        <div>
          {/* Trash bin icon to delete the last input field or the entire property component */}
          {type !== "number" &&
            name !== "Offizieller Name" &&
            name !== "Abschnittstitel" &&
            name !== "Datum der offiziellen Eröffnung" &&
            name !== "Webseite" &&
            name !== "Bild" && (
              <button
                type="button"
                onClick={removeSubfield}
                className="ml-2 text-red-500 hover:text-red-700"
                aria-label={`Delete ${name}`}
              >
                <MdDeleteOutline size="20px" />
              </button>
            )}

          {/* Plus icon to add additional input fields */}
          {type !== "number" &&
            name !== "Offizieller Name" &&
            name !== "Abschnittstitel" &&
            name !== "Datum der offiziellen Eröffnung" &&
            name !== "Webseite" &&
            name !== "Bild" && (
              <button
                type="button"
                onClick={addField}
                className="ml-2 text-green-800 hover:opacity-40"
              >
                <CiCirclePlus size="20px" />
              </button>
            )}
        </div>
      </div>
      {/* HEADER END */}

      {type === "file" ? (
        // Render file input fields
        <>
          <input
            type="file"
            name={name}
            className={`${baseInputClasses} file:mr-4  file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
          />
          <div>
            {fields.map((field, index) => (
              <input
                key={wikidataprop}
                className={`${baseInputClasses} file:mr-4  file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                type="file"
                name={`${name}${index}`}
              />
            ))}
          </div>
        </>
      ) : (
        // Render regular input fields
        <>
          <div>
            <input
              className={`${baseInputClasses} bg-white`}
              placeholder={placeholder}
              type={type}
              name={name}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                onChange && onChange(e);
              }}
              {...(type === "number" ? { min: "0" } : {})}
            />
          </div>
          <div>
            {fields.map((field, index) => (
              <input
                key={wikidataprop}
                className={`${baseInputClasses} bg-white mt-2`}
                placeholder={`${name} ${index + 1}`}
                type={type}
                name={`${name}${index}`}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  onChange && onChange(e);
                }}
                {...(type === "number" ? { min: "0" } : {})}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Field;
