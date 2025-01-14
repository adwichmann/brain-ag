import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from ".";
import {
  ICrop,
  IFarm,
  IFarmer,
  IHarvest,
} from "../share/interfaces/app_interfaces";
import { getStateByCode } from "../share/utils/formater";
import { farmActions } from "./farmSlice";

const VITE_BACKEND_API_HOST = import.meta.env.VITE_BACKEND_API_HOST;

export const fetchFarmData = createAsyncThunk(
  "farms/fetchFarmData:load",
  async (_payload, { rejectWithValue, dispatch }) => {
    const responseReult = await fetch(`${VITE_BACKEND_API_HOST}/farm`);
    if (responseReult.status !== 200) {
      return rejectWithValue(await responseReult.json());
    }
    const farmData = await responseReult.json();
    farmData.map((farm: IFarm, index: number) => {
      farm.state = {
        name: getStateByCode(farm.state as unknown as string),
        code: farm.state as unknown as string,
      };
      farmData[index] = farm;
    });

    dispatch(
      farmActions.replaceFarm({
        farms: farmData || [],
      })
    );
  }
);

export const fetchFarmerData = createAsyncThunk(
  "farms/fetchFarmerData:load",
  async (_payload, { rejectWithValue, dispatch }) => {
    const responseReult = await fetch(`${VITE_BACKEND_API_HOST}/user`);
    if (responseReult.status !== 200) {
      return rejectWithValue(await responseReult.json());
    }
    const farmerData = await responseReult.json();

    dispatch(
      farmActions.replaceFarmer({
        farmers: farmerData || [],
      })
    );
  }
);

export const updateFarmer = (farmer: IFarmer) => {
  return async (dispatch: AppDispatch) => {
    const farmerData = async (farmer: IFarmer) => {
      const response = await fetch(
        `${VITE_BACKEND_API_HOST}/user/${farmer.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...farmer,
            code: farmer.code.replace(/[^0-9]/g, ""),
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Error on fetch farmer data");
      }

      return await response.json();
    };

    try {
      const farmerUpdated = await farmerData(farmer);
      dispatch(
        farmActions.updateFarmer({
          farmer: farmerUpdated || null,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateFarm = (farm: IFarm) => {
  return async (dispatch: AppDispatch) => {
    const farmData = async (farm: IFarm) => {
      const response = await fetch(`${VITE_BACKEND_API_HOST}/farm/${farm.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...farm,
          user: farm.user.id,
          state: farm.state.code,
        }),
      });
      if (!response.ok) {
        throw new Error("Error on fetch farmer data");
      }

      return await response.json();
    };

    try {
      const farmUpdated = await farmData(farm);

      dispatch(
        farmActions.updateFarm({
          farm: {
            ...farmUpdated,
            state: {
              name: getStateByCode(farmUpdated.state as unknown as string),
              code: farmUpdated.state as unknown as string,
            },
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const createFarm = (farm: Omit<IFarm, "id">) => {
  return async (dispatch: AppDispatch) => {
    const farmData = async (farm: Omit<IFarm, "id">) => {
      const response = await fetch(`${VITE_BACKEND_API_HOST}/farm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...farm, state: farm.state.code }),
      });
      if (!response.ok) {
        throw new Error("Error on create farmer data");
      }

      return await response.json();
    };

    try {
      const farmUpdated = await farmData(farm);
      dispatch(
        farmActions.updateFarm({
          farm: {
            ...farmUpdated,
            state: {
              name: getStateByCode(farmUpdated.state as unknown as string),
              code: farmUpdated.state as unknown as string,
            },
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const createFarmer = (farmer: Omit<IFarmer, "id">) => {
  return async (dispatch: AppDispatch) => {
    const farmerData = async (farmer: Omit<IFarmer, "id">) => {
      const response = await fetch(`${VITE_BACKEND_API_HOST}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...farmer,
          code: farmer.code.replace(/[^0-9]/g, ""),
        }),
      });
      if (!response.ok) {
        throw new Error("Error on create farmer");
      }

      return await response.json();
    };

    try {
      const farmerUpdated = await farmerData(farmer);
      dispatch(
        farmActions.updateFarmer({
          farmer: farmerUpdated || null,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchHarvestsData = () => {
  return async (dispatch: AppDispatch) => {
    const fetchData = async () => {
      const response = await fetch(`${VITE_BACKEND_API_HOST}/harvest`);
      if (!response.ok) {
        throw new Error("Error on fetch harvest data");
      }

      return await response.json();
    };

    try {
      const harvestsData = await fetchData();

      dispatch(
        farmActions.replaceHarvests({
          harvests: harvestsData || [],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const createHarvest = (harverst: Omit<IHarvest, "id">) => {
  return async (dispatch: AppDispatch) => {
    const harvestData = async (harverst: Omit<IHarvest, "id">) => {
      const response = await fetch(`${VITE_BACKEND_API_HOST}/harvest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(harverst),
      });
      if (!response.ok) {
        throw new Error("Error on create farmer");
      }

      return await response.json();
    };

    try {
      const newHarvest = await harvestData(harverst);
      dispatch(
        farmActions.addHarvest({
          harvest: newHarvest || null,
        })
      );
      return newHarvest;
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateHarvest = (harverst: Omit<IHarvest, "name">) => {
  return async (dispatch: AppDispatch) => {
    const harvestData = async (harverst: Omit<IHarvest, "name">) => {
      const response = await fetch(
        `${VITE_BACKEND_API_HOST}/harvest/${harverst.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(harverst),
        }
      );
      if (!response.ok) {
        throw new Error("Error on create farmer");
      }

      return await response.json();
    };

    try {
      const newHarvest = await harvestData(harverst);
      dispatch(
        farmActions.addHarvest({
          harvest: newHarvest || null,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchCropsData = () => {
  return async (dispatch: AppDispatch) => {
    const fetchData = async () => {
      const response = await fetch(`${VITE_BACKEND_API_HOST}/crop`);
      if (!response.ok) {
        throw new Error("Error on fetch crop data");
      }

      return await response.json();
    };

    try {
      const cropData = await fetchData();

      dispatch(
        farmActions.replaceCrops({
          crops: cropData || [],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const createCrop = (crop: Omit<ICrop, "id">) => {
  return async (dispatch: AppDispatch) => {
    const cropData = async (crop: Omit<ICrop, "id">) => {
      const response = await fetch(`${VITE_BACKEND_API_HOST}/crop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(crop),
      });
      if (!response.ok) {
        throw new Error("Error on create crop");
      }

      return await response.json();
    };

    try {
      const newCrop = await cropData(crop);
      dispatch(
        farmActions.addCrop({
          crop: newCrop || null,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteFarm = (farmId: number) => {
  return async () => {
    const farmData = async (farmId: number) => {
      const response = await fetch(`${VITE_BACKEND_API_HOST}/farm/${farmId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error on delete farm");
      }

      return await response.json();
    };

    try {
      await farmData(farmId);
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteFarmer = (farmerId: number) => {
  return async () => {
    const farmData = async (farmerId: number) => {
      const response = await fetch(
        `${VITE_BACKEND_API_HOST}/user/${farmerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error on delete farm");
      }

      return await response.json();
    };

    try {
      await farmData(farmerId);
    } catch (error) {
      console.log(error);
    }
  };
};
