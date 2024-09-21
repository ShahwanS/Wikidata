import React, { useState } from "react";
import { Property } from "../utils/propgliederung";
import { useTranslatedRecords } from "@/hooks/useTranslatedRecords";
import { useTranslations } from "next-intl";
interface PopupProps {
  onAddFields: (fields: Property[]) => void;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onAddFields, onClose }) => {
  const t = useTranslations("PropertyPopup");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const { categories, properties, getPropertyByName } = useTranslatedRecords();
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


  const handleSubCategoryToggle = (subCategory: string, selectedCategory: string) => {
    // Get properties for the selected category
    const categoryProperties = properties[selectedCategory];
    
    // Get properties for the specific subcategory, or an empty array if none exist
    const subCategoryProperties = categoryProperties[subCategory].properties || [];
    
    setSelectedProperties(prev => {
      // Check if all subcategory properties are currently selected
      const allSelected = subCategoryProperties.every(property => prev.includes(property));
      
      let newSelection;
      if (allSelected) {
        // If all are selected, remove them from the selection
        newSelection = prev.filter(name => !subCategoryProperties.includes(name));
      } else {
        // If not all are selected, add the missing ones
        newSelection = [...new Set([...prev, ...subCategoryProperties])];
      }
      
      return newSelection;
    });
  };


  if (!categories || !properties) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed left-0 top-0 h-full w-full bg-white shadow-xl overflow-hidden flex flex-col md:w-1/3 sm:w-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {t("categories")}
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
        <div className="w-full md:w-1/2 border-r overflow-y-auto bg-gray-50">
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
        <div className="w-full md:w-1/2 overflow-y-auto bg-white">
          {selectedCategory &&
            Object.entries(properties[selectedCategory]).map(
              ([subCategory, info]) => (
                <div key={subCategory} className="p-4 border-b">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`add-${subCategory}`}
                      name={`add-${subCategory}`}
                      checked={info.properties.every(property => selectedProperties.includes(property))}

                      onChange={() => handleSubCategoryToggle(subCategory, selectedCategory)}
                      className="form-checkbox h-5 w-5 text-gray-600 transition duration-150 ease-in-out"
                    />
                    <label htmlFor={`add-${subCategory}`} className="ml-3 block text-sm font-medium text-gray-700">
                      {subCategory}
                    </label>
                  </div>
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
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            disabled={selectedProperties.length === 0}
          >
            {t("addSelected", { count: selectedProperties.length })}
          </button>
          <span className="text-sm text-gray-600 text-center mt-2">
            {t("selectProperties")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Popup;
