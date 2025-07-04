"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import MultiActionAreaCard from "../../components/multiActionAreaCard/MultiActionAreaCard";
import { useGetPetsQuery } from "@/app/store/api/petsApi";
import type { Pet } from "@/app/store/api/petsApi";

type PetType = "gato" | "cachorro";

export default function Gallery() {
  const t = useTranslations("gallery");
  const navT = useTranslations("nav");
  const [selectedPetType, setSelectedPetType] = useState<PetType>("gato");
  const [page, setPage] = useState(0);

  const { data, error, isLoading } = useGetPetsQuery({
    tipo: selectedPetType,
    page: page,
    size: 8,
  });

  const pets = data?.content;
  const totalPages = data?.totalPages || 0;

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prevPage) =>
      prevPage + 1 < totalPages ? prevPage + 1 : prevPage
    );
  };

  const baseButtonClass =
    "px-4 py-2 rounded-md font-semibold transition-colors duration-150 ease-in-out text-sm sm:text-base shadow-sm";
  const activeButtonClass = "bg-purple-700 text-white hover:bg-purple-800";
  const inactiveButtonClass =
    "bg-white text-purple-700 border border-purple-700 hover:bg-purple-100";

  const renderPetCards = () => {
    if (!pets || pets.length === 0) {
      return (
        <div className="w-full flex justify-center mt-4">
          <div
            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative w-full sm:w-auto text-center"
            role="alert"
          >
            Nenhum {selectedPetType === "gato" ? "gatinho" : "cachorrinho"}{" "}
            encontrado no momento.
          </div>
        </div>
      );
    }

    return pets.map((pet: Pet) => {
      const imageUrl = pet.urlFoto;

      const detailLink = `/gallery/${pet.tipo.toLowerCase()}/${pet.id}`;

      return (
        <div key={pet.id} className="flex justify-center">
          <MultiActionAreaCard
            id={String(pet.id)}
            image={imageUrl}
            alt={pet.nome}
            title={pet.nome}
            description={pet.descricao}
            detailLink={detailLink}
          />
        </div>
      );
    });
  };

  return (
    <main className="flex-1 bg-purple-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800 text-center sm:text-left mb-4 sm:mb-0">
            {t("previewTitle")}
          </h1>
          <div className="flex flex-col sm:flex-row sm:gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
            <button
              onClick={() => {
                setSelectedPetType("gato");
                setPage(0);
              }}
              className={`${baseButtonClass} ${
                selectedPetType === "gato"
                  ? activeButtonClass
                  : inactiveButtonClass
              } w-full sm:w-auto mb-2 sm:mb-0`}
            >
              {navT("cats")}
            </button>
            <button
              onClick={() => {
                setSelectedPetType("cachorro");
                setPage(0);
              }}
              className={`${baseButtonClass} ${
                selectedPetType === "cachorro"
                  ? activeButtonClass
                  : inactiveButtonClass
              } w-full sm:w-auto`}
            >
              {navT("dogs")}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-700"></div>
          </div>
        )}
        {error && (
          <div className="w-full flex justify-center">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full sm:w-auto text-center"
              role="alert"
            >
              Falha ao buscar os pets. Verifique se o backend está rodando.
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {renderPetCards()}
            </div>

            {data && data.totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 0}
                  className="px-4 py-2 bg-purple-700 text-white rounded-md transition hover:bg-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-purple-800 font-semibold">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page + 1 >= totalPages}
                  className="px-4 py-2 bg-purple-700 text-white rounded-md transition hover:bg-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
