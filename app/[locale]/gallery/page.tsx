"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import MultiActionAreaCard from "../../components/features/pets/multiActionAreaCard/MultiActionAreaCard";
import {
  useGetAllPetsQuery,
  useGetPetsByTypeQuery,
} from "@/app/store/api/petsApi"; // Importa os dois novos hooks
import type { Pet } from "@/app/types/interfaces";

// Define um tipo para o filtro, incluindo a opção 'todos'
type PetFilterType = "GATO" | "CACHORRO" | "todos";

export default function Gallery() {
  const t = useTranslations("gallery");
  const navT = useTranslations("nav");
  const [filter, setFilter] = useState<PetFilterType>("todos"); // Estado inicial para mostrar todos
  const [page, setPage] = useState(0);

  // Hook para buscar todos os pets. Só é ativado se o filtro for 'todos'.
  const {
    data: allPetsData,
    error: allPetsError,
    isLoading: isLoadingAllPets,
  } = useGetAllPetsQuery({ page, size: 8 }, { skip: filter !== "todos" });

  // Hook para buscar pets por tipo. Só é ativado se o filtro for 'gato' ou 'cachorro'.
  const {
    data: petsByTypeData,
    error: petsByTypeError,
    isLoading: isLoadingPetsByType,
  } = useGetPetsByTypeQuery(
    { tipo: filter, page, size: 8 },
    { skip: filter === "todos" }
  );

  // Determina qual conjunto de dados e estado de loading usar
  const isLoading = filter === "todos" ? isLoadingAllPets : isLoadingPetsByType;
  const error = filter === "todos" ? allPetsError : petsByTypeError;
  const data = filter === "todos" ? allPetsData : petsByTypeData;

  const pets = data?.content;
  const totalPages = data?.totalPages || 0;

  const handleFilterChange = (newFilter: PetFilterType) => {
    setFilter(newFilter);
    setPage(0); // Reseta a página ao mudar o filtro
  };

  const handlePreviousPage = () => setPage((p) => Math.max(p - 1, 0));
  const handleNextPage = () => setPage((p) => (p + 1 < totalPages ? p + 1 : p));

  const renderPetCards = () => {
    if (!pets || pets.length === 0) {
      return (
        <div className="col-span-full text-center p-4">
          Nenhum pet encontrado.
        </div>
      );
    }

    return pets.map((pet: Pet) => {
      const imageUrl = pet.urlFoto; // URL completa do S3
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

  const baseButtonClass =
    "px-4 py-2 rounded-md font-semibold transition-colors duration-150 ease-in-out text-sm sm:text-base shadow-sm";
  const activeButtonClass = "bg-purple-700 text-white hover:bg-purple-800";
  const inactiveButtonClass =
    "bg-white text-purple-700 border border-purple-700 hover:bg-purple-100";

  return (
    <main className="flex-1 bg-purple-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800 text-center sm:text-left mb-4 sm:mb-0">
            {t("previewTitle")}
          </h1>
          <div className="flex flex-col sm:flex-row sm:gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
            <button
              onClick={() => handleFilterChange("todos")}
              className={`${baseButtonClass} ${
                filter === "todos" ? activeButtonClass : inactiveButtonClass
              } w-full sm:w-auto mb-2 sm:mb-0`}
            >
              Todos
            </button>
            <button
              onClick={() => handleFilterChange("GATO")}
              className={`${baseButtonClass} ${
                filter === "GATO" ? activeButtonClass : inactiveButtonClass
              } w-full sm:w-auto mb-2 sm:mb-0`}
            >
              {navT("cats")}
            </button>
            <button
              onClick={() => handleFilterChange("CACHORRO")}
              className={`${baseButtonClass} ${
                filter === "CACHORRO" ? activeButtonClass : inactiveButtonClass
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
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center"
              role="alert"
            >
              Falha ao buscar os pets. Tente novamente.
            </div>
          </div>
        )}
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {renderPetCards()}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 0}
                  className="px-4 py-2 bg-purple-700 text-white rounded-md disabled:bg-gray-400"
                >
                  Anterior
                </button>
                <span className="text-purple-800 font-semibold">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page + 1 >= totalPages}
                  className="px-4 py-2 bg-purple-700 text-white rounded-md disabled:bg-gray-400"
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
