// Use 'use client' directive to indicate that this component is meant for client-side execution
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Import the CSS directly; Next.js handles this for both server and client-side
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false, // Disable server-side rendering for ReactQuill
  loading: () => <p>Loading editor...</p>, // Optional loading component
});

export interface RichTextFieldProps {
  name: string;
}

const RichTextField: React.FC<RichTextFieldProps> = ({ name }) => {
  const [content, setContent] = useState("");

  return (
    <div className="my-10">
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
