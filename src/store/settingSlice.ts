import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetData } from "../utils/api";
import {useInsertData} from "../hooks/useInsertData";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";
import { AxiosError } from "axios";

interface Setting {
  _id?: string;
  key: string;
  value: string;
}

interface SettingsState {
  settings: Setting[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
};

// ========== Get All ==========
export const getSettings = createAsyncThunk<
  Setting[],
  void,
  { rejectValue: string }
>("settings/getAll", async (_, thunkAPI) => {
  try {
    const res = await useGetData<Setting[]>(`admin/settings`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to fetch settings");
  }
});

// ========== Get One ==========
export const getSettingById = createAsyncThunk<
  Setting,
  string,
  { rejectValue: string }
>("settings/getOne", async (id, thunkAPI) => {
  try {
    const res = await useGetData<Setting>(`admin/settings/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to fetch setting");
  }
});

// ========== Create ==========
export const createSetting = createAsyncThunk<
  Setting,
  Setting,
  { rejectValue: string }
>(
  "settings/create",
  async (data, thunkAPI) => {
    try {
      const res = await useInsertData<Setting>(`admin/settings`, data);
       thunkAPI.dispatch(getSettings());
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        err.response?.data.message || "Failed to create setting"
      );
    }
  }
);


// ========== Update ==========
export const updateSetting = createAsyncThunk<
  Setting,
  { id: string; data: Setting },
  { rejectValue: string }
>("settings/update", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInUpdateData<Setting>(`admin/settings/${id}`, data);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to update setting");
  }
});

// ========== Delete ==========
export const deleteSetting = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("settings/delete", async (id, thunkAPI) => {
  try {
    const res = await useDeleteData(`admin/settings/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to delete setting");
  }
});

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSettings.fulfilled, (state, action) => {
      state.settings = action.payload;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(getSettingById.fulfilled, (state, action) => {
      state.settings = [action.payload];
      state.loading = false;
      state.error = null;
    });

    builder.addCase(createSetting.fulfilled, (state) => {
       state.loading = false;
      state.error = null;
    });

    builder.addCase(updateSetting.fulfilled, (state, action) => {
      if (state.settings) {
        state.settings = state.settings.map((setting) =>
          setting._id === action.payload._id ? action.payload : setting
        );
      }
      state.loading = false;
      state.error = null;
    });

    builder.addCase(deleteSetting.fulfilled, (state, action) => {
      if (state.settings) {
        state.settings = state.settings.filter((setting) => setting._id !== action.meta.arg);
      }
      state.loading = false;
      state.error = null;
    });

    builder
      .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.endsWith("/rejected"), (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default settingsSlice.reducer;
