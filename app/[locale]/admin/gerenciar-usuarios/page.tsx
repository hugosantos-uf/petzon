"use client";

import React, { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  useGetUsersQuery,
  usePromoteToOngMutation,
  useDeactivateUserMutation,
} from "@/app/store/api/adminApi";
import { useGetUsuarioLogadoQuery } from "@/app/store/api/authApi";
import { useAppSelector } from "@/app/hooks/hooks";
import { FiTrash2 } from "react-icons/fi";

export default function GerenciarUsuariosPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: usuarioLogado, isLoading: isLoadingUser } =
    useGetUsuarioLogadoQuery(undefined, { skip: !isAuthenticated });

  const { data: usersPage, isLoading: isLoadingUsers } = useGetUsersQuery();
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
                          <span key={cargo} /*...*/>
                            {cargo.replace("ROLE_", "")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-4">
                      {/* Lógica de Ações */}
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
          </div>
        </div>
      </main>
    );
  }

  return null;
}
