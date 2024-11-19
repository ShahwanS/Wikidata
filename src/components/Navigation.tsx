'use client';

import { useTranslations } from 'next-intl';
import LocaleSwitcher from '../components/LocaleSwitcher';
import { useState } from 'react';
import { X, Menu } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ResetFormPopup } from './ui/resetFormPopup';
import Image from 'next/image';
import logo from '../public/logo.png';

interface NavigationProps {
  onLoadExamples?: () => void;
}

export default function Navigation({ onLoadExamples }: NavigationProps) {
  const t = useTranslations('initial');
  const [showFAQ, setShowFAQ] = useState(false);
  const [showLoadExampleModal, setShowLoadExampleModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="bg-gradient-to-r from-primary-dark to-primary-medium shadow-lg">
      <nav className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-accent p-1">
                <Image
                  src={logo}
                  alt="Logo"
                  width={48}
                  height={48}
                  className="h-8 w-8 sm:h-12 sm:w-12"
                />
              </div>
              <h1 className="text-xl font-extrabold tracking-wide text-accent sm:text-2xl md:text-3xl">
                {t('form.title')}
              </h1>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-accent md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div
            className={`${
              isMobileMenuOpen ? 'flex' : 'hidden'
            } mt-4 flex-col space-y-4 md:mt-0 md:flex md:flex-row md:items-center md:space-x-4 md:space-y-0`}
          >
            <button
              onClick={() => setShowLoadExampleModal(true)}
              className="w-full rounded-lg bg-accent px-4 py-2 text-center font-semibold text-primary-dark transition-colors hover:bg-primary-light hover:text-accent md:w-auto"
            >
              {t('form.loadExampleData')}
            </button>
            <button
              onClick={() => setShowFAQ(true)}
              className="w-full rounded-lg bg-accent px-4 py-2 text-center font-semibold text-primary-dark transition-colors hover:bg-primary-light hover:text-accent md:w-auto"
            >
              FAQ
            </button>
            <div className="flex justify-center md:justify-start">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* FAQ Modal */}
      {showFAQ && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFAQ(false);
            }
          }}
        >
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-accent">
            <div className="space-y-6 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary-dark sm:text-2xl">
                  {t('faq.title')}
                </h2>
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
                    className="border-b border-primary-light/20"
                  >
                    <AccordionTrigger className="text-sm text-primary-dark hover:text-primary-medium sm:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-primary-medium sm:text-base">
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
