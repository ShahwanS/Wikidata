import React, { ReactNode, useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { Property } from "../utils/propgliederung";
import Image from "next/image";
import { InputField } from "@/components/ui/input";
/**
 * Things that are needed to generate a React component for a property.
 */
export interface FieldProps {
  property: Property;
  onDelete?: () => void; // Function to handle delete action
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options?: Array<{ label: string; value: string }>;
  children?: ReactNode;
  showWikiProp?: boolean;
}

/**
 * Generiert eine Reactkomponente zur Darstellung einer Property
 * @param FieldProps Property welche durch die Komponente dargestellt werden soll
 * @returns
 */
const Field: React.FC<FieldProps> = ({
  property,
  onChange,
  onDelete,
  options,
  children,
  showWikiProp,
}) => {
  const {
    name,
    type,
    placeholder,
    wikidataprop,
    value,
    choices,
    unique,
    required,
  } = property;

  const [inputFields, setInputFields] = useState<string[]>(value || [""]); // Array to store dynamically added fields

  // CSS styling starting point
  const baseInputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-300 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-sm text-gray-700 focus:shadow-md";

  /** Adds an additional Input field to the Property component */
  const addInputField = () => {
    setInputFields([...inputFields, ""]);
  };

  /** Removes the last input field from the Property component */
  const removeInputField = () => {
    // If there are additional fields, delete the last one from the array; otherwise, delete the entire property component.
    if (inputFields.length > 1) {
      setInputFields(inputFields.slice(0, -1));
    } else {
      onDelete && onDelete();
    }
  };

  return (
    <div className="mb-6">
      {/* HEADER of the Property component */}
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          {name}
          {showWikiProp && wikidataprop && (
            <span className="ml-2 text-xs text-gray-500">
              (
              <a
                href={`https://www.wikidata.org/wiki/Property:${wikidataprop}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {wikidataprop}
              </a>
              )
            </span>
          )}
        </label>
        <div className="flex items-center">
          {/* Trash bin icon to delete the last input field or the entire property component; only if the property is not mandatory */}
          {!required && (
            <button
              type="button"
              onClick={removeInputField}
              className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
              aria-label={`Delete ${name}`}
              tabIndex={-1}
            >
              <MdDeleteOutline size="20px" />
            </button>
          )}

          {/* Plus icon to add additional input fields; only, if the property is not unique */}
          {!unique && (
            <button
              type="button"
              onClick={addInputField}
              className="p-1 ml-2 text-green-600 hover:text-green-800 transition-colors duration-200"
              tabIndex={-1}
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
          {inputFields.map((d, index) => (
            <>
              <input
                key={name + "in" + index}
                className={`${baseInputClasses} file:mr-4  file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                placeholder={placeholder}
                type={type}
                name={name + index}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const updatedData = [...inputFields];
                      updatedData[index] = reader.result
                        ? reader.result.toString()
                        : "";
                      setInputFields(updatedData);
                    };
                    reader.readAsDataURL(file); // Read the file as data URL
                  }
                }}
              />
              {/* Preview of the selected image */}
              {d && (
                <Image
                  alt={"Ausgewähltes " + name}
                  src={d}
                  width={500}
                  height={300}
                />
              )}
            </>
          ))}
        </>
      ) : type === "radio" ? (
        inputFields.map((d, index) => (
          <div key={name + index}>
            {choices?.map((choice, i) => (
              <>
                <input
                  type="radio"
                  key={name + d + index + choice + i}
                  id={choice}
                  name={"Rollstuhl geeignet" + index}
                  value={choice}
                />
                <label htmlFor={choice}>{"  " + choice}</label>
                <br />
              </>
            ))}
          </div>
        ))
      ) : type === "richtext" ? (
        // The case when the Fieldcomponent is used for a richtextfield
        <>
          <input
            key={name}
            className={`${baseInputClasses} bg-white`}
            placeholder={placeholder}
            type="text"
            defaultValue={value || ""}
            onChange={onChange}
          />
          {children}
        </>
      ) : (
        // Render regular input fields
        <>
          {inputFields.map((d, index) => (
            <div key={name + "in" + index} className="flex items-center">
              <InputField
                className={`${baseInputClasses} bg-white mr-2`}
                placeholder={placeholder}
                type={type}
                name={name + index}
                defaultValue={d.toString()}
                onChange={(e) => {
                  const updatedData = inputFields;
                  updatedData[index] = e.target.value;
                  console.log(updatedData);
                  setInputFields(updatedData);
                }}
                {...(type === "number" ? { min: "0" } : {})}
              />
              {property.unit ? (
                <label className="text-gray-600">{property.unit}</label>
              ) : (
                <></>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Field;
