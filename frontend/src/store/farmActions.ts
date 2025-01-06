import { AppDispatch } from ".";
import { farmActions } from "./farmSlice";

export const fetchFarmData = () => {
  return async (dispatch: AppDispatch) => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/farm");
      if (!response.ok) {
        throw new Error("Error on fetch farm data");
      }

      return await response.json();
    };

    try {
      const farmData = await fetchData();
      console.log(farmData);
      dispatch(
        farmActions.replaceFarm({
          farms: farmData || [],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchFarmerData = () => {
  return async (dispatch: AppDispatch) => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/user");
      if (!response.ok) {
        throw new Error("Error on fetch farmer data");
      }

      return await response.json();
    };

    try {
      const farmData = await fetchData();
      console.log(farmData);
      dispatch(
        farmActions.replaceFarmer({
          farmers: farmData || [],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};
