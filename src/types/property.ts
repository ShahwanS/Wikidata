/** Defines the structure of a property */
export type Property = {
  name: string;
  type: string; // e.g., "string", "number", "boolean", "file", "url"
  description?: string;
  placeholder?: string; // Hint for filling out the field
  unique?: boolean; // true if only one value is allowed (e.g., number of elevators)
  maxvalues?: number; // Maximum number of values allowed
  required?: boolean; // true if the property must be filled out
  value?: string[]; // Pre-filled value(s)
  wikidataprop?: string; // Associated Wikidata property ID, if exists
  choices?: string[]; // List of predefined values
  category?: string; // Category of the Property
  unit?: string[]; // Unit of measurement
  infobox?: string; // information to help the user know what to write
};
