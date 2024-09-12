import React from "react";
import Field from "@/components/Field";
import { Property } from "@/utils/propgliederung";

interface FormFieldGroupProps {
  category: string;
  fields: Property[];
  removeField: (field: Property) => void;
  showWikiProps: boolean;
}

const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  category,
  fields,
  removeField,
  showWikiProps,
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
          />
        ))}
      </div>
    </div>
  );
};

export default FormFieldGroup;
