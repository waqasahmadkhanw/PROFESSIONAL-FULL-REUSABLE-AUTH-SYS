import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, LoginPayload } from "./auth.types";

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  roles: [],
  permissions: [],
  status: "idle",
  error: null,
};



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.status = "loading";
      state.error = null;
    },

    loginSuccess(state, action: PayloadAction<LoginPayload>) {
      state.isAuthenticated = true;
      state.status = "authenticated";
      state.error = null;

      state.userId = action.payload.userId;
      state.roles = action.payload.roles ?? [];
      state.permissions = action.payload.permissions ?? [];
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.status = "unauthenticated";
      state.error = action.payload;
      state.isAuthenticated = false;

      state.userId = null;
      state.roles = [];
      state.permissions = [];
    },

    updatePermissions(state, action: PayloadAction<string[]>) {
      state.permissions = action.payload;
    },

    updateRoles(state, action: PayloadAction<string[]>) {
      state.roles = action.payload;
    },

    clearError(state) {
      state.error = null;
    },

    logout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  updatePermissions,
  updateRoles,
  clearError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;