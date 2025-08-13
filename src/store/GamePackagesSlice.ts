import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetData, useGetDataToken } from "../utils/api";
import { AxiosError } from "axios";
import {useInsertData} from "../hooks/useInsertData";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";

interface GamePackage {
  is_active: number;
  name: string;
  is_free: number;
  price: number;
  games_count: number;
}

interface GamePackagesState {
  gamePackages: GamePackage | null;
  loading: boolean;
  error: string | null;
}

const initialState: GamePackagesState = {
  gamePackages: null,
  loading: false,
  error: null,
};

// ========== Get All ==========
export const getGamePackages = createAsyncThunk<
  GamePackage,
  void,
  { rejectValue: string }
>("gamePackages/getGamePackages", async (_, thunkAPI) => {
  try {
    const res = await useGetDataToken<GamePackage>("admin/game-packages");
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "getGamePackages failed");
  }
});

// ========== Get One ==========
export const getGamePackageById = createAsyncThunk<
  GamePackage,
  string,
  { rejectValue: string }
>("gamePackages/getGamePackageById", async (id, thunkAPI) => {
  try {
    const res = await useGetData<GamePackage>(`admin/game-packages/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "getGamePackageById failed");
  }
});

// ========== Create ==========
export const createGamePackage = createAsyncThunk<
  GamePackage,
  GamePackage,
  { rejectValue: string }
>(
  "gamePackages/createGamePackage",
  async (data, thunkAPI) => {
    try {
      const res = await useInsertData<GamePackage>(`admin/game-packages`, data);
       thunkAPI.dispatch(getGamePackages());
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        err.response?.data.message || "createGamePackage failed"
      );
    }
  }
);


// ========== Update ==========
export const updateGamePackage = createAsyncThunk<
  GamePackage,
  { id: string; data: GamePackage },
  { rejectValue: string }
>("gamePackages/updateGamePackage", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInUpdateData<GamePackage>(`admin/game-packages/${id}`, data);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "updateGamePackage failed");
  }
});

// ========== Delete ==========
export const deleteGamePackage = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("gamePackages/deleteGamePackage", async (id, thunkAPI) => {
  try {
    const res = await useDeleteData(`admin/game-packages/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "deleteGamePackage failed");
  }
});

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
      state.gamePackages = action.payload;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(createGamePackage.fulfilled, (state) => {
       state.loading = false;
      state.error = null;
    });

    builder.addCase(updateGamePackage.fulfilled, (state, action) => {
      state.gamePackages = action.payload;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(deleteGamePackage.fulfilled, (state) => {
      state.gamePackages = null;
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
