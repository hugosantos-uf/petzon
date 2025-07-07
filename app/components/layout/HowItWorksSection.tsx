"use client";
import { useTranslations } from "next-intl";
import { PawPrint, Search, Heart } from "lucide-react";

export default function HowItWorksSection() {
  const t = useTranslations();

  const steps = [
    {
      icon: <Search className="w-10 h-10 mb-2" />,
      title: t("how.title1"),
      description: t("how.desc1"),
    },
    {
      icon: <PawPrint className="w-10 h-10 mb-2" />,
      title: t("how.title2"),
      description: t("how.desc2"),
    },
    {
      icon: <Heart className="w-10 h-10 mb-2" />,
      title: t("how.title3"),
      description: t("how.desc3"),
    },
  ];

  return (
    <section className="bg-purple-50 text-purple-800 py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-10">{t("how.title")}</h2>
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3 text-center">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex justify-center text-purple-700">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
