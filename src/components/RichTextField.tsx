'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Field, { FieldProps } from './Field';
// Import the CSS directly; Next.js handles this for both server and client-side
import 'react-quill/dist/quill.snow.css';
import { useTranslations } from 'next-intl';

const ReactQuill = dynamic(() => import('react-quill'), {
  loading: () => <p>Loading editor...</p>,
});

/**  Defines the parameters needed to generate a React component with richtext. */
export type RichTextFieldProps = FieldProps & {
  /**
   * Method that is called when the richtext changes
   * @param name name of the richtextproperty
   * @param content content of the richtext field
   */
  updateContent: (name: string, content: string) => void;
  initContent: string;
  initTitle: string;
};

/**
 * React component for generating a richtextfield
 * @param param0 Object with the parameters for the richtextfield
 */
const RichTextField: React.FC<RichTextFieldProps> = ({
  property,
  updateContent,
  onDelete,
  onChange, //hier geht es um den Abschnittstitel
  initContent,
  initTitle,
}) => {
  const t = useTranslations('initial');
  const [content, setContent] = useState(initContent);
  /**
   * Method for handling changes of the richtext
   * @param content Richtext
   */
  const handleChange = (content: string) => {
    setContent(content);
    updateContent(property.name, content); // Update parent component's state
  };

  return (
    <div className="my-10 py-2" key={property.name} id={`richtext-${initTitle}`}>
      <Field
        property={{
          name: '',
          type: 'richtext',
          placeholder: t('form.richTextPlaceholder'),
          value: [initTitle],
          unique: true,
          infobox: t('form.infobox'),
        }}
        onDelete={onDelete}
        onChange={onChange}
        key={property.name}
      >
        <ReactQuill
          key={property.name}
          theme="snow"
          value={content}
          onChange={handleChange}
          style={{ height: '400px', marginBottom: '80px', marginTop: '20px' }}
        />
      </Field>
    </div>
  );
};

export default RichTextField;
