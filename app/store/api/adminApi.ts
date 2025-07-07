import { baseApi } from "./petsApi";
import type { Page, Usuario } from "@/app/types/interfaces";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<Page<Usuario>, void>({
      query: () => "admin/usuarios",
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
  usePromoteToOngMutation,
  useDeactivateUserMutation,
} = adminApi;
