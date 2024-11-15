'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="mx-auto max-w-[425px] bg-accent p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-primary-dark">
            {currentSource ? t('editSource') : t('addSource')}
          </DialogTitle>
          <DialogDescription className="mt-2 text-primary-medium">
            {currentSource ? t('editDescription') : t('addDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {Object.keys(uniqueSources).length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-primary-dark">
                {t('selectSource')}
              </label>
              <Select onValueChange={handleSourceSelect} value={selectedSource}>
                <SelectTrigger className="w-full border-primary-light/30 bg-accent text-primary-dark">
                  <SelectValue placeholder={t('selectSource')} />
                </SelectTrigger>
                <SelectContent className="bg-accent">
                  {/* ... (SelectContent remains the same) ... */}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-primary-dark">
              {t('sourceLabel')}
            </label>
            <input
              id="source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={t('sourcePlaceholder')}
              className="mt-1 block w-full rounded-md border border-primary-light/30 bg-accent px-3 py-2 text-primary-dark shadow-sm placeholder:text-primary-medium/70 focus:border-primary-medium focus:outline-none focus:ring-1 focus:ring-primary-medium"
            />
          </div>
          <div>
            <label htmlFor="references" className="block text-sm font-medium text-primary-dark">
              {t('referencesLabel')}
            </label>
            <textarea
              id="references"
              rows={3}
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              placeholder={t('referencesPlaceholder')}
              className="mt-1 block w-full rounded-md border border-primary-light/30 bg-accent px-3 py-2 text-primary-dark shadow-sm placeholder:text-primary-medium/70 focus:border-primary-medium focus:outline-none focus:ring-1 focus:ring-primary-medium"
            ></textarea>
          </div>
        </div>
        <DialogFooter className="flex-col space-y-2 sm:space-x-2">
          <div className="flex w-full justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 border-primary-light/30 text-primary-dark hover:bg-primary-light/10"
            >
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-primary-medium text-accent hover:bg-primary-dark"
            >
              {t('submit')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SourcePopup;
