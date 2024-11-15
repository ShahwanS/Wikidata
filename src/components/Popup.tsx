import React, { useState } from 'react';
import { useTranslatedRecords } from '@/hooks/useTranslatedRecords';
import { useTranslations } from 'next-intl';
import { Property } from '@/types/property';

interface PopupProps {
  onAddFields: (fields: Property[]) => void;
  onClose: () => void;
  fields: Property[];
}

const Popup: React.FC<PopupProps> = ({ onAddFields, onClose, fields }) => {
  const t = useTranslations('PropertyPopup');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const { categories, properties, getPropertyByName } = useTranslatedRecords();
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePropertyToggle = (propertyName: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyName)
        ? prev.filter((p) => p !== propertyName)
        : [...prev, propertyName],
    );
  };

  const handleAddSelectedFields = () => {
    const fields = selectedProperties
      .map((property) => getPropertyByName(property))
      .filter((field): field is Property => field !== undefined);
    onAddFields(fields);
    setSelectedProperties([]);
    onClose();
  };

  const handleSubCategoryToggle = (subCategory: string, selectedCategory: string) => {
    // Get properties for the selected category
    const categoryProperties = properties[selectedCategory];

    // Get properties for the specific subcategory, or an empty array if none exist
    const subCategoryProperties = categoryProperties[subCategory].properties || [];

    setSelectedProperties((prev) => {
      // Check if all subcategory properties are currently selected
      const allSelected = subCategoryProperties.every((property) => prev.includes(property));

      let newSelection;
      if (allSelected) {
        // If all are selected, remove them from the selection
        newSelection = prev.filter((name) => !subCategoryProperties.includes(name));
      } else {
        // If not all are selected, add the missing ones
        newSelection = [...new Set([...prev, ...subCategoryProperties])];
      }

      return newSelection;
    });
  };

  const isPropertyInFields = (propertyName: string) => {
    return fields.some((field) => field.name === propertyName);
  };

  if (!categories || !properties) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed left-0 top-0 flex h-full w-full flex-col overflow-hidden bg-white shadow-xl sm:w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
      <div className="flex items-center justify-between border-b p-2 sm:p-3 md:p-4">
        <h2 className="text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl">
          {t('categories')}
        </h2>
        <button onClick={onClose} className="text-gray-600 transition-colors hover:text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
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

      <div className="flex flex-1 overflow-hidden">
        {/* Category List */}
        <div className="w-full overflow-y-auto border-r bg-gray-50 sm:w-1/2">
          {Object.values(categories).map((category) => (
            <div
              key={category.title}
              className={`cursor-pointer p-2 transition-colors hover:bg-gray-200 sm:p-3 md:p-4 ${
                selectedCategory === category.title ? 'border-l-4 border-sky-500 bg-gray-200' : ''
              }`}
              onClick={() => handleCategorySelect(category.title)}
            >
              <h3 className="text-sm font-semibold text-gray-800 sm:text-base md:text-lg">
                {category.title}
              </h3>
              <p className="text-xs text-gray-600 sm:text-sm md:text-base">
                {category.description}
              </p>
            </div>
          ))}
        </div>

        {/* Property List */}
        <div className="w-full overflow-y-auto bg-white sm:w-1/2">
          {selectedCategory &&
            Object.entries(properties[selectedCategory]).map(([subCategory, info]) => (
              <div key={subCategory} className="border-b p-2 sm:p-3 md:p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`add-${subCategory}`}
                    name={`add-${subCategory}`}
                    checked={info.properties.every((property) =>
                      selectedProperties.includes(property),
                    )}
                    onChange={() => handleSubCategoryToggle(subCategory, selectedCategory)}
                    className="form-checkbox h-4 w-4 text-gray-600 transition duration-150 ease-in-out sm:h-5 sm:w-5"
                  />
                  <label
                    htmlFor={`add-${subCategory}`}
                    className="ml-2 block text-xs font-medium text-gray-700 sm:ml-3 sm:text-sm md:text-base"
                  >
                    {t('selectAll')}
                    {subCategory}
                  </label>
                </div>
                <ul className="space-y-1 p-1 sm:space-y-2 sm:p-2">
                  {info.properties.map((property) => (
                    <li
                      key={property}
                      className={`cursor-pointer rounded-lg p-2 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-3 ${
                        selectedProperties.includes(property)
                          ? 'border-2 border-sky-500 bg-sky-100'
                          : isPropertyInFields(property)
                            ? 'border-2 border-red-500 bg-red-50'
                            : 'bg-gray-100'
                      }`}
                      onClick={() => handlePropertyToggle(property)}
                    >
                      <span className="text-xs font-medium text-gray-800 sm:text-sm md:text-base">
                        {property}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-100 p-2 sm:p-3 md:p-4">
        <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
          <button
            onClick={handleAddSelectedFields}
            className="rounded bg-gray-600 px-3 py-1.5 text-sm font-bold text-white transition duration-300 hover:bg-gray-700 sm:px-4 sm:py-2 sm:text-base md:text-lg"
            disabled={selectedProperties.length === 0}
          >
            {t('addSelected', { count: selectedProperties.length })}
          </button>
          <span className="mt-1 text-center text-xs text-gray-600 sm:mt-2 sm:text-sm md:text-base">
            {t('selectProperties')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Popup;
