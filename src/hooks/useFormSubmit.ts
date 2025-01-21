import { useState } from 'react';
import { toast } from 'react-toastify';
import { convert2Markup } from '@/utils/convertToMarkup';
import { commitToGitLab } from '@/app/actions';
import { formatRichTextContent, generateFormSchema, removeTrailingNumber } from '@/utils/utils';
import { z } from 'zod';
import { useTranslatedRecords } from './useTranslatedRecords';

export function useFormSubmit(
  t: any,
  locale: string,
  getPropertyByName: any,
  setShowSubmittedModal: any,
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { tErrors, translatedPropertyStructure } = useTranslatedRecords();
  const handleSubmit = async (
    event: React.FormEvent,
    fieldsData: any,
    richTextState: any,
    richTextTitle: any,
    sources: Record<string, string>,
    userInfo: Record<string, string>,
    handleReset: () => void,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    fieldsData = Object.fromEntries(formData.entries());
    // Extract unit data from JSON strings
    Object.keys(fieldsData).forEach((key) => {
      if (key.includes('_unit')) {
        const parsedData = JSON.parse(fieldsData[key] as string);
        fieldsData[key] = parsedData;
      }
    });

    const dynamicFormSchema = generateFormSchema(fieldsData, tErrors);

    try {
      dynamicFormSchema.parse(fieldsData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        //create a toast for each error specificng the fieldname

        Object.entries(formattedErrors).forEach(([key, value]) => {
          toast.error(`${value}`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
        setErrors(formattedErrors);
        return;
      }
    }
    Object.keys(richTextState).forEach((fieldName) => {
      fieldsData[fieldName] = formatRichTextContent(fieldName, richTextTitle, richTextState);
    });

    // Convert form data to Markdown content
    const markupOutput = convert2Markup(
      fieldsData,
      translatedPropertyStructure,
      locale.toString(),
      sources,
      userInfo,
    );

    if (markupOutput !== undefined) {
      // Name the file based on a form field, or default to "output"
      const fileName =
        fieldsData['Name des Gebäudes/Adresse0'] ||
        fieldsData['Name of the building/Address0'] ||
        'output';
      // Send the generated Markdown file to GitLab
      try {
        setIsLoading(true);
        await commitToGitLab(fileName.toString(), markupOutput, userInfo);
        handleReset();
      } catch (error) {
        console.error('Failed to send the markup file to GitLab:', error);
        toast.error(t('form.errorSending'), {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      setIsLoading(false);
    } else {
    }

    toast.info(t('form.formSaved'), {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  /**
   * Handles resetting the whole page
   * This function handles resetting the whole page.
   */
  const handleReset = () => {
    setShowSubmittedModal(true);
  };

  return { isLoading, handleSubmit, errors, handleReset };
}
