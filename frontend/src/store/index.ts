import { configureStore } from "@reduxjs/toolkit";
import farmReducer from "./farmSlice";
import { apiSlice } from "./apiSlice";

export const store = configureStore({
  reducer: {
    farm: farmReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
