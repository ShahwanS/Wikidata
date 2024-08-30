import React, { useState } from "react";
import {
  categories,
  properties,
  Property,
  getPropertyByName,
} from "../utils/propgliederung";

interface PopupProps {
  onAddFields: (fields: Property[]) => void;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onAddFields, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedProperties([]);
  };

  const handlePropertyToggle = (propertyName: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyName)
        ? prev.filter((p) => p !== propertyName)
        : [...prev, propertyName]
    );
  };

  const handleAddSelectedFields = () => {
    const fields = selectedProperties
      .map((property) => getPropertyByName(property))
      .filter((field): field is Property => field !== undefined);
    onAddFields(fields);
    setSelectedProperties([]);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-1/3 bg-white shadow-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Kategorien und Eigenschaften
        </h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Category List */}
        <div className="w-1/2 border-r overflow-y-auto bg-gray-50">
          {Object.values(categories).map((category) => (
            <div
              key={category.title}
              className={`p-4 cursor-pointer hover:bg-gray-200 transition-colors ${
                selectedCategory === category.title
                  ? "bg-gray-200 border-l-4 border-sky-500"
                  : ""
              }`}
              onClick={() => handleCategorySelect(category.title)}
            >
              <h3 className="font-semibold text-gray-800">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>

        {/* Property List */}
        <div className="w-1/2 overflow-y-auto bg-white">
          {selectedCategory &&
            Object.entries(properties[selectedCategory]).map(
              ([subCategory, info]) => (
                <div key={subCategory} className="p-4 border-b">
                  <h4 className="font-semibold text-gray-800">{subCategory}</h4>
                  <ul className="p-2 space-y-2">
                    {info.properties.map((property) => (
                      <li
                        key={property}
                        className={`p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                          selectedProperties.includes(property)
                            ? "bg-sky-100 border-2 border-sky-500"
                            : "bg-gray-100"
                        }`}
                        onClick={() => handlePropertyToggle(property)}
                      >
                        <span className="font-medium text-gray-800">
                          {property}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-100 border-t">
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleAddSelectedFields}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            disabled={selectedProperties.length === 0}
          >
            Ausgewählte hinzufügen ({selectedProperties.length})
          </button>
          <span className="text-sm text-gray-600 text-center mt-2">
            Eigenschaften auswählen, die hinzugefügt werden sollen
          </span>
        </div>
      </div>
    </div>
  );
};

export default Popup;
