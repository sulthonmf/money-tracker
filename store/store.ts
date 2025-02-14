import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import transactionsReducer from "./transactions/transactionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
