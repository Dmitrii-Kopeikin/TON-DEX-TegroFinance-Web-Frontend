import { configureStore } from "@reduxjs/toolkit";
import { accountApiV1 } from "./api/accountApiSlice";
import { authApiV1 } from "./api/authApiSlice";
import { dexApiV1 } from "./api/dexApiSlice";
import { authReducer } from "./features/authSlice";
import { themeReducer } from "./features/themeSlice";
import { dexReducer } from "./features/dexSlice";

export const store = configureStore({
  reducer: {
    [dexApiV1.reducerPath]: dexApiV1.reducer,
    [authApiV1.reducerPath]: authApiV1.reducer,
    [accountApiV1.reducerPath]: accountApiV1.reducer,
    auth: authReducer,
    theme: themeReducer,
    dex: dexReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(dexApiV1.middleware)
      .concat(authApiV1.middleware)
      .concat(accountApiV1.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
