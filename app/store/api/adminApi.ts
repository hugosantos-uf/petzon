import { baseApi } from "./petsApi";
import type { Page, Usuario } from "@/app/types/interfaces";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<Page<Usuario>, { page: number; size: number }>({
      query: ({ page, size }) => `admin/usuarios?page=${page}&size=${size}`,
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ idUsuario }) => ({
                type: "Users" as const,
                id: idUsuario,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    getUsersByName: builder.query<
      Page<Usuario>,
      { nome: string; page: number; size: number }
    >({
      query: ({ nome, page, size }) =>
        `admin/usuarios/nome?nome=${nome}&page=${page}&size=${size}`,
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ idUsuario }) => ({
                type: "Users" as const,
                id: idUsuario,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    promoteToOng: builder.mutation<Usuario, number>({
      query: (userId) => ({
        url: `admin/usuarios/${userId}/promover-ong`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    deactivateUser: builder.mutation<Usuario, number>({
      query: (userId) => ({
        url: `admin/usuarios/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUsersByNameQuery,
  usePromoteToOngMutation,
  useDeactivateUserMutation,
} = adminApi;
