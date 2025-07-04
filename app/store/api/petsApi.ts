import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store"; // Importar RootState

// Interface para a resposta paginada
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

// Interface do Pet (pode manter a mesma)
interface Responsavel {
  idUsuario: number;
  nome: string;
  email: string;
}

// ATUALIZE A INTERFACE PET AQUI
export interface Pet {
  id: number;
  tipo: "CACHORRO" | "GATO";
  nome: string;
  temperamento: string;
  descricao: string;
  idade: number;
  urlFoto: string;
  responsavel?: Responsavel; // <-- CAMPO ADICIONADO AQUI
}

export interface PetCadastroDto {
  tipo: "CACHORRO" | "GATO";
  nome: string;
  temperamento: string;
  descricao: string;
  idade: number;
  urlFoto: string;
}

export interface ChatMessage {
  id: number;
  content: string;
  sender: { idUsuario: number; nome: string };
  recipient: { idUsuario: number; nome: string };
  timestamp: string;
  conversationId: string;
}

// Interfaces para os DTOs de login e cadastro
interface LoginRequest {
  email: string;
  senha: string;
}

interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

interface TokenResponse {
  token: string;
}

export interface UsuarioLogado {
  idUsuario: number;
  nome: string;
  email: string;
  cargos: string[];
}

export interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  cargos: string[];
  ativo: boolean;
}

export interface ConversationSummary {
  conversationId: string;
  petNome: string;
  usuarioNome: string;
  ultimaMensagem: string;
  timestamp: string;
}

export const petsApi = createApi({
  reducerPath: "petsApi",
  // Modifica a baseQuery para incluir o token dinamicamente
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Pet", "Chat", "ChatConversations", "Users"],
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: (userInfo) => ({
        url: "auth/register",
        method: "POST",
        body: userInfo,
      }),
    }),
    getUsuarioLogado: builder.query<UsuarioLogado, void>({
      query: () => "auth/usuario-logado",
    }),
    getChatHistory: builder.query<ChatMessage[], string>({
      query: (conversationId) => `chat/history/${conversationId}`,
      providesTags: ["Chat"],
    }),
    getOngConversations: builder.query<ConversationSummary[], void>({
      query: () => `ong/chat/conversations`,
      providesTags: ["ChatConversations"],
    }),

    getAllPets: builder.query<Page<Pet>, { page: number; size: number }>({
      query: ({ page, size }) => {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        return `pets?${params.toString()}`;
      },
      // A lógica de cache para a lista geral
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: "Pet" as const, id })),
              { type: "Pet", id: "LIST" },
            ]
          : [{ type: "Pet", id: "LIST" }],
    }),

    // NOVO ENDPOINT para listar pets FILTRADOS POR TIPO e de forma paginada
    getPetsByType: builder.query<
      Page<Pet>,
      { tipo: string; page: number; size: number }
    >({
      query: ({ tipo, page, size }) => {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        // A URL agora é construída com o novo formato
        return `pets/tipo?tipo=${tipo}&${params.toString()}`;
      },
      // A lógica de cache é a mesma, mas se aplicará a este endpoint específico
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: "Pet" as const, id })),
              { type: "Pet", id: "LIST" },
            ]
          : [{ type: "Pet", id: "LIST" }],
    }),
    getUsers: builder.query<Page<Usuario>, void>({
      // <-- CORREÇÃO AQUI: Retorna Page<Usuario>
      query: () => "admin/usuarios",
      providesTags: (result) => {
        // A lógica de cache precisa acessar result.content
        if (result && Array.isArray(result.content)) {
          return [
            ...result.content.map(({ idUsuario }) => ({
              type: "Users" as const,
              id: idUsuario,
            })),
            { type: "Users", id: "LIST" },
          ];
        }
        return [{ type: "Users", id: "LIST" }];
      },
    }),

    promoteToOng: builder.mutation<Usuario, number>({
      query: (userId) => ({
        url: `admin/usuarios/${userId}/promover-ong`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    deactivateUser: builder.mutation<Usuario, number>({
      query: (userId) => ({
        url: `admin/usuarios/${userId}`,
        method: "DELETE",
      }),
      // Invalida a lista de usuários para atualizar a interface
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    getPetById: builder.query<Pet, string>({
      query: (id) => `pets/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Pet", id }],
    }),

    addPet: builder.mutation<Pet, FormData>({
      query: (formData) => ({
        url: "pets",
        method: "POST",
        body: formData,
      }),
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
      query: (id) => ({
        url: `pets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Pet", id: "LIST" }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetAllPetsQuery,
  useGetPetsByTypeQuery,
  useGetPetByIdQuery,
  useGetUsuarioLogadoQuery,
  useGetChatHistoryQuery,
  useAddPetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
  useGetOngConversationsQuery,
  useGetUsersQuery,
  usePromoteToOngMutation,
  useDeactivateUserMutation,
} = petsApi;
