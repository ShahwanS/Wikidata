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
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Suggested improvements:
// 1. Split into smaller components (FileInput, RadioInput, etc)
// 2. Move styles to separate constants/CSS files
// 3. Add proper type safety instead of 'any' for error prop
// 4. Add proper validation handling
// 5. Consider using React Hook Form for form management
// 6. Add loading states for async operations
// 7. Add proper error boundaries
// 8. Consider using a design system for consistent styling
// 9. Add accessibility improvements (ARIA labels, keyboard navigation)
// 10. Add proper test coverage

export interface FieldProps {
  property: Property;
  onDelete?: () => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options?: Array<{ label: string; value: string }>;
  children?: ReactNode;
  showWikiProp?: boolean;
  error?: any; // TODO: Add proper type
}

const BASE_INPUT_CLASSES =
  'w-full px-4 py-2 border border-primary-light/30 rounded-lg transition duration-300 ease-in-out focus:border-primary-medium focus:ring-1 focus:ring-primary-medium focus:outline-none shadow-sm text-primary-dark focus:shadow-md';

/**
 * Field component that renders different types of input fields based on property type.
 * Supports text, number, file uploads, radio buttons, and rich text with source attribution.
 */
const Field: React.FC<FieldProps> = ({ property, onChange, onDelete, children, error }) => {
  const { name, type, placeholder, wikidataprop, value, choices, unique, infobox, unit } = property;
  const tForm = useTranslations('form');
  const tSourcePopup = useTranslations('SourcePopup');
  const { handleSourceSubmit, sources } = useSource();

  const CC_LICENSES = [
    { value: 'CC BY 4.0', label: 'CC BY 4.0', infobox: tForm('copyright.infobox1') },
    { value: 'CC BY-SA 4.0', label: 'CC BY-SA 4.0', infobox: tForm('copyright.infobox2') },
    { value: 'CC BY-NC 4.0', label: 'CC BY-NC 4.0', infobox: tForm('copyright.infobox3') },
    { value: 'CC BY-ND 4.0', label: 'CC BY-ND 4.0', infobox: tForm('copyright.infobox4') },
    { value: 'CC BY-NC-SA 4.0', label: 'CC BY-NC-SA 4.0', infobox: tForm('copyright.infobox5') },
    { value: 'CC BY-NC-ND 4.0', label: 'CC BY-NC-ND 4.0', infobox: tForm('copyright.infobox6') },
  ] as const;

  // State management
  const [inputFields, setInputFields] = useState<string[]>(value || ['']);
  const [showSourcePopup, setShowSourcePopup] = useState(false);
  const [previewSource, setPreviewSource] = useState<string>('');
  const [copyrightFields, setCopyrightFields] = useState<{ text: string; license: string }[]>(
    Array(inputFields.length).fill({ text: '', license: 'CC BY 4.0' }),
  );
  const [selectedUnits, setSelectedUnits] = useState<string[]>(() => {
    const defaultUnit = Array.isArray(unit) ? unit[0] : unit || '';
    return Array(inputFields.length).fill(defaultUnit);
  });

  // Load source from context when wikidataprop changes
  useEffect(() => {
    if (wikidataprop && sources[wikidataprop]) {
      setPreviewSource(sources[wikidataprop]);
    }
  }, [sources, wikidataprop]);

  const addInputField = () => {
    setInputFields([...inputFields, '']);
    setCopyrightFields([...copyrightFields, { text: '', license: 'CC BY 4.0' }]);
    const defaultUnit = Array.isArray(unit) ? unit[0] : unit || '';
    setSelectedUnits([...selectedUnits, defaultUnit]);
  };

  const removeInputField = (index: number) => {
    if (inputFields.length > 1) {
      setInputFields(inputFields.filter((_, i) => i !== index));
      setCopyrightFields(copyrightFields.filter((_, i) => i !== index));
      setSelectedUnits(selectedUnits.filter((_, i) => i !== index));
    } else {
      onDelete?.();
    }
  };

  const handleUnitChange = (index: number, newUnit: string) => {
    const newUnits = [...selectedUnits];
    newUnits[index] = newUnit;
    setSelectedUnits(newUnits);

    // Ensure the unit is sent with the value for fields with units
    if (Array.isArray(unit)) {
      onChange?.({
        target: {
          name: name + index,
          value: {
            value: inputFields[index],
            selectedUnit: newUnit,
          },
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleCopyrightChange = (index: number, field: 'text' | 'license', value: string) => {
    const newCopyrightFields = [...copyrightFields];
    newCopyrightFields[index] = {
      ...newCopyrightFields[index],
      [field]: value,
    };
    setCopyrightFields(newCopyrightFields);

    const combinedValue = JSON.stringify({
      text: newCopyrightFields[index].text || '',
      license: newCopyrightFields[index].license || '',
    });

    onChange?.({
      target: {
        name: `copyright_${name}${index}`,
        value: combinedValue,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleInputChange = (index: number, value: string) => {
    const newFields = [...inputFields];
    newFields[index] = value;
    setInputFields(newFields);

    if (Array.isArray(unit)) {
      onChange?.({
        target: {
          name: name + index,
          value: JSON.stringify({
            // We're stringifying here
            value: value,
            selectedUnit: selectedUnits[index],
          }),
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    } else {
      onChange?.({
        target: {
          name: name + index,
          value: value,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
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

  const handleFileChange = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const updatedData = [...inputFields];
      updatedData[index] = reader.result?.toString() || '';
      setInputFields(updatedData);
    };
    reader.readAsDataURL(file);
  };

  const renderSourcePreview = () => {
    if (!previewSource) return null;

    return (
      <div className="my-2 rounded-md bg-primary-light/10 p-1 shadow-md sm:my-3 sm:p-2">
        <div className="flex max-h-36 flex-col items-center justify-center overflow-y-auto rounded-md bg-accent p-1 text-primary-medium sm:max-h-48 sm:p-2">
          <p className="mb-1 text-sm font-semibold text-primary-dark sm:mb-2 sm:text-base">
            {tSourcePopup('sourceLabel')}:
          </p>
          {previewSource.split(`${tSourcePopup('referencesLabel')}:`).map((part, index) => (
            <div key={index} className={index === 1 ? 'mt-2 sm:mt-3' : ''}>
              {index === 1 && (
                <p className="mb-1 text-sm font-semibold text-primary-dark sm:mb-2 sm:text-base">
                  {tSourcePopup('referencesLabel')}:
                </p>
              )}
              <p className="whitespace-pre-wrap text-center text-sm text-primary-medium sm:text-base">
                {part.trim()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFileInput = (data: string, index: number) => (
    <div key={`${name}-in-${index}`} className="mb-2 sm:mb-4">
      <div className="flex items-center">
        <div className="mr-1 flex-grow sm:mr-2">
          <input
            className={`${BASE_INPUT_CLASSES} text-sm file:mr-2 file:rounded-lg file:border-0 file:bg-blue-50 file:px-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 sm:text-base sm:file:mr-4 sm:file:px-4 sm:file:text-sm`}
            placeholder={placeholder}
            type="file"
            name={name + index}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(index, file);
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => removeInputField(index)}
          className="ml-1 p-0.5 text-destructive transition-colors duration-200 hover:text-destructive/80 sm:ml-2 sm:p-2"
          aria-label={`Delete ${name}`}
        >
          <MdDeleteOutline className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {data && (
        <div className="relative mt-1 sm:mt-2">
          <Image alt={`Selected ${name}`} src={data} width={500} height={300} className="w-full" />
          <div className="mt-1 space-y-2 sm:mt-2">
            <InputField
              className={`${BASE_INPUT_CLASSES} bg-white text-sm placeholder:text-gray-400 sm:text-base`}
              placeholder={tForm('copyright.placeholder')}
              type="text"
              value={copyrightFields[index].text}
              onChange={(e) => handleCopyrightChange(index, 'text', e.target.value)}
              required
            />
            <input
              type="hidden"
              name={`copyright_${name}${index}`}
              value={JSON.stringify({
                text: copyrightFields[index].text || '',
                license: copyrightFields[index].license || '',
              })}
            />

            <div className="relative">
              <Select
                value={copyrightFields[index].license}
                onValueChange={(value) => handleCopyrightChange(index, 'license', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a license" />
                </SelectTrigger>
                <SelectContent>
                  {CC_LICENSES.map((license) => (
                    <SelectItem
                      key={license.value}
                      value={license.value}
                      data-tooltip-id={`license-tooltip-${license.value}`}
                      data-tooltip-content={license.infobox}
                    >
                      {license.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {CC_LICENSES.map((license) => (
                <ReactTooltip
                  key={`tooltip-${license.value}`}
                  id={`license-tooltip-${license.value}`}
                  place="right"
                  className="max-w-xs text-sm"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRadioInput = (d: string, index: number) => (
    <div key={name + index} className="mb-1 flex items-center sm:mb-2">
      <div className="flex-grow">
        {choices?.map((choice, i) => (
          <div key={name + d + index + choice + i} className="text-sm text-gray-800 sm:text-base">
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
        className="ml-1 p-0.5 text-destructive transition-colors duration-200 hover:text-destructive/80 sm:ml-2 sm:p-2"
        aria-label={`Delete ${name}`}
        tabIndex={-1}
      >
        <MdDeleteOutline className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  );

  const renderRichTextInput = () => (
    <div className="flex items-center">
      <div className="flex-grow">
        <input
          key={name}
          className={`${BASE_INPUT_CLASSES} ${
            error
              ? 'border-destructive bg-destructive/5 text-primary-dark placeholder-destructive/70'
              : 'bg-accent placeholder:text-gray-400'
          } mr-1 flex-grow text-sm sm:mr-2 sm:text-base`}
          placeholder={placeholder}
          type="text"
          defaultValue={value || ''}
          onChange={onChange}
        />
        <div className="mt-2 bg-accent text-primary-dark">{children}</div>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="ml-1 p-0.5 text-destructive transition-colors duration-200 hover:text-destructive/80 sm:ml-2 sm:p-2"
          aria-label={`Delete ${name}`}
          tabIndex={-1}
        >
          <MdDeleteOutline className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      )}
    </div>
  );

  const renderDefaultInput = (d: string, index: number) => (
    <div key={`${name}-in-${index}`} className="mb-2 flex flex-col sm:mb-4">
      <div className="mb-1 flex items-center sm:mb-2">
        <InputField
          className={`${BASE_INPUT_CLASSES} ${
            error
              ? 'border-destructive bg-destructive/5 text-primary-dark placeholder-destructive/70'
              : 'bg-accent placeholder:text-gray-400'
          } mr-1 flex-grow text-sm sm:mr-2 sm:text-base`}
          placeholder={placeholder}
          type={type}
          name={name + index}
          value={d}
          onChange={(e) => handleInputChange(index, e.target.value)}
          {...(type === 'number' ? { min: '0' } : {})}
        />
        {Array.isArray(unit) ? (
          <div className="w-[200px]">
            <input
              type="hidden"
              name={`${name}${index}_unit`}
              value={JSON.stringify({
                value: d,
                selectedUnit: selectedUnits[index],
              })}
            />
            <Select
              value={selectedUnits[index]}
              onValueChange={(value) => handleUnitChange(index, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {unit.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : unit ? (
          <label className="ml-1 text-sm text-primary-medium sm:ml-2 sm:text-base">{unit}</label>
        ) : null}
        {name !== tForm('nameDetails.officialName.label') && (
          <button
            type="button"
            onClick={() => removeInputField(index)}
            className="ml-1 p-0.5 text-destructive transition-colors duration-200 hover:text-destructive/80 sm:ml-2 sm:p-2"
            aria-label={`Delete ${name}`}
          >
            <MdDeleteOutline className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="mb-4 sm:mb-6" id={name}>
      <div className="mb-1 flex items-center justify-between sm:mb-2">
        <label className="flex items-center text-xs font-medium text-primary-dark sm:text-sm">
          {name}
          {wikidataprop && (
            <span className="ml-1 text-xs text-primary-medium/70 sm:ml-2">
              (
              <Link
                href={`https://www.wikidata.org/wiki/Property:${wikidataprop}`}
                target="_blank"
                className="text-primary-medium hover:text-primary-dark"
              >
                {wikidataprop}
              </Link>
              )
            </span>
          )}
          {!unique && (
            <button
              type="button"
              onClick={addInputField}
              className="ml-1 p-0.5 text-primary-medium transition-colors duration-200 hover:text-primary-dark sm:ml-2 sm:p-2"
              aria-label={`Add ${name}`}
            >
              <CiCirclePlus className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </label>
        <div className="flex flex-col items-center">
          <LucideInfo
            className="mr-1 h-4 w-4 text-blue-500 sm:mr-2 sm:h-5 sm:w-5"
            data-tooltip-id={`tooltip-${name}`}
          />
          <ReactTooltip id={`tooltip-${name}`} place="left" content={infobox} />
        </div>
      </div>

      {error && <p className="mb-1 mt-0.5 text-xs text-destructive sm:text-sm">{error}</p>}

      {renderSourcePreview()}

      {type === 'file' && inputFields.map((data, index) => renderFileInput(data, index))}
      {type === 'radio' && inputFields.map((d, index) => renderRadioInput(d, index))}
      {type === 'richtext' && renderRichTextInput()}
      {!['file', 'radio', 'richtext'].includes(type) &&
        inputFields.map((d, index) => renderDefaultInput(d, index))}

      {type !== 'richtext' && (
        <div className="mt-2 sm:mt-4">
          <SourceButtons
            setShowSourcePopup={setShowSourcePopup}
            previewSource={previewSource}
            handleRemoveSource={handleRemoveSource}
          />
        </div>
      )}

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

interface SourceButtonsProps {
  setShowSourcePopup: (value: boolean) => void;
  previewSource: string;
  handleRemoveSource: () => void;
}

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
