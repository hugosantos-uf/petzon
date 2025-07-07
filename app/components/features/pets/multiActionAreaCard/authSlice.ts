import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token:
    typeof window !== "undefined" ? localStorage.getItem("petzonToken") : null,
  isAuthenticated:
    typeof window !== "undefined"
      ? !!localStorage.getItem("petzonToken")
      : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Salva o token no localStorage para persistir a sessão
      localStorage.setItem("petzonToken", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("petzonToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
