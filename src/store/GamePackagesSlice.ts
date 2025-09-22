import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { useGetDataToken } from "../utils/api";
import { useInsertData } from "../hooks/useInsertData";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";

// ========= Types =========
export interface GamePackage {
  data?: any;
  id: string;
  is_active?: string | number | boolean;
  name: string;
  is_free: number;
  price: number;
  games_count: number;
  number_of_buys?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GamePackagesResponse {
  success: boolean;
  status: number;
  message: string;
  data: GamePackage[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

interface GamePackagesState {
  gamePackages: GamePackagesResponse | null;
  gamePackage: GamePackage[] | null;
  loading: boolean;
  error: string | null;
}

// ========= Initial State =========
const initialState: GamePackagesState = {
  gamePackages: null,
  gamePackage: null,
  loading: false,
  error: null,
};

// ========== Thunks ==========

// Get All Packages
export const getGamePackages = createAsyncThunk<
  GamePackagesResponse,
  number,
  { rejectValue: string }
>("gamePackages/getGamePackages", async (page, thunkAPI) => {
  try {
    const res = await useGetDataToken<GamePackagesResponse>(
      `admin/game-packages?page=${page}&sort=-number_of_buys`
    );
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getGamePackages failed"
    );
  }
});

// Get One Package
export const getGamePackageById = createAsyncThunk<
  GamePackage,
  string,
  { rejectValue: string }
>("gamePackages/getGamePackageById", async (id, thunkAPI) => {
  try {
    const res = await useGetDataToken<GamePackage>(`admin/game-packages/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getGamePackageById failed"
    );
  }
});

// Create Package
export const createGamePackage = createAsyncThunk<
  GamePackage,
  Partial<GamePackage>,
  { rejectValue: string }
>("gamePackages/createGamePackage", async (data, thunkAPI) => {
  try {
    const res = await useInsertData<Partial<GamePackage>>(
      `admin/game-packages`,
      data
    );
    thunkAPI.dispatch(getGamePackages(1));
    return res as GamePackage;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "createGamePackage failed"
    );
  }
});

// Update Package
export const updateGamePackage = createAsyncThunk<
  GamePackage,
  { id: string; data: Partial<GamePackage> },
  { rejectValue: string }
>("gamePackages/updateGamePackage", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInUpdateData<Partial<GamePackage>, GamePackage>(
      `admin/game-packages/${id}`,
      data
    );
    thunkAPI.dispatch(getGamePackages(1));
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "updateGamePackage failed"
    );
  }
});

// Delete Package
export const deleteGamePackage = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("gamePackages/deleteGamePackage", async (id, thunkAPI) => {
  try {
    const res = await useDeleteData(`admin/game-packages/${id}`);
    thunkAPI.dispatch(getGamePackages(1));
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "deleteGamePackage failed"
    );
  }
});

// ========== Slice ==========
const gamePackagesSlice = createSlice({
  name: "gamePackages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGamePackages.fulfilled, (state, action) => {
      state.gamePackages = action.payload;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(getGamePackageById.fulfilled, (state, action) => {
      state.gamePackage = action.payload.data;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(createGamePackage.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });

    builder.addCase(updateGamePackage.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });

    builder.addCase(deleteGamePackage.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });

    builder
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      );
  },
});

export default gamePackagesSlice.reducer;
