'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type SourceContextType = {
  sources: Record<string, string>;
  uniqueSources: string[];
  setSources: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleSourceSubmit: (fieldName: string, source: string) => void;
  handleRemoveSource: (fieldName: string) => void;
};

const SourceContext = createContext<SourceContextType | undefined>(undefined);

export const SourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sources, setSources] = useState<Record<string, string>>({});
  const [uniqueSources, setUniqueSources] = useState<string[]>([]);

  useEffect(() => {
    const allSources = Object.values(sources);
    const uniqueSet = new Set(allSources);
    setUniqueSources(Array.from(uniqueSet));
  }, [sources]);

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

export const useSource = () => {
  const context = useContext(SourceContext);
  if (context === undefined) {
    throw new Error('useSource must be used within a SourceProvider');
  }
  return context;
};
