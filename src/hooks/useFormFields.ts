import { useState } from "react";
import { useTranslations } from "next-intl";
import { generateFormSchema } from "@/utils/utils";
import { Property } from "@/types/property";
import { useTranslatedRecords } from "./useTranslatedRecords";

export const useFormFields = () => {
  const t = useTranslations("initial");
  const [fields, setFields] = useState<Property[]>(initialFields);
  
  /** Helper function to initialize the fields */
  function initialFields(): Property[] {
    return [
      {
        name: t("OfficialName.label"),
        type: "text",
        placeholder: t("OfficialName.placeholder"),
        wikidataprop: "P1448",
        unique: true,
        required: true,
        infobox: t("OfficialName.infobox"),
      },
      {
        name: t("dateOfOpening.label"),
        type: "text",
        placeholder: t("dateOfOpening.placeholder"),
        wikidataprop: "P1619",
        unique: true,
        required: true,
        infobox: t("dateOfOpening.infobox"),
      },
      {
        name: t("image.label"),
        type: "file",
        wikidataprop: "P18",
        required: true,
        infobox: t("image.infobox"),
      },
      {
        name: t("Website.label"),
        type: "text",
        placeholder: "https://example.com",
        wikidataprop: "P856",
        required: true,
        infobox: t("Website.infobox"),
      },
    ];
  }

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

  return { fields, addFields, removeField, setFields, initialFields };
};
