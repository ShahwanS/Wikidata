import { useState } from "react";

export function useSource(setShowResetModal: any) {
  const [sources, setSources] = useState<Record<string, string>>({});

  const handleSourceSubmit = (fieldName: string, source: string) => {
    setSources((prev) => {
      const newSources = { ...prev };
      if (source === "") {
        delete newSources[fieldName]; // Remove the source if it is empty
      } else {
        newSources[fieldName] = source; // Add or update the source
      }
      return newSources;
    });

  };


    /**
   * Handles resetting the whole page
   * This function handles resetting the whole page.
   */
    const handleReset = () => {
      setShowResetModal(true);
    };
  return { sources, setSources, handleSourceSubmit, handleReset };
}