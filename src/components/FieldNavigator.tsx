import React from 'react';
import { Property } from '@/types/property';
import { groupFieldsByCategory } from '@/utils/utils';
import { ChevronRight } from 'lucide-react';

interface FieldNavigatorProps {
  fields: Property[];
  tInitial: (key: string) => string;
  richTextFields?: {
    titles: { [key: string]: string };
    contents: { [key: string]: string };
  };
}

const FieldNavigator: React.FC<FieldNavigatorProps> = ({ fields, tInitial, richTextFields }) => {
  const scrollToField = (fieldName: string) => {
    const element = document.getElementById(`${fieldName}`);

    if (element) {
      // Smooth scroll to the element
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Add highlight animation classes
      if (element.id !== 'top') {
        const highlightClasses = [
          'bg-gray-100',
          'transition-all',
          'duration-500',
          'ease-in-out',
          'rounded-md',
          '-translate-y-2',
        ];

        element.classList.add(...highlightClasses);

        // Remove highlight after animation
        setTimeout(() => {
          element.classList.remove(...highlightClasses);
        }, 1000);
      }
    }
  };

  const groupedFields = groupFieldsByCategory(fields, tInitial);

  return (
    <div className="sticky top-4 rounded-xl bg-white p-4 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">
        {tInitial('form.fieldNavigator')}
      </h3>
      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
        {Object.entries(groupedFields).map(([category, categoryFields]) => (
          <div key={category} className="mb-4">
            <h4 className="mb-2 font-medium text-gray-600">{category}</h4>
            <div className="space-y-1">
              {categoryFields.map((field) => (
                <button
                  key={field.name}
                  onClick={() => scrollToField(field.name)}
                  className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="truncate">{field.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {richTextFields && Object.keys(richTextFields.titles).length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 font-medium text-gray-600">{tInitial('form.additionalText')}</h4>
            <div className="space-y-1">
              {Object.entries(richTextFields.titles).map(([key, title]) => (
                <button
                  key={`richtext-${title}`}
                  onClick={() => scrollToField(`richtext-${title}`)}
                  className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="truncate">{title || key}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldNavigator;
