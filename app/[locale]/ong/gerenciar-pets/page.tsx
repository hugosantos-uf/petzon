/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  useGetAllPetsQuery,
  useGetPetsByNameQuery,
  useDeletePetMutation,
} from "@/app/store/api/petsApi";
import { useGetUsuarioLogadoQuery } from "@/app/store/api/authApi";
import { useAppSelector } from "@/app/hooks/hooks";
import { FiEdit, FiTrash2, FiPlusCircle, FiSearch } from "react-icons/fi";
import { Pet } from "@/app/types/interfaces";
import PetFormModal from "@/app/components/features/admin/PetFormModal";
import { useDebounce } from "@/app/hooks/useDebounce";

export default function GerenciarPetsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: usuarioLogado, isLoading: isLoadingUser } =
    useGetUsuarioLogadoQuery(undefined, { skip: !isAuthenticated });

  const useQueryResult =
    debouncedSearchTerm.trim() !== ""
      ? useGetPetsByNameQuery({
          nome: debouncedSearchTerm,
          page,
          size: 10,
        })
      : useGetAllPetsQuery({ page, size: 10 });

  const { data: petsData, isLoading: isLoadingPets } = useQueryResult;
  const [deletePet] = useDeletePetMutation();

  useEffect(() => {
    if (
      !isLoadingUser &&
      (!isAuthenticated || !usuarioLogado?.cargos.includes("ROLE_ONG"))
    ) {
      router.replace("/");
    }
  }, [isAuthenticated, usuarioLogado, isLoadingUser, router]);

  // Reseta a página para 0 sempre que a busca mudar
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm]);

  const handleOpenModalToAdd = () => {
    setEditingPet(null);
    setIsModalOpen(true);
  };

  const handleOpenModalToEdit = (pet: Pet) => {
    setEditingPet(pet);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este pet?")) {
      try {
        await deletePet(id).unwrap();
        alert("Pet excluído com sucesso!");
      } catch (err) {
        alert("Falha ao excluir o pet.");
      }
    }
  };

  const isLoading = isLoadingUser || isLoadingPets;
  const totalPages = petsData?.totalPages || 0;

  return (
    <>
      {isModalOpen && (
        <PetFormModal pet={editingPet} onClose={() => setIsModalOpen(false)} />
      )}

      <main className="flex-1 bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-purple-800">
              Gerenciamento de Pets
            </h1>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleOpenModalToAdd}
              className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 flex items-center gap-2"
            >
              <FiPlusCircle />
              Adicionar Pet
            </button>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-10">Carregando...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Idade
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {petsData?.content.map((pet: Pet) => (
                    <tr key={pet.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pet.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pet.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pet.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pet.idade} anos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModalToEdit(pet)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(pet.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-4">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0 || isLoading}
                className="px-4 py-2 bg-purple-700 text-white rounded-md disabled:bg-gray-400"
              >
                Anterior
              </button>
              <span className="text-purple-800 font-semibold">
                Página {page + 1} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page + 1 >= totalPages || isLoading}
                className="px-4 py-2 bg-purple-700 text-white rounded-md disabled:bg-gray-400"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
