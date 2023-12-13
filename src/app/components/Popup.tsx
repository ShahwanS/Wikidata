import React, { useState } from "react";
import { FieldProps } from "./Field";

interface PopupProps {
  onAddFields: (fields: FieldProps[]) => void;
  onClose: () => void;
}

interface Category {
  title: string;
  description: string;
}

interface Properties {
  [key: string]: string[];
}

const Popup: React.FC<PopupProps> = ({ onAddFields, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const categories: Record<string, Category> = {
    Architecture: {
      title: "Architecture",
      description:
        "Architectural style, width, length, number of elevators, etc.",
    },
    Ordering: {
      title: "Ordering",
      description:
        "Properties like 'has part(s)', 'connects with', 'Commons category', etc.",
    },
    Geographic: {
      title: "Geographic",
      description:
        "Properties related to location such as 'located on street', 'country', etc.",
    },
    HeadData: {
      title: "Head Data",
      description: "Inception, structure replaces, named after, etc.",
    },
    Corporation: {
      title: "Corporation",
      description:
        "Information about maintenance, occupants, main building contractor, etc.",
    },

    Media: {
      title: "Media",
      description: "Media related properties such as images.",
    },
  };

  const properties: Properties = {
    Architecture: [
      "Architectural Style",
      "Width",
      "Length",
      "Number of Elevators",
      "Number of Rooms",
      "floors below ground",
      "floors above ground",
      "inspired by",
      "area",
      "height",
      "wheelchair accesbility",
      "made from material",
    ],
    Ordering: [
      "Has Part(s)",
      "Connects With",
      "Commons Category",
      "instance of",
      "appears in the heritage register",
      "part of",
      "heritage designation",
    ],
    Geographic: [
      "Located On Street",
      "location",
      "located in time zone",
      "street address",
      "postal code",
      "coordinate location",
    ],
    HeadData: [
      "Inception",
      "Structure Replaces",
      "Named After",
      "nickname",
      "state of conservation",
      "has use",
      "significant event",
      "short name",
      "founded by",
      "conmmisioned by",
      "architect",
    ],
    Corporation: [
      "Maintained By",
      "Occupant",
      "Main Building Contractor",
      "operator",
      "main contractor",
    ],
    Media: ["Image of Backside"],
  };

  const propertyInputTypes: Record<string, string> = {
    "Architectural Style": "text",
    Width: "number",
    Length: "number",
    "Number of Elevators": "number",
    "Number of Rooms": "number",
    "floors below ground": "number",
    "floors above ground": "number",
    "inspired by": "text",
    area: "number",
    height: "number",
    "wheelchair accessibility": "text",
    "made from material": "text",
    "Has Part(s)": "text",
    "Connects With": "text",
    "Commons Category": "text",
    "instance of": "text",
    "appears in the heritage register": "text",
    "part of": "text",
    "heritage designation": "text",
    "Located On Street": "text",
    location: "text",
    "located in time zone": "text",
    "street address": "text",
    "postal code": "text",
    "coordinate location": "text",
    Inception: "date",
    "Structure Replaces": "text",
    "Named After": "text",
    nickname: "text",
    "state of conservation": "text",
    "has use": "text",
    "significant event": "text",
    "short name": "text",
    "founded by": "text",
    "commissioned by": "text",
    architect: "text",
    "Maintained By": "text",
    Occupant: "text",
    "Main Building Contractor": "text",
    operator: "text",
    "main contractor": "text",
    "Image of Backside": "file",
    Title: "text",
  };

  const getInputTypeForProperty = (property: string): string => {
    return propertyInputTypes[property] || "text";
  };

  //loading Properties based on Category
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setStep(2);
  };

  // add or remove property from selected properties
  const handlePropertySelect = (property: string) => {
    if (selectedProperties.includes(property)) {
      setSelectedProperties(selectedProperties.filter((p) => p !== property));
    } else {
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  // Create fields based on selected properties
  const handleSubmit = () => {
    const fields = selectedProperties.map((property) => ({
      name: property,
      type: getInputTypeForProperty(property),
    }));
    onAddFields(fields);
    onClose();
  };

  return (
    <div className="popup fixed inset-0 bg-gray-700 bg-opacity-75 overflow-y-auto h-full w-full">
      <div className="relative top-10 mx-auto p-8 border w-3/4 max-w-6xl shadow-xl rounded-lg bg-white">
        {/* Category Selection */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Select a Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.values(categories).map((category) => (
                <div
                  key={category.title}
                  className="flex flex-col border p-4 rounded-lg shadow-sm transition duration-300 h-full hover:border-gray-800 hover:shadow-md"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-1">
                      {category.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCategorySelect(category.title)}
                    className="px-4 py-2 w-full text-white bg-gray-800 hover:bg-gray-900 rounded-md transition duration-300 self-end"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Property Selection */}
        {step === 2 && selectedCategory && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Select Properties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties[selectedCategory]?.map((property) => (
                <div key={property} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(property)}
                    onChange={() => handlePropertySelect(property)}
                    className="form-checkbox h-5 w-5 text-gray-600 rounded-md border-gray-300 focus:ring-gray-500 mr-2"
                  />
                  <span className="text-gray-700">{property}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-md shadow transition duration-300 mt-6"
            >
              Add Fields
            </button>
          </div>
        )}
        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default Popup;
