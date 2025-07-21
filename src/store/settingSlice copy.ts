import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { useGetData } from "../hooks/useGetData";

 
interface SettingData {
 key: string;
 value: string;
  type: string;
 }

interface SettingState {
  setting: SettingData | null;
  settings :  SettingData | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingState = {
  setting: null,
  settings:null,
  loading: false,
  error: null,
};

// ================ getUser ===============
export const getSetting = createAsyncThunk<
  SettingData,
  { id: string }, 
  { rejectValue: string }
>(
  "setting/getSetting",
  async ({ id }, thunkAPI) => {
    try {
      const res = await useGetData<SettingData>(`settings/${id}`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getSetting failed");
    }
  }
);


// ================ getUser ===============
export const getSettings = createAsyncThunk<
  SettingData,
  { id: string }, 
  { rejectValue: string }
>(
  "setting/getSettings",
  async (_, thunkAPI) => {
    try {
      const res = await useGetData<SettingData>(`settings`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getSettings failed");
    }
  }
);
// ================ Slice ===============
const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getSettings 
     .addCase(getSetting.fulfilled, (state, action: PayloadAction<SettingData>) => {
        state.setting = action.payload;
        state.loading = false;
        state.error = null;
      })
      // getSetting
.addCase(getSettings.fulfilled, (state, action: PayloadAction<SettingData>) => {
        state.settings = action.payload;
        state.loading = false;
        state.error = null;
      })       
  },
});

export default settingSlice.reducer;
