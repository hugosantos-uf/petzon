"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BiGlobe } from "react-icons/bi";

const languages = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" }
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (lang: string) => {
    const segments = pathname.split("/");
    segments[1] = lang;
    router.push(segments.join("/"));
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left border-l-white ml-3  border-l border-white pl-4" onClick={() => setIsOpen((prev) => !prev)}>
      <button
        aria-label="Trocar idioma"
        className="flex"
      >
        <BiGlobe size={24} className="text-white/80" />
      </button>

      {isOpen && (
        <ul
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute right-0 mt-4 w-32 bg-white border-zinc-200 text-zinc-800 rounded shadow-md"
        >
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => handleChange(lang.code)}
                className="w-full text-left px-4 py-2 hover:bg-yellow-400 rounded"
              >
                <p color="hover:text-white">{lang.label}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}