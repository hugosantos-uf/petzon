import { baseApi } from "./petsApi"; // Importa a API base
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
    }),
    register: builder.mutation<Usuario, RegisterRequest>({
      query: (userInfo) => ({
        url: "auth/register",
        method: "POST",
        body: userInfo,
      }),
    }),
    getUsuarioLogado: builder.query<Usuario, void>({
      query: () => "auth/usuario-logado",
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUsuarioLogadoQuery,
} = authApi;
