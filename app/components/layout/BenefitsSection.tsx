"use client";
import { useTranslations } from "next-intl";

export default function BenefitsSection() {
  const t = useTranslations("benefits");

  const benefits = [
    {
      title: t("safeAdoption.title"),
      text: t("safeAdoption.text"),
    },
    {
      title: t("support.title"),
      text: t("support.text"),
    },
  ];

  return (
    <section className="py-16 px-6 bg-purple-50 flex-grow">
      <h2 className="text-3xl font-bold text-center text-purple-800 mb-10">
        {t("title")}
      </h2>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        {benefits.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-600"
          >
            <h3 className="text-2xl font-bold text-purple-700 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
