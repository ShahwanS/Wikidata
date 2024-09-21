"use client";

import clsx from "clsx";
import { ChangeEvent, ReactNode, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import { Locale } from "../../i18n/routing";

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false); // State to control the arrow rotation

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;

    startTransition(() => {
      const newPath = `/${nextLocale}`; // Replace the locale part of the URL
      router.replace(newPath);
    });

    setIsOpen(false); // Close the dropdown after selection
  }

  return (
    <label
      className={clsx(
        "relative text-gray-600",
        isPending && "transition-opacity opacity-30"
      )}
    >
      <p className="sr-only">{label}</p>
      <select
        className="inline-flex appearance-none bg-gray-200 border border-gray-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-sky-500 transition-colors duration-150"
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
        onClick={() => setIsOpen(!isOpen)} // Toggle arrow on click
      >
        {children}
      </select>
      <span
        className={clsx(
          "pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform duration-200",
          isOpen ? "rotate-180" : "rotate-0" // Rotate the arrow based on the state
        )}
      >
        <FaChevronDown className="text-gray-500" /> {/* Arrow icon */}
      </span>
    </label>
  );
}
