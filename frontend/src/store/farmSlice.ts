import { createSlice } from "@reduxjs/toolkit";
import { IFarm, IFarmer } from "../share/interfaces/app_interfaces";

const initialFarmState: { farms: IFarm[]; farmers: IFarmer[] } = {
  farms: [],
  farmers: [],
};

const farmSlice = createSlice({
  name: "farm",
  initialState: initialFarmState,
  reducers: {
    replaceFarm(state, action) {
      state.farms = action.payload.farms;
    },
    replaceFarmer(state, action) {
      state.farmers = action.payload.farmers;
    },
  },
});

export const farmActions = farmSlice.actions;
export default farmSlice.reducer;
