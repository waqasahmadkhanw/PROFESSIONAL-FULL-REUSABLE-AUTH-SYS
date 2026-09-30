import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/modules/auth/store/auth.slice";

export const rootReducer = combineReducers({
  auth: authReducer,
});
