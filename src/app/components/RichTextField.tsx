"use client";

import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";

export interface RichTextFieldProps {
  name: string;
}

const RichTextField: React.FC<RichTextFieldProps> = ({ name }) => {
  const [content, setContent] = useState("");

  // Only load the editor when in the browser environment
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("react-quill/dist/quill.snow.css");
    }
  }, []);

  return (
    <div className="mb-6">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        style={{ height: "400px" }}
      />
    </div>
  );
};

export default RichTextField;
