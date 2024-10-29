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

  // Render the component
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8">
      {/* Scroll to top button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full bg-gray-600 p-3 text-white shadow-lg transition-all hover:bg-gray-500"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}

      <div className="group">
        <button
          onClick={() => setShowPopup(!showPopup)}
          className={`fixed left-0 top-1/2 z-50 flex -translate-y-1/2 transform flex-col items-center gap-3 rounded-r-2xl bg-white px-3 py-6 shadow-lg transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-xl group-hover:translate-x-1 ${
            showPopup ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'
          }`}
          aria-label="Toggle Property Selector"
        >
          <ChevronRight className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
          <span className="rotate-180 font-medium tracking-wider text-gray-700 [writing-mode:vertical-lr] group-hover:text-gray-900">
            {tInitial('form.addFields')}
          </span>
        </button>
      </div>

      <div className="mx-auto w-full max-w-[80rem]">
        {showSignupModal && <SignupForm onClose={handleSignupClose} />}
        <div className="flex gap-8">
          {/* Left Sidebar - Property Selector */}
          {showPopup && (
            <div className="w-[400px] shrink-0">
              <Popup onAddFields={addFields} onClose={() => setShowPopup(false)} fields={fields} />
            </div>
          )}

          {/* Main Form Content */}
          <div className={`min-w-0 flex-1 transition-all duration-300`}>
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
              className="relative overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              {isLoading && (
                <div className="fixed inset-0 z-50 m-auto flex items-center justify-center bg-slate-500/20">
                  <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
                </div>
              )}
              {/* Form fields */}
              <div className="space-y-12 p-8">
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
                  <div className="space-y-8">
                    <h2 className="border-b-2 border-gray-200 pb-3 text-3xl font-bold text-gray-700">
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
                  className="w-full rounded-lg bg-gray-600 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                >
                  {tInitial('form.addRichText')}
                </button>
              </div>
              <div className="space-y-8 bg-gray-100 px-8 py-8">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <button
                    type="button"
                    onClick={() => setShowPopup(!showPopup)}
                    className="rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                  >
                    {showPopup ? tInitial('form.closeSidebar') : tInitial('form.addFields')}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
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
                    }}
                    className="rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                  >
                    {tInitial('form.loadExampleData')}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                  >
                    {tInitial('form.resetAllFields')}
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-green-600 px-8 py-4 font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                  >
                    {tInitial('form.submit')}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Sidebar - Field Navigator */}
          {fields.length > 0 && !showPopup && (
            <div className="hidden w-[300px] shrink-0 lg:block">
              <FieldNavigator
                fields={fields}
                tInitial={tInitial}
                richTextFields={{
                  titles: richTextTitle,
                  contents: richTextState,
                }}
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
      </div>
    </div>
  );
}
