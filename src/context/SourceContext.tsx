'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

/**
 * Type definition for the source context value
 */
type SourceContextType = {
  /** Object mapping field names to their source strings */
  sources: Record<string, string>;
  /** Array of unique source strings across all fields */
  uniqueSources: string[];
  /** Function to update the sources state */
  setSources: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  /** Function to add or update a source for a field */
  handleSourceSubmit: (fieldName: string, source: string) => void;
  /** Function to remove a source for a field */
  handleRemoveSource: (fieldName: string) => void;
};

/** Context for managing sources across the application */
const SourceContext = createContext<SourceContextType | undefined>(undefined);

/**
 * Provider component that manages source state and makes it available to child components
 */
export const SourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for storing sources mapped to field names
  const [sources, setSources] = useState<Record<string, string>>({});
  // State for storing unique source strings
  const [uniqueSources, setUniqueSources] = useState<string[]>([]);

  // Update uniqueSources whenever sources change
  useEffect(() => {
    const allSources = Object.values(sources);
    const uniqueSet = new Set(allSources);
    setUniqueSources(Array.from(uniqueSet));
  }, [sources]);

  /**
   * Adds or updates a source for a field
   * @param fieldName - The name of the field to update
   * @param source - The source string to associate with the field
   */
  const handleSourceSubmit = (fieldName: string, source: string) => {
    setSources((prev) => {
      const newSources = { ...prev };
      if (source === '') {
        delete newSources[fieldName];
      } else {
        newSources[fieldName] = source;
      }
      return newSources;
    });
  };

  /**
   * Removes a source for a field
   * @param fieldName - The name of the field to remove the source from
   */
  const handleRemoveSource = (fieldName: string) => {
    setSources((prev) => {
      const newSources = { ...prev };
      delete newSources[fieldName];
      newSources;
      return newSources;
    });
  };

  return (
    <SourceContext.Provider
      value={{
        sources,
        handleSourceSubmit,
        handleRemoveSource,
        uniqueSources,
        setSources,
      }}
    >
      {children}
    </SourceContext.Provider>
  );
};

/**
 * Hook to access the source context
 * @throws Error if used outside of SourceProvider
 * @returns The source context value
 */
export const useSource = () => {
  const context = useContext(SourceContext);
  if (context === undefined) {
    throw new Error('useSource must be used within a SourceProvider');
  }
  return context;
};
