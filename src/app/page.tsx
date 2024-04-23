"use client";
import React, { useState } from "react";
import Field from "./components/Field";
import Popup from "./components/Popup";
import RichTextField from "./components/RichTextField";
import { convert2Markup } from "./convertToMarkup";
import { revalidatePath } from "next/cache";
import { Property } from "./propgliederung";
/** Define the Home component */
export default function Home() {
  // Define state variables
  /** The state saves the properties that are currently displayed on the page */
  const [fields, setFields] = useState<Property[]>([
    // Initial fields
    {
      name: "Offizieller Name",
      type: "text",
      placeholder: "Name",
      wikidataprop: "P1448",
      unique: true,
      required: true
    },
    {
      name: "Datum der offiziellen Eröffnung",
      type: "text",
      placeholder: "Datum : MM/YY oder Jahr",
      wikidataprop: "P1619",
      unique: true,
      required: true
    },
    { name: "Bild", type: "file", wikidataprop: "P18", required: true},
    {
      name: "Webseite",
      type: "text",
      placeholder: "https://example.com", wikidataprop: "P856", required: true
    },
  ]);
  /** This state is for the Richtextfields that are currently displayed on the page */
  const [richTextState, setRichTextState] = useState<{ [key: string]: string }>({});
  // kleiner workaround, weil beim Löschen eines richtexts die Titel nachfolgender Richtexts unerklärlicherweise verschwinden
  const [richTextTitle, setRichTextTitle] = useState<{ [key: string]: string }>({});
  /** This state counts, how many Richtexts were added in the running session */
  const [richtextCounter, setRichtextCounter] = useState<number>(0);
  /** The state saves if the Popup is shown or not */
  const [showPopup, setShowPopup] = useState<boolean>(false);
  /** The state saves if the Wikipropnumbers are shown or not */
  const [showWikiProps, setShowWikiProps] = useState<boolean>(false);

  // Function to add new fields
  /**
   * Method adds properties to the page
   * @param newFields Array of properties to be added to the page
   */
  const addFields = (newFields: Property[]) => {
    // check for each property if it already exists on the page
    const uniqueFields = newFields.filter((newField) => {
      return !fields.some(
        (field: { name: string; type: string }) =>
          field.name === newField.name && field.type === newField.type
      );
    });
    //add the filtered properties to the page
    setFields([...fields, ...uniqueFields]);
  };
  /**
   * Method to update a richtextfield
   * @param fieldName Name of the richtextfield to be updated
   * @param content Content of the richtextfield to be updated
   */
  const updateRichTextContent = (fieldName: string, content: string) => {
    setRichTextState((prevState) => ({
      ...prevState,
      [fieldName]: content,
    }));
  };
  // das gleiche nochmal für den Titel des Richtexts
  const updateRichTextTitle = (fieldName: string, newtitle: string) => {
    setRichTextTitle((prevState) => ({
      ...prevState,
      [fieldName]: newtitle,
    }));
  };

  /** Function to add a rich text field */
  const addRichTextField = () => {
    const newRichtextStat = {...richTextState}
    newRichtextStat["Rich Text"+richtextCounter] = ""
    setRichTextState(newRichtextStat)
    setRichtextCounter(richtextCounter+1)
  };
  /**
   * Methode to delete a richtext field
   * @param richtextName Name of the richtext to be removed
   */
  const removeRichTextField = (richtextName: string) => {
    const newRichtextState = {...richTextState};
    delete newRichtextState[richtextName]
    setRichTextState(newRichtextState)
    const newRichtextTitle = {...richTextTitle};
    delete newRichtextTitle[richtextName]
    setRichTextTitle(newRichtextTitle)
  }
  /**
   * Method to remove a property from the page
   * @param fieldssss Property to be removed
   */
  const removeField = (fieldssss: Property) => {
    const updatedFields = fields.filter(
      (field: Property) => field !== fieldssss
    );
    setFields(updatedFields);
  };

  /**
   * Handle form submission
   * @param event Event that happens by click submit
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Initialize formData with existing form fields
    const formData = new FormData(event.target as HTMLFormElement);
    let fieldsData = Object.fromEntries(formData.entries());

    // Directly add rich text content from state to fieldsData
    Object.keys(richTextState).forEach((fieldName) => {
      fieldsData[fieldName] = richTextState[fieldName];
    });

    console.log("Fields Data:", fieldsData);
    const markupOutput = convert2Markup(fieldsData,showWikiProps);

    if (markupOutput !== undefined) {
      const blob = new Blob([markupOutput], { type: "text/markdown" });
      const title = fieldsData["Offizieller Name"];
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Wikidata_` + title + `.md`;
      a.click();
    } else {
      alert("Bitte füllen Sie alle Felder aus");
    }
  };

  /** Interface to group fields by category */
  interface GroupedFields {
    [category: string]: Property[];
  }

  /** Grouped fields by their category for rendering */
  const fieldsByCategory = fields.reduce<GroupedFields>(
    (acc: GroupedFields, field: Property) => {
      const category = field.category || ""; // Assign to 'Other' if category is undefined
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(field);
      return acc;
    },
    {}
  );
  /**
   * Handle reset the whole page
   * @param event Event for click reset
   */
  const handleReset = (event: any) => {
    const confirmReset = window.confirm(
      "Möchten Sie wirklich alle Felder zurücksetzen?"
    );
    if (!confirmReset) {
      // If the user clicks "Cancel", prevent the form from resetting
      event.preventDefault();
    } else {
      // Reset the whole page to initial state deleting all old info
      window.location.reload();
    }
  };

  // Render the component
  return (
    <div className="min-h-screen bg-wikipediaGray flex justify-center items-center">
      <div className="max-w-5xl mx-auto">
        <header className="text-3xl font-semibold text-center mb-4">
          Wikidata Formular
        </header>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md"
        >
          <>
          {Object.entries(fieldsByCategory).map(([category, fields], index) => (
            <div key={index}>
              <h2 className="flex justify-center items-center text-xl font-bold mb-10 mt-4">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {fields.map((field, fieldIndex) => {
                    return (
                      <Field
                        key={category+field.name}
                        property={field}
                        onDelete={() => removeField(field)}
                        showWikiProp={showWikiProps}
                      />
                    );
                })}
              </div>
            </div>
            ))}
            {Object.keys(richTextState).map((richtextName,index)=>{
              return(
                <>
                {index===0 ? (<h2 className="flex justify-center items-center text-xl font-bold mb-10 mt-4">Weitere Angaben als Freitext</h2>) : ("")}
                <RichTextField
                      key={richtextName}
                      property={{name: richtextName, type: "richie"}}
                      updateContent={updateRichTextContent}
                      onDelete={()=>removeRichTextField(richtextName)}
                      initContent={richTextState[richtextName]}
                      initTitle={richTextTitle[richtextName]}
                      onChange={(e)=>updateRichTextTitle(richtextName,e.target.value)} // dieses onChange bezieht sich auf das Feld mit dem Abschnittstitel
                />
                </>
              )
            })}
          </>
          <div className="flex-col items-center justify-between mt-4 space-y-10">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowPopup(true)}
                className="bg-wikipediaBlue hover:bg-wikipediaBlueDark text-white font-bold py-2 px-4 rounded transition duration-300 mr-2"
              >
                Weitere Felder hinzufügen
              </button>
              <button
                type="button"
                onClick={addRichTextField}
                className="bg-wikipediaBlue hover:bg-wikipediaBlueDark text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Freitext hinzufügen
              </button>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                alle Felder zurücksetzen
              </button>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  onChange={(e)=>{setShowWikiProps(e.target.checked)}}
                />
                <label className="text-sm">Wikidata-Propertynummern anzeigen</label>
              </div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Speichern
              </button>
            </div>
          </div>
        </form>
        {showPopup && (
          <Popup onAddFields={addFields} onClose={() => setShowPopup(false)} />
        )}
      </div>
    </div>
  );
}
