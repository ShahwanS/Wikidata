'use client';
import React, { useState, useEffect } from 'react';
import Popup from '@/components/Popup';
import RichTextField from '@/components/RichTextField';
import { ChevronRight, Loader2, ChevronUp } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import FormFieldGroup from '@/components/FormFieldGroup';
import { useFormFields } from '@/hooks/useFormFields';
import { useRichTextFields } from '@/hooks/useRichTextFields';
import { useTranslatedRecords } from '@/hooks/useTranslatedRecords';
import { useParams } from 'next/navigation';
import SignupForm from '@/components/SignupForm';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { useUserInfo } from '@/hooks/useUserInfo';
import { loadExamples } from '@/utils/exampleLoader';
import { groupFieldsByCategory } from '@/utils/utils';
import { useSource } from '@/context/SourceContext';
import { ResetFormPopup } from '@/components/ui/resetFormPopup';
import FieldNavigator from '@/components/FieldNavigator';
import Navigation from '@/components/Navigation';
/**
 * Define the Home components
 * This component is the main page of the application.
 * It handles the form submission, resetting the page, and loading examples.
 */
export default function Home() {
  // Initialize hooks and state variables
  const { fields, addFields, removeField, setFields, initialFields } = useFormFields();
  const {
    richTextState,
    richTextTitle,
    addRichTextField,
    removeRichTextField,
    setRichTextState,
    setRichTextTitle,
    setRichtextCounter,
    updateRichTextContent,
    updateRichTextTitle,
  } = useRichTextFields();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const params = useParams() as { locale: string };
  const locale = params?.locale || 'de';
  const { getPropertyByName, tInitial } = useTranslatedRecords();
  const { showSignupModal, userInfo, handleSignupClose } = useUserInfo();
  const { isLoading, handleSubmit, errors, handleReset } = useFormSubmit(
    tInitial,
    locale,
    getPropertyByName,
    setShowSubmitModal,
  );
  const { sources, setSources } = useSource();
  const [showLoadExampleModal, setShowLoadExampleModal] = useState<boolean>(false);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Confirm the reset action
  const confirmReset = () => {
    setFields([]);
    setSources({});
    setTimeout(() => {
      setFields(initialFields());
      setRichTextState({});
      setRichTextTitle({});
      setRichtextCounter(0);
    }, 0);
    {
      showResetModal ? setShowResetModal(false) : setShowSubmitModal(false);
    }
  };

  const handleLoadExamples = () => {
    setFields([]);
    setRichTextState({});
    setTimeout(() => {
      loadExamples(
        locale,
        setFields,
        setRichTextTitle,
        setRichTextState,
        setRichtextCounter,
        getPropertyByName,
        setSources,
      );
    }, 0);
    setShowLoadExampleModal(false);
  };

  // Render the component
  return (
    <>
      <Navigation
        onLoadExamples={handleLoadExamples}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />

      <div className="min-h-screen bg-gradient-to-r from-primary-dark to-primary-medium p-2 sm:p-4 md:p-6 lg:p-8">
        {/* Scroll to top button */}
        {showScrollButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 z-50 rounded-full bg-accent p-2 text-primary-dark shadow-lg transition-all hover:bg-primary-light hover:text-accent sm:bottom-6 sm:right-6 sm:p-3 md:bottom-8 md:right-8"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </button>
        )}

        <div className="group hidden md:block">
          <button
            onClick={() => setShowPopup(!showPopup)}
            className={`fixed left-0 top-1/2 z-50 flex -translate-y-1/2 transform flex-col items-center gap-2 rounded-r-xl bg-accent px-2 py-4 shadow-lg transition-all duration-300 ease-in-out hover:bg-primary-light hover:text-accent group-hover:translate-x-1 sm:gap-3 sm:rounded-r-2xl sm:px-3 sm:py-6 ${
              showPopup ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'
            }`}
          >
            <ChevronRight className="h-4 w-4 text-primary-dark group-hover:text-accent sm:h-5 sm:w-5 md:h-6 md:w-6" />
            <span className="rotate-180 text-sm font-medium tracking-wider text-primary-dark [writing-mode:vertical-lr] group-hover:text-accent">
              {tInitial('form.addFields')}
            </span>
          </button>
        </div>

        <div className="mx-auto w-full max-w-[80rem]">
          {showSignupModal && <SignupForm onClose={handleSignupClose} />}
          <div className="flex gap-4 sm:gap-6 md:gap-8">
            {/* Left Sidebar - Property Selector */}
            {showPopup && (
              <div className="fixed inset-0 z-50 bg-accent/90 lg:relative lg:inset-auto lg:block lg:bg-transparent">
                <div className="h-full w-full lg:h-auto lg:w-[320px] xl:w-[400px]">
                  <Popup
                    onAddFields={addFields}
                    onClose={() => setShowPopup(false)}
                    fields={fields}
                  />
                </div>
              </div>
            )}

            {/* Main Form Content */}
            <div
              className={`min-w-0 flex-1 transition-all duration-300 ${showPopup ? 'lg:ml-4' : ''}`}
            >
              <form
                onSubmit={(event) =>
                  handleSubmit(
                    event,
                    fields,
                    richTextState,
                    richTextTitle,
                    sources,
                    userInfo,
                    handleReset,
                  )
                }
                className="relative overflow-hidden rounded-2xl bg-accent shadow-xl sm:rounded-3xl sm:shadow-2xl"
              >
                {isLoading && (
                  <div className="fixed inset-0 z-50 m-auto flex items-center justify-center bg-primary-dark/20">
                    <Loader2 className="h-4 w-4 animate-spin text-primary-medium sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  </div>
                )}
                {/* Form fields */}
                <div className="space-y-6 p-4 sm:space-y-7 sm:p-6 md:space-y-8 md:p-8">
                  {Object.entries(groupFieldsByCategory(fields, tInitial)).map(
                    ([category, fields], index) => (
                      <FormFieldGroup
                        key={index}
                        category={category}
                        fields={fields}
                        removeField={removeField}
                        showWikiProps={false}
                        errors={errors}
                      />
                    ),
                  )}
                  {/* Render RichText fields */}
                  {Object.keys(richTextState).length > 0 && (
                    <div className="space-y-4 sm:space-y-6">
                      <h2 className="border-b-2 border-primary-light/20 pb-2 text-xl font-bold text-primary-dark sm:pb-3 sm:text-2xl md:text-3xl">
                        {tInitial('form.additionalText')}
                      </h2>
                      {Object.keys(richTextState).map((richtextName, index) => (
                        <RichTextField
                          key={richtextName}
                          property={{ name: richtextName, type: 'richie' }}
                          updateContent={updateRichTextContent}
                          onDelete={() => removeRichTextField(richtextName)}
                          initContent={richTextState[richtextName]}
                          initTitle={richTextTitle[richtextName]}
                          onChange={(e: { target: { value: string } }) =>
                            updateRichTextTitle(richtextName, e.target.value)
                          }
                        />
                      ))}
                    </div>
                  )}
                  {/* End of Selection */}
                  <button
                    type="button"
                    onClick={addRichTextField}
                    className="w-full rounded-lg bg-primary-medium py-2 text-sm font-semibold text-accent shadow-md transition duration-300 ease-in-out hover:bg-primary-medium/80 focus:outline-none focus:ring-2 focus:ring-primary-light/50 sm:py-3 sm:text-base"
                  >
                    {tInitial('form.addRichText')}
                  </button>
                </div>
                <div className="space-y-6 bg-primary-light/10 px-4 py-4 sm:space-y-7 sm:px-6 sm:py-6 md:space-y-8 md:px-8 md:py-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-5 md:gap-6">
                    <button
                      type="button"
                      onClick={() => setShowResetModal(true)}
                      className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-accent shadow-md transition duration-300 hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive/50 sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3"
                    >
                      {tInitial('form.resetAllFields')}
                    </button>

                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-accent shadow-md transition duration-300 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 sm:px-7 sm:py-3.5 sm:text-base md:px-8 md:py-4"
                    >
                      {tInitial('form.submit')}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Sidebar - Field Navigator */}
            {fields.length > 0 && !showPopup && (
              <div className="hidden w-[240px] shrink-0 lg:block xl:w-[300px]">
                <FieldNavigator
                  fields={fields}
                  tInitial={tInitial}
                  onAddFields={() => setShowPopup(true)}
                />
              </div>
            )}
          </div>

          {showResetModal && (
            <ResetFormPopup
              setShowResetModal={setShowResetModal}
              confirmReset={confirmReset}
              title={tInitial('form.FormReset.title')}
              description={tInitial('form.FormReset.description')}
              cancel={tInitial('form.FormReset.cancel')}
              confirm={tInitial('form.FormReset.confirm')}
            />
          )}
          {showSubmitModal && (
            <ResetFormPopup
              setShowResetModal={setShowSubmitModal}
              confirmReset={confirmReset}
              title={tInitial('form.FormSubmit.title')}
              description={tInitial('form.FormSubmit.description')}
              cancel={tInitial('form.FormSubmit.cancel')}
              confirm={tInitial('form.FormSubmit.confirm')}
            />
          )}
          {showLoadExampleModal && (
            <ResetFormPopup
              setShowResetModal={setShowLoadExampleModal}
              confirmReset={handleLoadExamples}
              title={tInitial('form.LoadExample.title')}
              description={tInitial('form.LoadExample.description')}
              cancel={tInitial('form.LoadExample.cancel')}
              confirm={tInitial('form.LoadExample.confirm')}
            />
          )}
        </div>
      </div>
    </>
  );
}
