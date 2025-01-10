import { createSlice } from "@reduxjs/toolkit";
import {
  ICrop,
  IFarm,
  IFarmer,
  IHarvest,
} from "../share/interfaces/app_interfaces";

const initialFarmState: {
  farms: IFarm[];
  farmers: IFarmer[];
  selectedFarmer: IFarmer | null;
  selectedFarm: IFarm | null;
  harvests: IHarvest[];
  crops: ICrop[];
} = {
  farms: [],
  farmers: [],
  selectedFarmer: null,
  selectedFarm: null,
  harvests: [],
  crops: [],
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
    setSelectedFarmer(state, action) {
      state.selectedFarmer = action.payload;
    },
    updateFarmer(state, action) {
      const existingFarmerIndex = state.farmers.findIndex((item) => {
        return item.id === Number(action.payload.farmer.id);
      });
      if (existingFarmerIndex !== -1) {
        state.farmers[existingFarmerIndex] = action.payload.farmer;
        state.selectedFarmer = action.payload.farmer;
      } else {
        state.farmers.push(action.payload.farmer);
      }
    },
    setSelectedFarm(state, action) {
      state.selectedFarm = action.payload;
    },
    updateFarm(state, action) {
      const existingFarmIndex = state.farms.findIndex((item) => {
        return item.id === Number(action.payload.farm.id);
      });
      if (existingFarmIndex !== -1) {
        state.farms[existingFarmIndex] = action.payload.farm;
        state.selectedFarm = action.payload.farm;
      } else {
        state.farms.push(action.payload.farm);
      }
    },
    replaceHarvests(state, action) {
      state.harvests = action.payload.harvests;
    },
    addHarvest(state, action) {
      state.harvests?.push(action.payload.harvest);
    },

    replaceHCrops(state, action) {
      state.crops = action.payload.crops;
    },
    addCrop(state, action) {
      state.harvests?.push(action.payload.crop);
    },
  },
});

export const farmActions = farmSlice.actions;
export default farmSlice.reducer;
