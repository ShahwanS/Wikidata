"use client";
import React, { useState } from "react";
import Popup from "@/components/Popup";
import RichTextField from "@/components/RichTextField";
import { Loader2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import FormFieldGroup from "@/components/FormFieldGroup";
import { useFormFields } from "@/hooks/useFormFields";
import { useRichTextFields } from "@/hooks/useRichTextFields";
import { useTranslatedRecords } from "@/hooks/useTranslatedRecords";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import SignupForm from "@/components/SignupForm";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { useUserInfo } from "@/hooks/useUserInfo";
import { loadExamples } from "@/utils/exampleLoader";
import { groupFieldsByCategory } from "@/utils/utils";
import { useSource } from "@/context/SourceContext";
import { Button } from "@/components/ui/button";
import { ResetFormPopup } from "@/components/ui/resetFormPopup";
/**
 * Define the Home components
 * This component is the main page of the application.
 * It handles the form submission, resetting the page, and loading examples.
 */
export default function Home() {
  // Initialize hooks and state variables
  // const t = useTranslations("initial");
  const { fields, addFields, removeField, setFields, initialFields } =
    useFormFields();
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
  const params = useParams() as { locale: string };
  const locale = params?.locale || "de";
  const { getPropertyByName, tInitial } = useTranslatedRecords();
  const { showSignupModal, userInfo, handleSignupClose } = useUserInfo();
  const { isLoading, handleSubmit, errors, handleReset } = useFormSubmit(
    tInitial,
    locale,
    getPropertyByName,
    setShowSubmitModal
  );
  const { sources, setSources } = useSource();

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
      <div className="w-full max-w-6xl mx-auto">
        {showSignupModal && <SignupForm onClose={handleSignupClose} />}
        <div className="flex flex-col lg:flex-row gap-8">
          {showPopup && (
            <div className="lg:w-1/3">
              <Popup
                onAddFields={addFields}
                onClose={() => setShowPopup(false)}
              />
            </div>
          )}

          <div className={`flex-grow ${showPopup ? "lg:w-3/4" : "w-full"}`}>
            <form
              onSubmit={(event) =>
                handleSubmit(
                  event,
                  fields,
                  richTextState,
                  richTextTitle,
                  sources,
                  userInfo,
                  handleReset
                )
              }
              className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
            >
              {isLoading && (
                <div className="fixed inset-0 m-auto bg-slate-500/20 flex items-center justify-center z-50">
                  <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
              )}
              {/* Form fields */}
              <div className="p-8 space-y-12">
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
                  )
                )}
                {/* Render RichText fields */}
                {Object.keys(richTextState).length > 0 && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-gray-700 border-b-2 border-gray-200 pb-3">
                      {tInitial("form.additionalText")}
                    </h2>
                    {Object.keys(richTextState).map((richtextName, index) => (
                      <RichTextField
                        key={richtextName}
                        property={{ name: richtextName, type: "richie" }}
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
                  className="py-3 w-full bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                >
                  {tInitial("form.addRichText")}
                </button>
              </div>
              <div className="bg-gray-100 px-8 py-8 space-y-8">
                <div className="flex flex-wrap justify-between items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setShowPopup(!showPopup)}
                    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    {showPopup
                      ? tInitial("form.closeSidebar")
                      : tInitial("form.addFields")}
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
                          setSources
                        );
                      }, 0);
                    }}
                    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    {tInitial("form.loadExampleData")}
                  </button>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    {tInitial("form.resetAllFields")}
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    {tInitial("form.submit")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {showResetModal && (
          <ResetFormPopup
            setShowResetModal={setShowResetModal}
            confirmReset={confirmReset}
            title={tInitial("form.FormReset.title")}
            description={tInitial("form.FormReset.description")}
            cancel={tInitial("form.FormReset.cancel")}
            confirm={tInitial("form.FormReset.confirm")}
          />
        )}
        {showSubmitModal && (
          <ResetFormPopup
            setShowResetModal={setShowSubmitModal}
            confirmReset={confirmReset}
            title={tInitial("form.FormSubmit.title")}
            description={tInitial("form.FormSubmit.description")}
            cancel={tInitial("form.FormSubmit.cancel")}
            confirm={tInitial("form.FormSubmit.confirm")}
          />
        )}
      </div>
    </div>
  );
}
