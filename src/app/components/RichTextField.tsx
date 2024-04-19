"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Field, { FieldProps } from "./Field";
// Import the CSS directly; Next.js handles this for both server and client-side
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  loading: () => <p>Loading editor...</p>,
});

/**  Defines the parameters needed to generate a React component with richtext. */
export interface RichTextFieldProps {
  /** name of the richtext property */
  name: string;
  wikiDataProp?: string;
  /**
   * Method that is called when the richtext changes
   * @param name name of the richtextproperty
   * @param content content of the richtext field
   */
  updateContent: (name: string, content: string) => void;
}

/**
 * React component for generating a richtextfield
 * @param param0 Object with the parameters for the richtextfield
 */
const RichTextField: React.FC<RichTextFieldProps> = ({
  name,
  updateContent,
}) => {
  const [content, setContent] = useState("");

  /**
   * Method for handling changes of the richtext
   * @param content Richtext
   */
  const handleChange = (content: string) => {
    setContent(content);
    updateContent(name, content); // Update parent component's state
  };

  return (
    <div className="my-10">
      <Field
        name="Abschnittstitel"
        type="text"
        placeholder="Abschnittstitel eingeben"
      />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        style={{ height: "400px" }}
      />
    </div>
  );
};

export default RichTextField;
