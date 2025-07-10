/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  useGetUsersQuery,
  useGetUsersByNameQuery,
  usePromoteToOngMutation,
  useDeactivateUserMutation,
} from "@/app/store/api/adminApi";
import { useGetUsuarioLogadoQuery } from "@/app/store/api/authApi";
import { useAppSelector } from "@/app/hooks/hooks";
import { FiTrash2, FiSearch } from "react-icons/fi";
import { useDebounce } from "@/app/hooks/useDebounce";

export default function GerenciarUsuariosPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: usuarioLogado, isLoading: isLoadingUser } =
    useGetUsuarioLogadoQuery(undefined, { skip: !isAuthenticated });

  const useQueryResult =
    debouncedSearchTerm.trim() !== ""
      ? useGetUsersByNameQuery({
          nome: debouncedSearchTerm,
          page,
          size: 10,
        })
      : useGetUsersQuery({ page, size: 10 });

  const { data: usersPage, isLoading: isLoadingUsers } = useQueryResult;

  const [promoteToOng, { isLoading: isPromoting }] = usePromoteToOngMutation();
  const [deactivateUser, { isLoading: isDeactivating }] =
    useDeactivateUserMutation();

  useEffect(() => {
    if (
      !isLoadingUser &&
      (!isAuthenticated || !usuarioLogado?.cargos.includes("ROLE_ADMIN"))
    ) {
      router.replace("/");
    }
  }, [isAuthenticated, usuarioLogado, isLoadingUser, router]);

  // Reseta a página para 0 sempre que a busca mudar
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm]);

  const handlePromote = async (userId: number) => {
    if (
      window.confirm("Tem certeza que deseja promover este usuário para ONG?")
    ) {
      try {
        await promoteToOng(userId).unwrap();
        alert("Usuário promovido com sucesso!");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        alert("Falha ao promover o usuário.");
      }
    }
  };

  const handleDeactivate = async (userId: number, userName: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja DESATIVAR o usuário ${userName}? Ele perderá o acesso ao sistema.`
      )
    ) {
      try {
        await deactivateUser(userId).unwrap();
        alert("Usuário desativado com sucesso!");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        alert(
          "Ocorreu um erro. Lembre-se que um admin não pode desativar a si mesmo."
        );
      }
    }
  };

  const isLoading = isLoadingUser || isLoadingUsers;
  const totalPages = usersPage?.totalPages || 0;

  return (
    <main className="flex-1 bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-purple-800">
            Gerenciamento de Usuários
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
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-10">Carregando...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cargos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usersPage?.content.map((user) => (
                  <tr
                    key={user.idUsuario}
                    className={!user.ativo ? "bg-gray-100 text-gray-400" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.nome} {!user.ativo && "(Inativo)"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {user.cargos.map((cargo) => (
                          <span
                            key={cargo}
                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800"
                          >
                            {cargo.replace("ROLE_", "")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-4">
                      {!user.cargos.includes("ROLE_ADMIN") && user.ativo && (
                        <>
                          {!user.cargos.includes("ROLE_ONG") && (
                            <button
                              onClick={() => handlePromote(user.idUsuario)}
                              disabled={isPromoting}
                              className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
                            >
                              Promover para ONG
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleDeactivate(user.idUsuario, user.nome)
                            }
                            disabled={isDeactivating}
                            className="text-white bg-red-600 hover:bg-red-700 p-2 rounded-md text-xs disabled:bg-gray-400"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Controles de Paginação */}
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
  );
}
