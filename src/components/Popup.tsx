import React, { useState } from 'react';
import { useTranslatedRecords } from '@/hooks/useTranslatedRecords';
import { useTranslations } from 'next-intl';
import { Property } from '@/types/property';
import { Checkbox } from "@/components/ui/checkbox"

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
     // Get unique categories from selected fields
     const categories = [...new Set(fields.map(field => field.category))];
     if (categories.length > 0) {
       // Scroll to the first category
       setTimeout(() => {
         const categoryId = categories[0];
         if (categoryId) {
           const element = document.getElementById(categoryId);
           if (element) {
             element.scrollIntoView({ 
               behavior: 'smooth',
               block: 'start'
           });
         }
       }}, 100); // Small delay to ensure DOM is updated
     }
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
    <div className="fixed left-0 top-0 flex h-full w-full flex-col overflow-hidden bg-accent shadow-xl sm:w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
      <div className="flex items-center justify-between border-b border-primary-light/20 p-2 sm:p-2.5 md:p-3">
        <h2 className="text-base font-semibold text-primary-dark sm:text-lg md:text-xl">
          {t('categories')}
        </h2>
        <button onClick={onClose} className="text-primary-medium transition-colors hover:text-primary-dark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5"
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
        <div className="w-full overflow-y-auto border-r border-primary-light/20 bg-primary-light/5 sm:w-1/2">
          {Object.values(categories).map((category) => (
            <div
              key={category.title}
              className={`cursor-pointer p-2 transition-colors hover:bg-primary-light/10 sm:p-2.5 md:p-3 ${
                selectedCategory === category.title ? 'border-l-4 border-primary-medium bg-primary-light/20' : ''
              }`}
              onClick={() => handleCategorySelect(category.title)}
            >
              <h3 className="text-sm font-semibold text-primary-dark sm:text-sm md:text-base">
                {category.title}
              </h3>
              <p className="text-xs text-primary-medium sm:text-xs md:text-sm">
                {category.description}
              </p>
            </div>
          ))}
        </div>
  
        {/* Property List */}
        <div className="w-full overflow-y-auto bg-accent sm:w-1/2">
          {selectedCategory &&
            Object.entries(properties[selectedCategory]).map(([subCategory, info]) => (
              <div key={subCategory} className="border-b border-primary-light/20 p-2 sm:p-2.5 md:p-3">
                <div className="flex items-center">
                  <Checkbox 
                    id={`add-${subCategory}`}
                    name={`add-${subCategory}`}
                    checked={info.properties.every((property) =>
                      selectedProperties.includes(property),
                    )}
                    onCheckedChange={() => handleSubCategoryToggle(subCategory, selectedCategory)}
                  />
                  <label
                    htmlFor={`add-${subCategory}`}
                    className="ml-2 block text-xs font-medium text-primary-dark sm:text-xs md:text-sm"
                  >
                    {t('selectAll')}
                    {subCategory}
                  </label>
                </div>
                <ul className="space-y-1 p-1 sm:space-y-1.5 sm:p-1.5">
                  {info.properties.map((property) => (
                    <li
                      key={property}
                      className={`cursor-pointer rounded-lg p-2 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-2.5 ${
                        selectedProperties.includes(property)
                          ? 'border-2 border-primary-medium bg-primary-light/20'
                          : isPropertyInFields(property)
                            ? 'border-2 border-destructive bg-destructive/10'
                            : 'bg-primary-light/5'
                      }`}
                      onClick={() => handlePropertyToggle(property)}
                    >
                      <span className="text-xs font-medium text-primary-dark sm:text-xs md:text-sm">
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
      <div className="border-t border-primary-light/20 bg-primary-light/5 p-2 sm:p-2.5 md:p-3">
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleAddSelectedFields}
            className="rounded bg-primary-medium px-3 py-1.5 text-xs font-bold text-accent transition duration-300 hover:bg-primary-dark sm:text-sm md:text-base"
            disabled={selectedProperties.length === 0}
          >
            {t('addSelected', { count: selectedProperties.length })}
          </button>
          <span className="mt-1 text-center text-xs text-primary-medium sm:text-xs md:text-sm">
            {t('selectProperties')}
          </span>
        </div>
      </div>
    </div>
  );
  
};

export default Popup;
