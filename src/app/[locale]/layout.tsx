import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ToastProvider from "@/providers/ToastProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Navigation from "@/components/Navigation";
import { SourceProvider } from "@/context/SourceContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wikidataform",
  description: "Create forms for Wikidata",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <Navigation />
            <SourceProvider>{children}</SourceProvider>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
