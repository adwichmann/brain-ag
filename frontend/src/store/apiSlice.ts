import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    ICrop,
    IFarm,
    IFarmer,
    IHarvest,
} from "../share/interfaces/app_interfaces";

const baseUrl = import.meta.env.VITE_BACKEND_API_HOST as string;

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl }),
    tagTypes: ["Farm", "Farmer", "Harvest", "Crop"],
    endpoints: (builder) => ({
        // Farms
        getFarms: builder.query<IFarm[], void>({
            query: () => "/farm",
            providesTags: ["Farm"],
        }),
        createFarm: builder.mutation<IFarm, Omit<IFarm, "id">>({
            query: (newFarm) => ({
                url: "/farm",
                method: "POST",
                body: newFarm,
            }),
            invalidatesTags: ["Farm"],
        }),
        updateFarm: builder.mutation<IFarm, IFarm>({
            query: (farm) => ({
                url: `/farm/${farm.id}`,
                method: "PATCH",
                body: farm,
            }),
            invalidatesTags: ["Farm"],
        }),
        deleteFarm: builder.mutation<{ success: boolean; id: number }, number>({
            query: (id) => ({
                url: `/farm/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Farm"],
        }),

        // Farmers (User in backend)
        getFarmers: builder.query<IFarmer[], void>({
            query: () => "/user",
            providesTags: ["Farmer"],
        }),
        createFarmer: builder.mutation<IFarmer, Omit<IFarmer, "id">>({
            query: (newFarmer) => ({
                url: "/user",
                method: "POST",
                body: newFarmer,
            }),
            invalidatesTags: ["Farmer"],
        }),
        updateFarmer: builder.mutation<IFarmer, IFarmer>({
            query: (farmer) => ({
                url: `/user/${farmer.id}`,
                method: "PATCH",
                body: farmer,
            }),
            invalidatesTags: ["Farmer"],
        }),
        deleteFarmer: builder.mutation<{ success: boolean; id: number }, number>({
            query: (id) => ({
                url: `/user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Farmer"],
        }),

        // Harvests
        getHarvests: builder.query<IHarvest[], void>({
            query: () => "/harvest",
            providesTags: ["Harvest"],
        }),
        createHarvest: builder.mutation<IHarvest, Omit<IHarvest, "id">>({
            query: (newHarvest) => ({
                url: "/harvest",
                method: "POST",
                body: newHarvest,
            }),
            invalidatesTags: ["Harvest", "Farm"],
        }),
        updateHarvest: builder.mutation<IHarvest, Partial<IHarvest> & { id: number }>({
            query: (harvest) => ({
                url: `/harvest/${harvest.id}`,
                method: "PATCH",
                body: harvest,
            }),
            invalidatesTags: ["Harvest", "Farm"],
        }),

        // Crops
        getCrops: builder.query<ICrop[], void>({
            query: () => "/crop",
            providesTags: ["Crop"],
        }),
        createCrop: builder.mutation<ICrop, Omit<ICrop, "id">>({
            query: (newCrop) => ({
                url: "/crop",
                method: "POST",
                body: newCrop,
            }),
            invalidatesTags: ["Crop", "Harvest"],
        }),
    }),
});

export const {
    useGetFarmsQuery,
    useCreateFarmMutation,
    useUpdateFarmMutation,
    useDeleteFarmMutation,
    useGetFarmersQuery,
    useCreateFarmerMutation,
    useUpdateFarmerMutation,
    useDeleteFarmerMutation,
    useGetHarvestsQuery,
    useCreateHarvestMutation,
    useUpdateHarvestMutation,
    useGetCropsQuery,
    useCreateCropMutation,
} = apiSlice;
