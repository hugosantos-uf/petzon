"use client";

import React, { useState, useRef, useEffect } from "react"; // Importamos useRef e useEffect
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./languageSwitcher/LanguageSwitcher";
import { FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import { logout } from "./multiActionAreaCard/authSlice";
import { useGetUsuarioLogadoQuery, petsApi } from "@/app/store/api/petsApi";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Referência para o container do dropdown
  const t = useTranslations("nav");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: usuarioLogado } = useGetUsuarioLogadoQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Hook para fechar o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    // Adiciona o listener quando o componente monta
    document.addEventListener("mousedown", handleClickOutside);
    // Remove o listener quando o componente desmonta para evitar memory leaks
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(petsApi.util.resetApiState());
    setDropdownOpen(false);
    setMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/gallery", label: t("gallery") },
    { href: "/about", label: t("about") },
  ];

  const renderLinks = () => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:text-yellow-300 transition hover:border-b"
          onClick={() => setMenuOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  const renderAuthSection = () => {
    if (isAuthenticated && usuarioLogado) {
      const isAdmin = usuarioLogado.cargos.includes("ROLE_ADMIN");
      const isOng = usuarioLogado.cargos.includes("ROLE_ONG");

      return (
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen((prev) => !prev)} /*...*/>
            <FiUser size={20} />
            <span className="font-medium">{usuarioLogado.nome}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 text-black">
              <Link href="/perfil" /*...*/>Meu Perfil</Link>
              {isOng && (
                <>
                  <Link
                    href="/ong/gerenciar-pets"
                    className="block px-4 py-2 text-sm text-purple-700 font-semibold hover:bg-purple-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Gerenciar Meus Pets
                  </Link>
                  <Link
                    href="/ong/chat-dashboard"
                    className="block px-4 py-2 text-sm text-purple-700 font-semibold hover:bg-purple-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard de Chat
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link
                  href="/admin/gerenciar-usuarios"
                  className="block px-4 py-2 text-sm text-red-700 font-semibold hover:bg-red-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Gerenciar Usuários
                </Link>
              )}

              <div className="border-t my-1 border-gray-100"></div>
              <button onClick={handleLogout} /*...*/>
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href="/login"
        className="hover:text-yellow-300 transition hover:border-b"
        onClick={() => setMenuOpen(false)}
      >
        {t("login")}
      </Link>
    );
  };

  return (
    <header className="bg-purple-700 text-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex flex-wrap justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo do Petzon"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-yellow-400">Petzon</span>
        </Link>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        <div className="hidden md:flex items-center gap-6">
          {renderLinks()}
          {renderAuthSection()}
          <LanguageSwitcher />
        </div>

        {menuOpen && (
          <div className="w-full md:hidden flex flex-col items-center gap-6 pt-6 pb-4">
            {renderLinks()}
            {renderAuthSection()}
            <LanguageSwitcher />
          </div>
        )}
      </nav>
    </header>
  );
}
