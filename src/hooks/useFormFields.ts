import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { generateFormSchema } from '@/utils/utils';
import { Property } from '@/types/property';
import { useTranslatedRecords } from './useTranslatedRecords';

export const useFormFields = () => {
  const t = useTranslations('form');
  const [fields, setFields] = useState<Property[]>(initialFields);

  /** Helper function to initialize the fields */
  function initialFields(): Property[] {
    return [
      {
        name: t('nameDetails.officialName.label'),
        type: 'text',
        placeholder: t('nameDetails.officialName.placeholder'),
        wikidataprop: 'P1448',
        unique: true,
        required: true,
        infobox: t('nameDetails.officialName.infobox'),
        category: t('nameDetails.title'), 
      },

      {
        name: t('media.image.label'),
        type: 'file',
        wikidataprop: 'P18',
        required: true,
        infobox: t('media.image.infobox'),
        category: t('media.title'),
      },
    ];
  }

  // /** Adds unique fields to the page */
  const addFields = (newFields: Property[]) => {
    const uniqueFields = newFields.filter(
      (newField) =>
        !fields.some((field) => field.name === newField.name && field.type === newField.type),
    );
    setFields((prevFields) => [...prevFields, ...uniqueFields]);
  };
  // /** Removes a field from the page */
  const removeField = (fieldToRemove: Property) => {
    setFields((prevFields) => prevFields.filter((field) => field !== fieldToRemove));
  };

  return { fields, addFields, removeField, setFields, initialFields };
};
