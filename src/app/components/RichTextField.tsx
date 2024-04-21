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
export type RichTextFieldProps = FieldProps & {
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
  property,
  updateContent,
  onDelete
}) => {
  const [content, setContent] = useState("");

  /**
   * Method for handling changes of the richtext
   * @param content Richtext
   */
  const handleChange = (content: string) => {
    setContent(content);
    updateContent(property.name, content); // Update parent component's state
  };

  return (
    <div className="my-10" key={"div"+property.name}>
      <Field property={{name: "Abschnittstitel", type: "text", placeholder: "Abschnittstitel eingeben", unique: true}} 
             onDelete={onDelete} 
             key={"field"+property.name}>
        <ReactQuill
          key={"quill"+property.name}
          theme="snow"
          value={content}
          onChange={handleChange}
          style={{ height: "400px" }}
        />
      </Field>
    </div>
  );
};

export default RichTextField;
