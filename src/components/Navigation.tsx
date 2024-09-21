"use client";

import { useTranslations } from "next-intl";
import LocaleSwitcher from "../components/LocaleSwitcher";

export default function Navigation() {
  const t = useTranslations("initial");

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-700 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          {t("form.title")}
        </h1>
        <LocaleSwitcher />
      </nav>
    </header>
  );
}
