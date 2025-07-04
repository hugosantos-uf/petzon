"use client";

import React, { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  useGetUsuarioLogadoQuery,
  useGetUsersQuery,
  usePromoteToOngMutation,
} from "@/app/store/api/petsApi";
import { useAppSelector } from "@/app/hooks/hooks";
import { FiCheckCircle } from "react-icons/fi";

export default function GerenciarUsuariosPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: usuarioLogado, isLoading: isLoadingUser } =
    useGetUsuarioLogadoQuery(undefined, { skip: !isAuthenticated });

  const { data: usersPage, isLoading: isLoadingUsers } = useGetUsersQuery();
  const [promoteToOng, { isLoading: isPromoting }] = usePromoteToOngMutation();

  useEffect(() => {
    if (
      !isLoadingUser &&
      (!isAuthenticated || !usuarioLogado?.cargos.includes("ROLE_ADMIN"))
    ) {
      router.replace("/");
    }
  }, [isAuthenticated, usuarioLogado, isLoadingUser, router]);

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

  const isLoading = isLoadingUser || isLoadingUsers;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-700"></div>
      </div>
    );
  }

  if (isAuthenticated && usuarioLogado?.cargos.includes("ROLE_ADMIN")) {
    return (
      <main className="flex-1 bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-purple-800 mb-6">
            Gerenciamento de Usuários
          </h1>
          <div className="overflow-x-auto">
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
                {/* *** A CORREÇÃO PRINCIPAL ESTÁ AQUI *** */}
                {/* Mapeamos a propriedade 'content' do objeto de página */}
                {usersPage?.content.map((user) => (
                  <tr key={user.idUsuario}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        {user.cargos.map((cargo) => (
                          <span
                            key={cargo}
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              cargo === "ROLE_ADMIN"
                                ? "bg-red-100 text-red-800"
                                : cargo === "ROLE_ONG"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {cargo.replace("ROLE_", "")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!user.cargos.includes("ROLE_ADMIN") &&
                        !user.cargos.includes("ROLE_ONG") && (
                          <button
                            onClick={() => handlePromote(user.idUsuario)}
                            disabled={isPromoting}
                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
                          >
                            Promover para ONG
                          </button>
                        )}
                      {user.cargos.includes("ROLE_ONG") &&
                        !user.cargos.includes("ROLE_ADMIN") && (
                          <span className="flex items-center justify-end gap-1 text-green-600 text-xs font-semibold">
                            <FiCheckCircle /> ONG
                          </span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
