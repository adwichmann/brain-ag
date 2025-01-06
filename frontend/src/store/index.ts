import { configureStore } from "@reduxjs/toolkit";
import farmReducer from "./farmSlice";

export const store = configureStore({
  reducer: { farm: farmReducer },
});

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
