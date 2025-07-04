"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";

const TestimonialCard = ({
  quote,
  name,
  petInfo,
  imgSrc,
}: {
  quote: string;
  name: string;
  petInfo: string;
  imgSrc: string;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="p-8">
        <Quote className="text-purple-300 w-10 h-10 mb-4" />
        <p className="text-gray-600 italic mb-6 text-lg">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="flex items-center">
          <Image
            src={imgSrc}
            alt={`Foto de ${name}`}
            width={50}
            height={50}
            className="rounded-full mr-4 border-2 border-purple-200"
          />
          <div>
            <p className="font-bold text-purple-800 text-lg">{name}</p>
            <p className="text-gray-500 text-sm">Adotou o(a) {petInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");

  return (
    <section className="bg-purple-50 py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-purple-800 text-center mb-12">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <TestimonialCard
            quote={t("testimonial1.quote")}
            name={t("testimonial1.name")}
            petInfo={t("testimonial1.pet")}
            imgSrc="/adopter1.png"
          />
          <TestimonialCard
            quote={t("testimonial2.quote")}
            name={t("testimonial2.name")}
            petInfo={t("testimonial2.pet")}
            imgSrc="/adopter2.png"
          />
        </div>
      </div>
    </section>
  );
}
