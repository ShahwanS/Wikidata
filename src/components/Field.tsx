'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { CiCirclePlus } from 'react-icons/ci';
import Image from 'next/image';
import { InputField } from '@/components/ui/input';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { LucideInfo } from 'lucide-react';
import { Button } from './ui/button';
import SourcePopup from './SourcePopup';
import { useTranslations } from 'next-intl';
import { Property } from '@/types/property';
import { useSource } from '@/context/SourceContext';
export interface FieldProps {
  property: Property;
  onDelete?: () => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options?: Array<{ label: string; value: string }>;
  children?: ReactNode;
  showWikiProp?: boolean;
  error?: any;
}

/**
 * Field component to render different types of input fields based on the property type.
 */
const Field: React.FC<FieldProps> = ({ property, onChange, onDelete, children, error }) => {
  const { name, type, placeholder, wikidataprop, value, choices, unique, infobox } = property;
  const tForm = useTranslations('form');
  const [inputFields, setInputFields] = useState<string[]>(value || ['']);
  const [showSourcePopup, setShowSourcePopup] = useState(false);
  const [previewSource, setPreviewSource] = useState<string>('');
  const tSourcePopup = useTranslations('SourcePopup');
  const { handleSourceSubmit, sources } = useSource();
  const [copyrightFields, setCopyrightFields] = useState<string[]>(
    Array(inputFields.length).fill(''),
  );

  const baseInputClasses =
    'w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-300 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-sm text-gray-700 focus:shadow-md';

  useEffect(() => {
    if (wikidataprop && sources[wikidataprop]) {
      setPreviewSource(sources[wikidataprop]);
    }
  }, [sources, wikidataprop]);

  const addInputField = () => {
    setInputFields([...inputFields, '']);
    setCopyrightFields([...copyrightFields, '']);
  };

  const removeInputField = (index: number) => {
    if (inputFields.length > 1) {
      setInputFields(inputFields.filter((_, i) => i !== index));
      setCopyrightFields(copyrightFields.filter((_, i) => i !== index));
    } else {
      onDelete?.();
    }
  };

  const handleCopyrightChange = (index: number, value: string) => {
    const newCopyrightFields = [...copyrightFields];
    newCopyrightFields[index] = value;
    setCopyrightFields(newCopyrightFields);

    onChange?.({
      target: { name: `copyright_${name}${index}`, value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleInputChange = (index: number, value: string) => {
    const newFields = [...inputFields];
    newFields[index] = value;
    setInputFields(newFields);

    onChange?.({
      target: { name: name + index, value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSubmit = (source: string) => {
    setPreviewSource(source);
    setShowSourcePopup(false);
    if (wikidataprop) {
      handleSourceSubmit?.(wikidataprop, source);
    }
  };

  const handleRemoveSource = () => {
    setPreviewSource('');
    if (wikidataprop) {
      handleSourceSubmit?.(wikidataprop, '');
    }
  };

  const tooltipId = `tooltip-${name}`;

  const renderSourcePreview = () => {
    return (
      previewSource && (
        <div className="my-2 rounded-md bg-gray-200 p-1 shadow-md sm:my-3 sm:p-2">
          <div className="flex max-h-36 flex-col items-center justify-center overflow-y-auto rounded-md bg-white p-1 text-gray-600 sm:max-h-48 sm:p-2">
            <p className="mb-1 text-sm font-semibold text-gray-700 sm:mb-2 sm:text-base">
              {tSourcePopup('sourceLabel')}:
            </p>
            {previewSource.split(`${tSourcePopup('referencesLabel')}:`).map((part, index) => (
              <div key={index} className={index === 1 ? 'mt-2 sm:mt-3' : ''}>
                {index === 1 && (
                  <p className="mb-1 text-sm font-semibold text-gray-700 sm:mb-2 sm:text-base">
                    {tSourcePopup('referencesLabel')}:
                  </p>
                )}
                <p className="whitespace-pre-wrap text-center text-sm sm:text-base">
                  {part.trim()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    );
  };

  const renderSourceButtons = () => (
    <div className="mt-2 sm:mt-4">
      {type !== 'richtext' && (
        <SourceButtons
          setShowSourcePopup={setShowSourcePopup}
          previewSource={previewSource}
          handleRemoveSource={handleRemoveSource}
        />
      )}
    </div>
  );

  return (
    <div className="mb-4 sm:mb-6" id={`${name}`}>
      <div className="mb-1 flex items-center justify-between sm:mb-2">
        <label className="flex items-center text-xs font-medium text-gray-700 sm:text-sm">
          {name}
          {wikidataprop && (
            <span className="ml-1 text-xs text-gray-500 sm:ml-2">
              (
              <a
                href={`https://www.wikidata.org/wiki/Property:${wikidataprop}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 transition-colors duration-200 hover:text-blue-800"
              >
                {wikidataprop}
              </a>
              )
            </span>
          )}
          {!unique && (
            <button
              type="button"
              onClick={addInputField}
              className="ml-1 p-0.5 text-green-600 transition-colors duration-200 hover:text-green-800 sm:ml-2 sm:p-1"
              tabIndex={-1}
            >
              <CiCirclePlus className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </label>
        <div className="flex flex-col items-center">
          <LucideInfo
            className="mr-1 h-4 w-4 text-blue-500 sm:mr-2 sm:h-5 sm:w-5"
            data-tooltip-id={tooltipId}
          />
          <ReactTooltip id={tooltipId} place="left" content={infobox} />
        </div>
      </div>
      {renderSourcePreview()}
      {type === 'file' ? (
        inputFields.map((data, index) => (
          <div key={name + 'in' + index} className="mb-2 sm:mb-4">
            <div className="flex items-center">
              <div className="mr-1 flex-grow sm:mr-2">
                <input
                  key={name + 'in' + index}
                  className={`${baseInputClasses} text-sm file:mr-2 file:rounded-lg file:border-0 file:bg-blue-50 file:px-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 sm:text-base sm:file:mr-4 sm:file:px-4 sm:file:text-sm`}
                  placeholder={placeholder}
                  type={type}
                  name={name + index}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const updatedData = [...inputFields];
                        updatedData[index] = reader.result?.toString() || '';
                        setInputFields(updatedData);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => removeInputField(index)}
                className="p-0.5 text-red-500 transition-colors duration-200 hover:text-red-700 sm:p-1"
                aria-label={`Delete ${name}`}
                tabIndex={-1}
              >
                <MdDeleteOutline className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {data && (
              <div className="relative mt-1 sm:mt-2">
                <Image
                  alt={`Ausgewähltes ${name}`}
                  src={data}
                  width={500}
                  height={300}
                  className="w-full"
                />
                <div className="mt-1 sm:mt-2">
                  <InputField
                    className={`${baseInputClasses} bg-white text-sm sm:text-base`}
                    placeholder={tForm('copyright.placeholder')}
                    type="text"
                    name={`copyright_${name}${index}`}
                    value={copyrightFields[index]}
                    onChange={(e) => handleCopyrightChange(index, e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>
        ))
      ) : type === 'radio' ? (
        inputFields.map((d, index) => (
          <div key={name + index} className="mb-1 flex items-center sm:mb-2">
            <div className="flex-grow">
              {choices?.map((choice, i) => (
                <div key={name + d + index + choice + i} className="text-sm sm:text-base">
                  <input
                    type="radio"
                    id={choice + index}
                    name={tForm('building.accessibility.wheelchairAccessible.label') + index}
                    value={choice}
                  />
                  <label htmlFor={choice + index} className="ml-1 sm:ml-2">
                    {choice}
                  </label>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => removeInputField(index)}
              className="ml-1 p-0.5 text-red-500 transition-colors duration-200 hover:text-red-700 sm:ml-2 sm:p-1"
              aria-label={`Delete ${name}`}
              tabIndex={-1}
            >
              <MdDeleteOutline className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        ))
      ) : type === 'richtext' ? (
        <div className="flex items-center">
          <div className="flex-grow">
            <input
              key={name}
              className={`${baseInputClasses} bg-white text-sm sm:text-base`}
              placeholder={placeholder}
              type="text"
              defaultValue={value || ''}
              onChange={onChange}
            />
            {children}
          </div>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="ml-1 p-0.5 text-red-500 transition-colors duration-200 hover:text-red-700 sm:ml-2 sm:p-1"
              aria-label={`Delete ${name}`}
              tabIndex={-1}
            >
              <MdDeleteOutline className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>
      ) : (
        <>
          {inputFields.map((d, index) => (
            <div key={name + 'in' + index} className="mb-2 flex flex-col sm:mb-4">
              <div className="mb-1 flex items-center sm:mb-2">
                <InputField
                  className={`${baseInputClasses} ${
                    error ? 'border-red-500' : 'bg-white'
                  } mr-1 flex-grow text-sm sm:mr-2 sm:text-base`}
                  placeholder={placeholder}
                  type={type}
                  name={name + index}
                  value={d}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  {...(type === 'number' ? { min: '0' } : {})}
                />
                {property.unit && (
                  <label className="ml-1 text-sm text-gray-600 sm:ml-2 sm:text-base">
                    {property.unit}
                  </label>
                )}
                {name !== tForm('nameDetails.officialName.label') && (
                  <button
                    type="button"
                    onClick={() => removeInputField(index)}
                    className="ml-1 p-0.5 text-red-500 transition-colors duration-200 hover:text-red-700 sm:ml-2 sm:p-1"
                    aria-label={`Delete ${name}`}
                    tabIndex={-1}
                  >
                    <MdDeleteOutline className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {error && (
            <p className="mb-1 mt-0.5 text-xs text-red-500 sm:mb-2 sm:mt-1 sm:text-sm">{error}</p>
          )}
        </>
      )}
      {renderSourceButtons()}
      {showSourcePopup && (
        <SourcePopup
          onSubmit={handleSubmit}
          isOpen={showSourcePopup}
          onClose={() => setShowSourcePopup(false)}
          currentSource={previewSource}
        />
      )}
    </div>
  );
};

export default Field;

type SourceButtonsProps = {
  setShowSourcePopup: (value: boolean) => void;
  previewSource: string;
  handleRemoveSource: () => void;
};

const SourceButtons: React.FC<SourceButtonsProps> = ({
  setShowSourcePopup,
  previewSource,
  handleRemoveSource,
}) => {
  const tSourcePopup = useTranslations('SourcePopup');
  return (
    <div className="flex gap-1 sm:gap-2">
      <Button
        variant="default"
        size="icon"
        className="w-full px-4 text-xs sm:px-8 sm:text-sm"
        onClick={() => setShowSourcePopup(true)}
        type="button"
      >
        <span>{previewSource ? tSourcePopup('editSource') : tSourcePopup('addSource')}</span>
      </Button>
      {previewSource && (
        <Button
          variant="default"
          size="icon"
          className="w-full px-4 text-xs sm:px-8 sm:text-sm"
          onClick={handleRemoveSource}
          type="button"
        >
          <span>{tSourcePopup('removeSource')}</span>
        </Button>
      )}
    </div>
  );
};
