import { configureStore } from "@reduxjs/toolkit";
import likeSlice from "../components/multiActionAreaCard/LikeSlice";
import authSlice from "../components/multiActionAreaCard/authSlice";
import { petsApi } from "./api/petsApi"; // Importa a API

export const store = configureStore({
  reducer: {
    like: likeSlice,
    auth: authSlice,
    [petsApi.reducerPath]: petsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(petsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
