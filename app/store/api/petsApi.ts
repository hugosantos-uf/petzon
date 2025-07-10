import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Page, Pet, PetCadastroDto } from "@/app/types/interfaces";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("authorization", `${token}`);
      return headers;
    },
  }),
  tagTypes: ["Pet", "Chat", "ChatConversations", "Users"],
  endpoints: () => ({}), // Endpoints serão injetados
});

export const petsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPets: builder.query<Page<Pet>, { page: number; size: number }>({
      query: ({ page, size }) => `pets?page=${page}&size=${size}`,
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: "Pet" as const, id })),
              { type: "Pet", id: "LIST" },
            ]
          : [{ type: "Pet", id: "LIST" }],
    }),
    getPetsByName: builder.query<
      Page<Pet>,
      { nome: string; page: number; size: number }
    >({
      query: ({ nome, page, size }) =>
        `pets/nome?nome=${nome}&page=${page}&size=${size}`,
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: "Pet" as const, id })),
              { type: "Pet", id: "LIST" },
            ]
          : [{ type: "Pet", id: "LIST" }],
    }),
    getPetsByType: builder.query<
      Page<Pet>,
      { tipo: string; page: number; size: number }
    >({
      query: ({ tipo, page, size }) =>
        `pets/tipo?tipo=${tipo}&page=${page}&size=${size}`,
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: "Pet" as const, id })),
              { type: "Pet", id: "LIST" },
            ]
          : [{ type: "Pet", id: "LIST" }],
    }),
    getPetById: builder.query<Pet, string>({
      query: (id) => `pets/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Pet", id: Number(id) }],
    }),
    addPet: builder.mutation<Pet, FormData>({
      query: (formData) => ({ url: "pets", method: "POST", body: formData }),
      invalidatesTags: [{ type: "Pet", id: "LIST" }],
    }),
    updatePet: builder.mutation<
      Pet,
      { id: number | string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `pets/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Pet", id: Number(id) },
        { type: "Pet", id: "LIST" },
      ],
    }),
    deletePet: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({ url: `pets/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Pet", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllPetsQuery,
  useGetPetsByNameQuery,
  useGetPetsByTypeQuery,
  useGetPetByIdQuery,
  useAddPetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
} = petsApi;
