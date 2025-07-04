"use client";
import { useTranslations } from "next-intl";

export default function CallToAction() {
  const t = useTranslations("cta");

  return (
    <section className="flex-grow text-center py-20 bg-purple-600 text-white px-6">
      <h2 className="text-4xl font-bold mb-4">{t("title")}</h2>
      <button className="mt-6 bg-yellow-400 text-purple-800 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition">
        {t("button")}
      </button>
    </section>
  );
}
