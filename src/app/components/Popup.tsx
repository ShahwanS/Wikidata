import React, { useState } from "react";
import { FieldProps } from "./Field";
import {
  categories,
  properties,
  propertyInputPlaceholder,
  propertyInputTypes,
} from "../propgliederung";

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

  /**
   * Codeteile jetzt in propgliederung.ts
   */

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
