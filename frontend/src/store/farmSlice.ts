import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IFarm,
  IFarmer,
} from "../share/interfaces/app_interfaces";

const initialFarmState: {
  selectedFarmer: IFarmer | null;
  selectedFarm: IFarm | null;
} = {
  selectedFarmer: null,
  selectedFarm: null,
};

const farmSlice = createSlice({
  name: "farm",
  initialState: initialFarmState,
  reducers: {
    setSelectedFarmer(state, action: PayloadAction<IFarmer | null>) {
      state.selectedFarmer = action.payload;
    },
    setSelectedFarm(state, action: PayloadAction<IFarm | null>) {
      state.selectedFarm = action.payload;
    },
  },
});

export const farmActions = farmSlice.actions;
export default farmSlice.reducer;
