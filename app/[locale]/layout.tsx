import type { Metadata } from "next";
import React from "react";
import "../globals.css";

import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: {
    default: "Petzon - Adotar nunca foi tão fácil",
    template: "%s | Petzon",
  },
  description:
    "Petzon é uma plataforma dedicada à adoção responsável de animais. Conectamos pets que precisam de um lar com pessoas dispostas a oferecer amor e cuidado.",
  keywords: [
    "adoção de pets",
    "adote um pet",
    "cachorros para adoção",
    "gatos para adoção",
    "animais de estimação",
    "Petzon",
  ],
  authors: [
    { name: "Lucas Gabryel", url: "https://github.com/lucas-gabryel" },
    { name: "Hugo Santos", url: "https://github.com/hugosantos-uf" },
  ],
  creator: "Lucas Gabryel e Hugo Santos",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
