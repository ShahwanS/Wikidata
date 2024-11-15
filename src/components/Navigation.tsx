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
import { ResetFormPopup } from './ui/resetFormPopup';

interface NavigationProps {
  onLoadExamples?: () => void;
}

export default function Navigation({ onLoadExamples }: NavigationProps) {
  const t = useTranslations('initial');
  const [showFAQ, setShowFAQ] = useState(false);
  const [showLoadExampleModal, setShowLoadExampleModal] = useState(false);

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
    <header className="from-primary-dark to-primary-medium bg-gradient-to-r shadow-lg">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-3xl font-extrabold tracking-wide text-accent">{t('form.title')}</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLoadExampleModal(true)}
            className="text-primary-dark hover:bg-primary-light rounded-lg bg-accent px-4 py-2 font-semibold transition-colors hover:text-accent"
          >
            {t('form.loadExampleData')}
          </button>
          <button
            onClick={() => setShowFAQ(true)}
            className="text-primary-dark hover:bg-primary-light rounded-lg bg-accent px-4 py-2 font-semibold transition-colors hover:text-accent"
          >
            FAQ
          </button>
          <LocaleSwitcher />
        </div>
      </nav>

      {/* FAQ Modal */}
      {showFAQ && (
        <div
          className="bg-primary-dark/50 fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFAQ(false);
            }
          }}
        >
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-accent">
            <div className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-primary-dark text-2xl font-bold">{t('faq.title')}</h2>
                <button
                  onClick={() => setShowFAQ(false)}
                  className="text-primary-medium hover:text-primary-dark"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-primary-light/20 border-b"
                  >
                    <AccordionTrigger className="text-primary-dark hover:text-primary-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-primary-medium">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      )}
      {showLoadExampleModal && (
        <ResetFormPopup
          setShowResetModal={setShowLoadExampleModal}
          confirmReset={() => {
            onLoadExamples?.();
            setShowLoadExampleModal(false);
          }}
          title={t('form.LoadExample.title')}
          description={t('form.LoadExample.description')}
          cancel={t('form.LoadExample.cancel')}
          confirm={t('form.LoadExample.confirm')}
        />
      )}
    </header>
  );
}
