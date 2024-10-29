import { useState } from 'react';

export const useRichTextFields = () => {
  const [richTextState, setRichTextState] = useState<Record<string, string>>({});
  const [richTextTitle, setRichTextTitle] = useState<Record<string, string>>({});
  const [richtextCounter, setRichtextCounter] = useState<number>(0);

  const addRichTextField = () => {
    const richTextKey = `Rich Text${richtextCounter}`;
    setRichTextState((prevState) => ({ ...prevState, [richTextKey]: '' }));
    setRichTextTitle((prevState) => ({ ...prevState, [richTextKey]: '' }));
    setRichtextCounter((prevCounter) => prevCounter + 1);
  };

  const removeRichTextField = (richTextName: string) => {
    setRichTextState((prevState) => {
      const newState = { ...prevState };
      delete newState[richTextName];
      return newState;
    });
    setRichTextTitle((prevState) => {
      const newState = { ...prevState };
      delete newState[richTextName];
      return newState;
    });
  };

  /** Updates the content of a RichText field */
  const updateRichTextContent = (fieldName: string, content: string) => {
    setRichTextState((prevState) => ({ ...prevState, [fieldName]: content }));
  };

  /** Updates the title of a RichText field */
  const updateRichTextTitle = (fieldName: string, newTitle: string) => {
    setRichTextTitle((prevState) => ({ ...prevState, [fieldName]: newTitle }));
  };

  return {
    richTextState,
    richTextTitle,
    addRichTextField,
    removeRichTextField,
    setRichTextState,
    setRichTextTitle,
    setRichtextCounter,
    updateRichTextContent,
    updateRichTextTitle,
  };
};
