import React from 'react';
import RichTextField from '@/components/RichTextField';

interface RichTextGroupProps {
  richTextState: Record<string, string>;
  richTextTitle: Record<string, string>;
  updateRichTextContent: (fieldName: string, content: string) => void;
  updateRichTextTitle: (fieldName: string, title: string) => void;
  removeRichTextField: (fieldName: string) => void;
}

const RichTextGroup: React.FC<RichTextGroupProps> = ({
  richTextState,
  richTextTitle,
  updateRichTextContent,
  updateRichTextTitle,
  removeRichTextField,
}) => {
  return (
    <div className="space-y-8">
      <h2 className="border-b-2 border-gray-200 pb-3 text-3xl font-bold text-gray-700">
        Weitere Angaben als Freitext
      </h2>
      {Object.keys(richTextState).map((richtextName, index) => (
        <RichTextField
          key={richtextName}
          property={{ name: richtextName, type: 'richie' }}
          updateContent={updateRichTextContent}
          onDelete={() => removeRichTextField(richtextName)}
          initContent={richTextState[richtextName]}
          initTitle={richTextTitle[richtextName]}
          onChange={(e) => updateRichTextTitle(richtextName, e.target.value)}
        />
      ))}
    </div>
  );
};

export default RichTextGroup;
