import React from "react";

export interface FieldProps {
  name: string;
  type: string;
}

const Field: React.FC<FieldProps> = ({ name, type }) => {
  const baseInputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-300 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-sm text-gray-700 focus:shadow-md";

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {name}
      </label>
      {type === "file" ? (
        //special button customization
        <input
          type="file"
          name={name}
          className={`${baseInputClasses} file:mr-4  file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
        />
      ) : (
        <input
          className={`${baseInputClasses} bg-white `}
          type={type}
          name={name}
        />
      )}
    </div>
  );
};

export default Field;
