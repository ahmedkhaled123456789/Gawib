import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataToken } from "../utils/api";
 import { useInUpdateData } from "../hooks/useUpdateData";
 import { AxiosError } from "axios";

interface Setting {
  [x: string]: any;
  _id?: string;
  key: string;
  value: string;
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

// ========== Get All ==========
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
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to fetch settings");
  }
});






// ========== Update ==========
export const updateSetting = createAsyncThunk<
  Setting,
  { id: string; data: Partial<Setting> },
  { rejectValue: string }
>(
  "settings/update",
  async ({ id, data }, thunkAPI) => {
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
  }
);




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
      setting._id === action.payload._id ? action.payload : setting
    );
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
