"use client";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-purple-800 text-white text-center py-6 mt-auto">
      <div className="text-sm">
        © {new Date().getFullYear()} Petzon · {t("rights")}
      </div>
    </footer>
  );
}
