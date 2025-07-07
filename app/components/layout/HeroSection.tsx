"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation"; //

export default function HeroSection() {
  const t = useTranslations();

  return (
    <section className="flex flex-col lg:flex-row items-center justify-center px-6 bg-purple-700 text-white pt-10">
      <div className=" lg:w-7xl flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex-1 text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 drop-shadow-lg">
            {t("hero.title")}
          </h1>
          <p className="text-lg lg:text-xl mb-8 opacity-90">
            {t("hero.subtitle")}
          </p>
          <button className="bg-yellow-400 text-purple-800 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-yellow-500 transition">
            <Link href={"/gallery"}>{t("cta.button")}</Link>
          </button>
        </div>

        <Image
          src="/petsHero.png"
          alt="Pets Hero"
          width={500}
          height={500}
          priority
        />
      </div>
    </section>
  );
}
