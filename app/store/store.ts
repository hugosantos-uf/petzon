import { configureStore } from "@reduxjs/toolkit";
import likeSlice from "../components/features/pets/multiActionAreaCard/LikeSlice";
import authSlice from "../components/features/pets/multiActionAreaCard/authSlice";
import { baseApi } from "./api/petsApi"; // Importa a API

export const store = configureStore({
  reducer: {
    like: likeSlice,
    auth: authSlice,
    [baseApi.reducerPath]: baseApi.reducer, // Usa o reducer da API base
  },
  // O middleware da API base já contém os middlewares de todas as APIs injetadas
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
