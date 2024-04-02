"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Field, { FieldProps } from "./Field";
// Import the CSS directly; Next.js handles this for both server and client-side
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  loading: () => <p>Loading editor...</p>,
});

export interface RichTextFieldProps {
  name: string;
  wikiDataProp?: string;
  updateContent: (name: string, content: string) => void;
}

const RichTextField: React.FC<RichTextFieldProps> = ({
  name,
  updateContent,
}) => {
  const [content, setContent] = useState("");

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
