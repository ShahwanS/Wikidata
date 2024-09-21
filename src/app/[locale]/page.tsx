"use client";
import React, { useState } from "react";
import Popup from "@/components/Popup";
import RichTextField from "@/components/RichTextField";
import { convert2Markup } from "@/utils/convertToMarkup";
import { Property } from "@/utils/propgliederung";
import { commitToGitLab } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormFieldGroup from "@/components/FormFieldGroup";
import { useFormFields } from "@/hooks/useFormFields";
import { useRichTextFields } from "@/hooks/useRichTextFields";
import { useTranslatedRecords } from "@/hooks/useTranslatedRecords";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

/** 
 * Define the Home components 
 * This component is the main page of the application.
 * It handles the form submission, resetting the page, and loading examples.
 */
export default function Home() {
  // Initialize hooks and state variables
  const t = useTranslations("initial");
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const params = useParams();
  const locale = params?.locale || "de";
  const { getPropertyByName, translatedPropgliederung } =
    useTranslatedRecords();

  // Load examples based on the locale
  const loadExamples = async () => {
    let exampleModule;
    if (locale === "de") {
      exampleModule = await import("@/app/loadexampleDe");
    } else {
      exampleModule = await import("@/app/loadexampleEn");
    }
    setFields(exampleModule.exampleFields(getPropertyByName));
    exampleModule.exampleRichtexts(setRichTextTitle, setRichTextState);
    setRichtextCounter(2);
  };

  /** 
   * Handles form submission 
   * This function is called when the form is submitted.
   * It converts the form data to Markdown content and sends it to GitLab.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    let fieldsData = Object.fromEntries(formData.entries());

    Object.keys(richTextState).forEach((fieldName) => {
      fieldsData[fieldName] = formatRichTextContent(fieldName);
      fieldsData[fieldName] = formatRichTextContent(fieldName);
    });

    // Convert form data to Markdown content
    const markupOutput = convert2Markup(
      fieldsData,
      translatedPropgliederung,
      getPropertyByName,
      locale.toString()
    );
    if (markupOutput !== undefined) {
      // Name the file based on a form field, or default to "output"
      const fileName =
        fieldsData["Offizieller Name0"] ||
        fieldsData["Official Name0"] ||
        "output";
      // Send the generated Markdown file to GitLab
      try {
        setIsLoading(true);
        await commitToGitLab(fileName.toString(), markupOutput);
        handleReset();
      } catch (error) {
        console.error("Failed to send the markup file to GitLab:", error);
        toast.error(t("form.errorSending"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      setIsLoading(false);
    } else {
    }

    toast.info(t("form.formSaved"), {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  /** 
   * Formats the RichText content including the title 
   * This function formats the RichText content including the title.
   */
  const formatRichTextContent = (fieldName: string): string => {
    const title = richTextTitle[fieldName]
      ? `# ${richTextTitle[fieldName]}\n`
      : "";
    return title + richTextState[fieldName];
  };

  // /** Downloads the generated Markdown file */
  // const downloadMarkdownFile = (
  //   markupOutput: string,
  //   title: FormDataEntryValue
  // ) => {
  //   const blob = new Blob([markupOutput], { type: "text/markdown" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `Wikidata_${title}.md`;
  //   a.click();
  // };

  // /** Groups fields by their category for rendering */
  // const fieldsByCategory = groupFieldsByCategory(fields);

  /** 
   * Groups fields by their category 
   * This function groups the fields by their category for rendering.
   */
  function groupFieldsByCategory(
    fields: Property[]
  ): Record<string, Property[]> {
    return fields.reduce<Record<string, Property[]>>((acc, field) => {
      const category = field.category || "Main";
      if (!acc[category]) acc[category] = [];
      acc[category].push(field);
      return acc;
    }, {});
  }

  /** 
   * Handles resetting the whole page 
   * This function handles resetting the whole page.
   */
  const handleReset = () => {
    setShowResetModal(true);
  };

  // Confirm the reset action
  const confirmReset = () => {
    setFields([]);
    setTimeout(() => {
      setFields(initialFields());
      setRichTextState({});
      setRichTextTitle({});
      setRichtextCounter(0);
    }, 0);
    setShowResetModal(false);
  };

  // Render the component
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
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
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
            >
              {isLoading && (
                <div className="fixed inset-0 m-auto bg-slate-500/20 flex items-center justify-center z-50">
                  <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
              )}
              {/* Form fields */}
              <div className="p-8 space-y-12">
                {Object.entries(groupFieldsByCategory(fields)).map(
                  ([category, fields], index) => (
                    <FormFieldGroup
                      key={index}
                      category={category}
                      fields={fields}
                      removeField={removeField}
                      showWikiProps={false}
                    />
                  )
                )}
                {/* Render RichText fields */}
                {Object.keys(richTextState).length > 0 && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-gray-700 border-b-2 border-gray-200 pb-3">
                      {t("form.additionalText")}
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
                <button
                  type="button"
                  onClick={addRichTextField}
                  className="py-3 w-full bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                >
                  {t("form.addRichText")}
                </button>
              </div>
              <div className="bg-gray-100 px-8 py-8 space-y-8">
                <div className="flex flex-wrap justify-between items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setShowPopup(!showPopup)}
                    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    {showPopup ? t("form.closeSidebar") : t("form.addFields")}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFields([]);
                      setRichTextState({});
                      setTimeout(() => {
                        loadExamples();
                      }, 0);
                    }}
                    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    {t("form.loadExampleData")}
                  </button>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-6">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    {t("form.resetAllFields")}
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    {t("form.submit")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">
                {t("form.FormReset.title")}
              </h3>
              <p className="mb-6">{t("form.FormReset.description")}</p>
              <div className="flex justify-start space-x-4">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  {t("form.FormReset.cancel")}
                </button>
                <button
                  onClick={confirmReset}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  {t("form.FormReset.confirm")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
