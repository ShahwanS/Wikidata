"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface SourcePopupProps {
  onSubmit: (source: string) => void;
  isOpen: boolean;
  onClose: () => void;
  currentSource: string;
}

const SourcePopup: React.FC<SourcePopupProps> = ({
  onSubmit,
  isOpen,
  onClose,
  currentSource,
}) => {
  const [source, setSource] = useState("");
  const [references, setReferences] = useState("");
  const t = useTranslations("SourcePopup");
  useEffect(() => {
    if (isOpen) {
      if (currentSource) {
        const [mainSource, additionalReferences] = currentSource.split(
          "Additional References:"
        );
        setSource(mainSource.trim());
        setReferences(additionalReferences ? additionalReferences.trim() : "");
      } else {
        setSource("");
        setReferences("");
      }
    }
  }, [currentSource, isOpen]);

  const handleSubmit = () => {
    const combinedSource = `${source}\n\n${t(
      "referencesLabel"
    )}:\n${references}`.trim();
    onSubmit(combinedSource);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="sm:max-w-[425px]">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">
            {currentSource ? t("editSource") : t("addSource")}
          </DrawerTitle>
          <DrawerDescription>
            {currentSource ? t("editDescription") : t("addDescription")}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div>
            <label
              htmlFor="source"
              className="block text-sm font-medium text-gray-700"
            >
              {t("sourceLabel")}
            </label>
            <input
              id="source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={t("sourcePlaceholder")}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="references"
              className="block text-sm font-medium text-gray-700"
            >
              {t("referencesLabel")}
            </label>
            <textarea
              id="references"
              rows={3}
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              placeholder={t("referencesPlaceholder")}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleSubmit} className="w-full text-white">
            {t("submit")}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose} className="w-full mt-2">
              {t("cancel")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SourcePopup;
