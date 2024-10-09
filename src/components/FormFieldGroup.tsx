import React from "react";
import Field from "@/components/Field";
import { Property } from "@/utils/propgliederung";

interface FormFieldGroupProps {
  category: string;
  fields: Property[];
  removeField: (field: Property) => void;
  showWikiProps: boolean;
  onSourceSubmit: (fieldName: string, source: string) => void;
}

const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  category,
  fields,
  removeField,
  showWikiProps,
  onSourceSubmit,
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-700 border-b-2 border-gray-200 pb-3">
        {category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {fields.map((field, fieldIndex) => (
          <Field
            key={category + field.name}
            property={field}
            onDelete={() => removeField(field)}
            showWikiProp={showWikiProps}
            onSourceSubmit={(source) => {
              if (field.wikidataprop) {
                onSourceSubmit(field.wikidataprop, source);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FormFieldGroup;
