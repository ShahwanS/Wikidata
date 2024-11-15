'use client';

import { useTranslations } from 'next-intl';
import LocaleSwitcher from '../components/LocaleSwitcher';
import { useState } from 'react';
import { X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Navigation() {
  const t = useTranslations('initial');
  const [showFAQ, setShowFAQ] = useState(false);

  const faqs = [
    {
      question: t('faq.dataSubmission.question'),
      answer: t('faq.dataSubmission.answer'),
    },
    {
      question: t('faq.sourceManagement.question'),
      answer: t('faq.sourceManagement.answer'),
    },
    {
      question: t('faq.fieldNavigation.question'),
      answer: t('faq.fieldNavigation.answer'),
    },
    {
      question: t('faq.imageUpload.question'),
      answer: t('faq.imageUpload.answer'),
    },
    {
      question: t('faq.addFields.question'),
      answer: t('faq.addFields.answer'),
    },
    {
      question: t('faq.saveChanges.question'),
      answer: t('faq.saveChanges.answer'),
    },
    {
      question: t('faq.resetForm.question'),
      answer: t('faq.resetForm.answer'),
    },
    {
      question: t('faq.richText.question'),
      answer: t('faq.richText.answer'),
    },
  ];

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-700 shadow-lg">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-3xl font-extrabold tracking-wide text-white">{t('form.title')}</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFAQ(true)}
            className="rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-500"
          >
            FAQ
          </button>
          <LocaleSwitcher />
        </div>
      </nav>

      {/* FAQ Modal */}
      {showFAQ && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFAQ(false);
            }
          }}
        >
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white">
            <div className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{t('faq.title')}</h2>
                <button
                  onClick={() => setShowFAQ(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
