// app/[locale]/about/page.tsx
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { Heart, Users, Target, HandHeart } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Nós",
};

export default function AboutPage() {
  const t = useTranslations("aboutPage");

  const sectionClass = "mb-10 md:mb-12";
  const titleClass =
    "text-3xl font-bold text-purple-800 mb-4 flex items-center";
  const textClass = "text-gray-700 leading-relaxed text-lg";
  const iconClass = "mr-3 text-purple-700";

  return (
    <main className="flex-1 bg-purple-50 py-10 px-6 md:py-16 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900 text-center mb-10 md:mb-12">
          {t("title")}
        </h1>

        <section className={sectionClass}>
          <h2 className={titleClass}>
            <Target size={32} className={iconClass} />
            {t("missionTitle")}
          </h2>
          <p className={textClass}>{t("missionText")}</p>
        </section>

        <section className={sectionClass}>
          <h2 className={titleClass}>
            <HandHeart size={32} className={iconClass} />
            {t("visionTitle")}
          </h2>
          <p className={textClass}>{t("visionText")}</p>
        </section>

        <section className={sectionClass}>
          <h2 className={titleClass}>
            <Users size={32} className={iconClass} />
            {t("creatorsTitle")}
          </h2>
          <p className={textClass}>{t("creatorsText")}</p>
        </section>

        <section className="mt-12 text-center bg-purple-600 text-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <Heart size={32} className="mr-3" />
            {t("getInvolvedTitle")}
          </h2>
          <p className="text-lg leading-relaxed opacity-90">
            {t("getInvolvedText")}
          </p>
        </section>
      </div>
    </main>
  );
}
