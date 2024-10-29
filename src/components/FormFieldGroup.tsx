import React from 'react';
import Field from '@/components/Field';
import { Property } from '@/types/property';
import { removeTrailingNumber } from '@/utils/utils';
interface FormFieldGroupProps {
  category: string;
  fields: Property[];
  removeField: (field: Property) => void;
  showWikiProps: boolean;
  errors: Record<string, string>;
}

const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  category,
  fields,
  removeField,
  showWikiProps,

  errors,
}) => {
  // Function to find the error message for a field
  const getErrorMessage = (fieldName: string) => {
    const withoutTrailingNumber = removeTrailingNumber(fieldName);
    return Object.entries(errors).find(
      ([key, _]) => removeTrailingNumber(key) === withoutTrailingNumber,
    )?.[1];
  };

  return (
    <div className="space-y-8">
      <h2 className="border-b-2 border-gray-200 pb-3 text-3xl font-bold text-gray-700">
        {category}
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {fields.map((field, fieldIndex) => (
          <Field
            key={category + field.name}
            property={field}
            onDelete={() => removeField(field)}
            showWikiProp={showWikiProps}
            error={getErrorMessage(field.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default FormFieldGroup;
