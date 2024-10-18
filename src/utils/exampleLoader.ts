export async function loadExamples(
  locale: string,
  setFields: any,
  setRichTextTitle: any,
  setRichTextState: any,
  setRichtextCounter: any,
  getPropertyByName: any,
  setSources: any
) {
  let exampleModule;
  let exampleSources;
  if (locale === "de") {
    exampleModule = await import("@/app/loadexampleDe");
    exampleSources = await import("@/app/loadexampleDe");
  } else {
    exampleModule = await import("@/app/loadexampleEn");
    exampleSources = await import("@/app/loadexampleEn");
  }
  setFields(exampleModule.exampleFields(getPropertyByName));
  exampleModule.exampleRichtexts(setRichTextTitle, setRichTextState);
  setRichtextCounter(2);
  setSources(exampleSources.exampleSources());
}
