import { createSlice, current } from "@reduxjs/toolkit";
import {
  IChartData,
  ICrop,
  IFarm,
  IFarmer,
  IHarvest,
} from "../share/interfaces/app_interfaces";
import { sumFarmsByState } from "../share/utils/formater";

const initialFarmState: {
  farms: IFarm[];
  farmers: IFarmer[];
  selectedFarmer: IFarmer | null;
  selectedFarm: IFarm | null;
  harvests: IHarvest[];
  crops: ICrop[];
  farmsByState: { [key: string]: number };
  chartsData: IChartData;
  loading: boolean;
} = {
  farms: [],
  farmers: [],
  selectedFarmer: null,
  selectedFarm: null,
  harvests: [],
  crops: [],
  farmsByState: {},
  chartsData: { arable_area: 0, total_area: 0, vegetation_area: 0 },
  loading: false,
};

const farmSlice = createSlice({
  name: "farm",
  initialState: initialFarmState,
  reducers: {
    replaceFarm(state, action) {
      state.farms = action.payload.farms;
      state.farmsByState = sumFarmsByState(action.payload.farms);
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

    replaceCrops(state, action) {
      state.crops = action.payload.crops;
    },
    addCrop(state, action) {
      state.harvests?.push(action.payload.crop);
    },
    getFarmsByState(state) {
      const _farms = current(state.farms);
      state.farmsByState = sumFarmsByState(_farms);

      if (_farms) {
        let total_area = 0;
        let arable_area = 0;
        let vegetation_area = 0;
        _farms.map((farm) => {
          total_area += parseFloat(farm.total_area);
          arable_area += parseFloat(farm.arable_area);
          vegetation_area += parseFloat(farm.vegetation_area);
        });
        state.chartsData.total_area = total_area;
        state.chartsData.arable_area = arable_area;
        state.chartsData.vegetation_area = vegetation_area;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.includes("/pending") && action.type.includes(":load"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.includes("/fulfilled") && action.type.includes(":load"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) =>
          action.type.includes("/rejected") && action.type.includes(":load"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const farmActions = farmSlice.actions;
export default farmSlice.reducer;
