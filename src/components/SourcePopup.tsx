'use client';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSource } from '@/context/SourceContext';
interface SourcePopupProps {
  onSubmit: (source: string) => void;
  isOpen: boolean;
  onClose: () => void;
  currentSource: string;
}

const SourcePopup: React.FC<SourcePopupProps> = ({ onSubmit, isOpen, onClose, currentSource }) => {
  const [source, setSource] = useState('');
  const [references, setReferences] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const t = useTranslations('SourcePopup');
  const { uniqueSources } = useSource();
  
  useEffect(() => {
    if (isOpen) {
      if (currentSource) {
        const [mainSource, additionalReferences] = currentSource.split(t('referencesLabel') + ':');
        setSource(mainSource.trim());
        setReferences(additionalReferences ? additionalReferences.trim() : '');
      } else {
        setSource('');
        setReferences('');
      }
      setSelectedSource('');
    }
  }, [currentSource, isOpen, t]);

  const handleSubmit = () => {
    const combinedSource = `${source}\n\n${t('referencesLabel')}:\n${references}`.trim();
    onSubmit(combinedSource);
    onClose();
  };

  const handleSourceSelect = (value: string) => {
    setSelectedSource(value);
    //seperate the source from the references
    const [mainSource, additionalReferences] = value.split(`${t('referencesLabel')}:`);
    setSource(mainSource.trim());
    setReferences(additionalReferences ? additionalReferences.trim() : '');
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="sm:max-w-[425px]">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">
            {currentSource ? t('editSource') : t('addSource')}
          </DrawerTitle>
          <DrawerDescription>
            {currentSource ? t('editDescription') : t('addDescription')}
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 p-4">
          {Object.keys(uniqueSources).length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">{t('selectSource')}</label>
              <Select onValueChange={handleSourceSelect} value={selectedSource}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder={t('selectSource')} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(uniqueSources).map(([fieldName, existingSource]) => {
                  const [mainSource, additionalReferences] = existingSource.split(
                    `${t('referencesLabel')}:`,
                  );
                  const displayText = `${mainSource.trim().substring(0, 50)}${
                    mainSource.length > 50 ? '...' : ''
                  }\n${
                    additionalReferences
                      ? `${t('referencesLabel')}: ${additionalReferences.trim().substring(0, 50)}${
                          additionalReferences.length > 50 ? '...' : ''
                        }`
                      : ''
                  }`;
                  return (
                    <SelectItem key={fieldName} value={existingSource}>
                        <div className="whitespace-pre-wrap">{displayText}</div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
          </div>
            )}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700">
              {t('sourceLabel')}
            </label>
            <input
              id="source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={t('sourcePlaceholder')}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="references" className="block text-sm font-medium text-gray-700">
              {t('referencesLabel')}
            </label>
            <textarea
              id="references"
              rows={3}
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              placeholder={t('referencesPlaceholder')}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            ></textarea>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleSubmit} className="w-full text-white">
            {t('submit')}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose} className="mt-2 w-full">
              {t('cancel')}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SourcePopup;
