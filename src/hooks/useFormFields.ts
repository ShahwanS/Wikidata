import { useState } from "react";
import { Property } from "@/utils/propgliederung";

export const useFormFields = (initialValues: Property[]) => {
  const [fields, setFields] = useState<Property[]>(initialValues);

  // /** Adds unique fields to the page */
  const addFields = (newFields: Property[]) => {
    const uniqueFields = newFields.filter(
      (newField) =>
        !fields.some(
          (field) =>
            field.name === newField.name && field.type === newField.type
        )
    );
    setFields((prevFields) => [...prevFields, ...uniqueFields]);
  };
  // /** Removes a field from the page */
  const removeField = (fieldToRemove: Property) => {
    setFields((prevFields) =>
      prevFields.filter((field) => field !== fieldToRemove)
    );
  };

  return { fields, addFields, removeField, setFields };
};
