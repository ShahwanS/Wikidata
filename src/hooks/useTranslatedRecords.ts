"use client";

import { useTranslations } from "next-intl";
import {
  propgliederung,
  Category,
  Property,
  Properties,
} from "../utils/propgliederung";

/**
 * Hook to use translated records from propgliederung.
 * It initializes and processes the propgliederung data for use in the application.
 * 
 * @returns An object containing categories, properties, a function to get a property by name, and the translated propgliederung.
 */
export const useTranslatedRecords = () => {
  const t = useTranslations("form"); // Get translations for the "form" namespace
  const translatedPropgliederung = propgliederung(t); // Translate propgliederung using the translations

  // Initialize data structures to hold processed propgliederung data
  const categories: Record<string, Category> = {};
  const properties: Properties = {};
  const propertyInputTypes: Record<string, string> = {};
  const categoryNameForProperty: Record<string, string> = {};
  const valueNameForProperty: Record<string, string[]> = {};
  const choicesForProperty: Record<string, string[]> = {};
  const uniqueForProperty: Record<string, boolean> = {};
  const requiredForProperty: Record<string, boolean> = {};
  const PropertyByName: Record<string, Property> = {};

  // Process each category in the translated propgliederung
  translatedPropgliederung.forEach((cat) => {
    // Handle case where subcategories should use category's name and description
    if (cat.subcategories.length === 1) {
      cat.subcategories[0].name = cat.title;
      cat.subcategories[0].description = cat.description;
    }

    // Store the categories and properties
    categories[cat.title] = cat;
    properties[cat.title] = {};

    // Process each subcategory and its properties
    cat.subcategories.forEach((subcat) => {
      properties[cat.title][subcat.name] = {
        name: subcat.name,
        properties: subcat.properties.map((prop) => prop.name),
        description: subcat.description,
      };

      // Process each property of the subcategory
      subcat.properties.forEach((prop) => {
        propertyInputTypes[prop.name] = prop.type;
        if (prop.name) PropertyByName[prop.name] = prop;
        prop.category = cat.title;
        if (prop.unique) uniqueForProperty[prop.name] = prop.unique;
        if (prop.required) requiredForProperty[prop.name] = prop.required;
        if (prop.choices) choicesForProperty[prop.name] = prop.choices;
        if (prop.value) valueNameForProperty[prop.name] = prop.value;
        categoryNameForProperty[prop.name] = cat.title;
      });
    });
  });

  /**
   * Function to get a property by its name.
   * If the property is not found, it returns a default property with the given name and type "text".
   * 
   * @param propertyName The name of the property to retrieve.
   * @returns The property object or a default property if not found.
   */
  const getPropertyByName = (propertyName: string): Property => {
    const property = PropertyByName[propertyName];
    if (!property) {
      return { name: propertyName, type: "text" };
    }
    return property;
  };

  // Return the processed data and the function to get a property by name
  return {
    categories,
    properties,
    getPropertyByName,
    translatedPropgliederung,
  };
};