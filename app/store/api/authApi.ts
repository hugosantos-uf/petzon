import { baseApi } from "./petsApi";
import type { Usuario } from "@/app/types/interfaces";

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

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Users"],
    }),
    register: builder.mutation<Usuario, RegisterRequest>({
      query: (userInfo) => ({
        url: "auth/register",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["Users"],
    }),
    getUsuarioLogado: builder.query<Usuario, void>({
      query: () => "auth/usuario-logado",
      providesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUsuarioLogadoQuery,
} = authApi;
