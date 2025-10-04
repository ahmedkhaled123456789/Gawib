// settingsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataToken } from "../utils/api";
import { useInUpdateData } from "../hooks/useUpdateData";
import { useInsertData2 } from "../hooks/useInsertData";
import { AxiosError } from "axios";
import useDeleteData from "../hooks/useDeleteData";

export interface Setting {
  id?: number;
  key: string;
  value: string;
  type: string;
}

interface SettingResponse {
  data: Setting[];
}

interface SettingsState {
  settings: SettingResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
};

// ======== GET SETTINGS ========
export const getSettings = createAsyncThunk<
  SettingResponse,
  void,
  { rejectValue: string }
>("settings/getAll", async (_, thunkAPI) => {
  try {
    const res = await useGetDataToken<SettingResponse>(`admin/settings`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "Failed to fetch settings"
    );
  }
});

// ======== UPDATE SETTING ========
export const updateSetting = createAsyncThunk<
  Setting,
  { id: number; data: Partial<Setting> },
  { rejectValue: string }
>("settings/update", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInUpdateData<Partial<Setting>, Setting>(
      `admin/settings/${id}`,
      data
    );
    thunkAPI.dispatch(getSettings());
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "Failed to update setting"
    );
  }
});

// ======== ADD SETTING ========
export const addSetting = createAsyncThunk<
  Setting,
  { key: string; value: string; type: string },
  { rejectValue: string }
>("settings/add", async (data, thunkAPI) => {
  try {
    const res = await useInsertData2<
      Setting,
      { key: string; value: string; type: string }
    >(`admin/settings`, data);
    thunkAPI.dispatch(getSettings());
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "Failed to add setting"
    );
  }
});

// ======== DELETE SETTING ========
export const deleteSetting = createAsyncThunk<
  number, // نرجع الـ id المحذوف
  number, // id المطلوب حذفه
  { rejectValue: string }
>("settings/delete", async (id, thunkAPI) => {
  try {
    await useDeleteData(`admin/settings/${id}`);
    thunkAPI.dispatch(getSettings());
    return id;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "Failed to delete setting"
    );
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

    builder.addCase(updateSetting.fulfilled, (state, action) => {
      if (state.settings) {
        state.settings.data = state.settings.data.map((setting) =>
          setting.id === action.payload.id ? action.payload : setting
        );
      }
      state.loading = false;
      state.error = null;
    });

    builder.addCase(addSetting.fulfilled, (state, action) => {
      if (state.settings) {
        state.settings.data.push(action.payload);
      }
      state.loading = false;
      state.error = null;
    });

    builder.addCase(deleteSetting.fulfilled, (state, action) => {
      if (state.settings) {
        state.settings.data = state.settings.data.filter(
          (setting) => setting.id !== action.payload
        );
      }
      state.loading = false;
      state.error = null;
    });

    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        }
      );
  },
});

export default settingsSlice.reducer;
