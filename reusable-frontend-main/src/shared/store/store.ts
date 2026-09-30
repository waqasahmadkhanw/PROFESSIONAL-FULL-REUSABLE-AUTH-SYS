import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "./rootReducer";
import { middleware } from "./middleware";
import { env } from "@/shared/config/env";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["register", "rehydrate"],
      },
    }).concat(middleware),
  devTools: env.IS_DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;