import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
export interface FieldProps {
  name: string;
  type: string;
  placeholder?: string;
  onDelete?: () => void;
}

const Field: React.FC<FieldProps> = ({ name, type, onDelete, placeholder }) => {
  const [fields, setFields] = useState<String[]>([]);
  const baseInputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-300 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-sm text-gray-700 focus:shadow-md";

  const addfield = () => {
    setFields([...fields, `Field ${fields.length + 1}`]);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {name}
        </label>
        <div>
          <button
            onClick={onDelete}
            className="ml-2 text-red-500 hover:text-red-700"
            aria-label={`Delete ${name}`}
          >
            <MdDeleteOutline size="20px" />
          </button>
          <button
            onClick={addfield}
            className="ml-2 text-green-800 hover:opacity-40"
          >
            <CiCirclePlus size="20px" />
          </button>
        </div>
      </div>
      {type === "file" ? (
        //special button customization
        <input
          type="file"
          name={name}
          className={`${baseInputClasses} file:mr-4  file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
        />
      ) : (
        <>
          <div>
            <input
              className={`${baseInputClasses} bg-white`}
              placeholder={placeholder}
              type={type}
              name={name}
            />
          </div>
          <div>
            {fields.map((field, index) => (
              <input
                key={index}
                className={`${baseInputClasses} bg-white mt-2`}
                placeholder={`Additional property ${index + 1}`}
                type={type}
                name={`${name}_${index}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export default Field;
