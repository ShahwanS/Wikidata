"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import Image from "next/image";
import { InputField } from "@/components/ui/input";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { LucideInfo } from "lucide-react";
import { Button } from "./ui/button";
import SourcePopup from "./SourcePopup";
import { useTranslations } from "next-intl";
import { Property } from "@/types/property";
import { useSource } from "@/context/SourceContext";
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
const Field: React.FC<FieldProps> = ({
  property,
  onChange,
  onDelete,
  children,
  error,
}) => {
  const {
    name,
    type,
    placeholder,
    wikidataprop,
    value,
    choices,
    unique,
    infobox,
  } = property;
  const tForm = useTranslations("form");
  const [inputFields, setInputFields] = useState<string[]>(value || [""]);
  const [showSourcePopup, setShowSourcePopup] = useState(false);
  const [previewSource, setPreviewSource] = useState<string>("");
  const tSourcePopup = useTranslations("SourcePopup");
  const { handleSourceSubmit, sources } = useSource();
  const baseInputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-300 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-sm text-gray-700 focus:shadow-md";

  useEffect(() => {
    if (wikidataprop && sources[wikidataprop]) {
      setPreviewSource(sources[wikidataprop]);
    }
  }, [sources, wikidataprop]);

  const addInputField = () => setInputFields([...inputFields, ""]);

  const removeInputField = (index: number) => {
    if (inputFields.length > 1) {
      setInputFields(inputFields.filter((_, i) => i !== index));
    } else {
      onDelete?.();
    }
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
    setPreviewSource("");
    if (wikidataprop) {
      handleSourceSubmit?.(wikidataprop, "");
    }
  };

  const tooltipId = `tooltip-${name}`;

  const renderSourcePreview = () => {
    return (
      previewSource && (
        <div className="bg-gray-200 p-2 rounded-md shadow-md my-3">
          <div className="text-gray-600 bg-white p-2 rounded-md max-h-48 overflow-y-auto flex flex-col justify-center items-center">
            <p className="text-gray-700 font-semibold mb-2">
              {tSourcePopup("sourceLabel")}:
            </p>
            {previewSource
              .split("Additional References:")
              .map((part, index) => (
                <div key={index} className={index === 1 ? "mt-3" : ""}>
                  {index === 1 && (
                    <p className="text-gray-700 font-semibold mb-2">
                      {tSourcePopup("referencesLabel")}:
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-center">
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
    <div className="mt-4">
      {type !== "richtext" && (
        <SourceButtons
          setShowSourcePopup={setShowSourcePopup}
          previewSource={previewSource}
          handleRemoveSource={handleRemoveSource}
        />
      )}
    </div>
  );

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          {name}
          {wikidataprop && (
            <span className="ml-2 text-xs text-gray-500">
              (
              <a
                href={`https://www.wikidata.org/wiki/Property:${wikidataprop}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
              className="p-1 ml-2 text-green-600 hover:text-green-800 transition-colors duration-200"
              tabIndex={-1}
            >
              <CiCirclePlus size="20px" />
            </button>
          )}
        </label>
        <div className="flex flex-col items-center">
          <LucideInfo
            size={16}
            data-tooltip-id={tooltipId}
            className="text-blue-500 mr-2"
          />
          <ReactTooltip id={tooltipId} place="left" content={infobox} />
        </div>
      </div>
      {renderSourcePreview()}
      {type === "file" ? (
        inputFields.map((data, index) => (
          <div key={name + "in" + index} className="flex items-center mb-4">
            <div className="flex-grow mr-2">
              <input
                className={`${baseInputClasses} file:mr-4 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                placeholder={placeholder}
                type={type}
                name={name + index}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const updatedData = [...inputFields];
                      updatedData[index] = reader.result?.toString() || "";
                      setInputFields(updatedData);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {data && (
                <Image
                  alt={`Ausgewähltes ${name}`}
                  src={data}
                  width={500}
                  height={300}
                  className="mt-2"
                />
              )}
            </div>
            {inputFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeInputField(index)}
                className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                aria-label={`Delete ${name}`}
                tabIndex={-1}
              >
                <MdDeleteOutline size="20px" />
              </button>
            )}
          </div>
        ))
      ) : type === "radio" ? (
        inputFields.map((d, index) => (
          <div key={name + index} className="flex items-center mb-2">
            <div className="flex-grow">
              {choices?.map((choice, i) => (
                <div key={name + d + index + choice + i}>
                  <input
                    type="radio"
                    id={choice + index}
                    name={
                      tForm(
                        "building.accessibility.wheelchairAccessible.label"
                      ) + index
                    }
                    value={choice}
                  />
                  <label htmlFor={choice + index} className="ml-2">
                    {choice}
                  </label>
                </div>
              ))}
            </div>
            {inputFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeInputField(index)}
                className="p-1 ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                aria-label={`Delete ${name}`}
                tabIndex={-1}
              >
                <MdDeleteOutline size="20px" />
              </button>
            )}
          </div>
        ))
      ) : type === "richtext" ? (
        <>
          <input
            key={name}
            className={`${baseInputClasses} bg-white`}
            placeholder={placeholder}
            type="text"
            defaultValue={value || ""}
            onChange={onChange}
          />
          {children}
        </>
      ) : (
        <>
          {inputFields.map((d, index) => (
            <div key={name + "in" + index} className="flex flex-col mb-4">
              <div className="flex items-center mb-2">
                <InputField
                  className={`${baseInputClasses} ${
                    error ? "border-red-500" : "bg-white"
                  } mr-2 flex-grow`}
                  placeholder={placeholder}
                  type={type}
                  name={name + index}
                  value={d}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  {...(type === "number" ? { min: "0" } : {})}
                />
                {property.unit && (
                  <label className="text-gray-600 ml-2">{property.unit}</label>
                )}
                {name !== tForm("nameDetails.officialName.label") && (
                  <button
                    type="button"
                    onClick={() => removeInputField(index)}
                    className="p-1 ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                    aria-label={`Delete ${name}`}
                    tabIndex={-1}
                  >
                    <MdDeleteOutline size="20px" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {error && <p className="text-red-500 text-sm mt-1 mb-2">{error}</p>}
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
  const tSourcePopup = useTranslations("SourcePopup");
  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        size="icon"
        className="px-8 w-full"
        onClick={() => setShowSourcePopup(true)}
        type="button"
      >
        <span className="text-sm">
          {previewSource
            ? tSourcePopup("editSource")
            : tSourcePopup("addSource")}
        </span>
      </Button>
      {previewSource && (
        <Button
          variant="default"
          size="icon"
          className="px-8 w-full"
          onClick={handleRemoveSource}
          type="button"
        >
          <span className="text-sm">{tSourcePopup("removeSource")}</span>
        </Button>
      )}
    </div>
  );
};
