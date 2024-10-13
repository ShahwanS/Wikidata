export async function loadExamples(locale: string, setFields: any, setRichTextTitle: any, setRichTextState: any, setRichtextCounter: any, getPropertyByName: any) {
  let exampleModule;
  if (locale === "de") {
    exampleModule = await import("@/app/loadexampleDe");
  } else {
    exampleModule = await import("@/app/loadexampleEn");
  }
  setFields(exampleModule.exampleFields(getPropertyByName));
  exampleModule.exampleRichtexts(setRichTextTitle, setRichTextState);
  setRichtextCounter(2);
}