import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { insertData } from "../utils/api";

interface UserData {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}

interface AuthState {
  user: UserData | null;
  email: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  email: null,
  loading: false,
  error: null,
};

// ================ Send Reset Email ===============
export const resetPasswordEmail = createAsyncThunk<
  string, // Return type (email string)
  Record<string, unknown>, // Input type (form data)
  { rejectValue: string }
>(
  "auth/resetPasswordEmail",
  async (data, thunkAPI) => {
    try {
      const res = await insertData<typeof data, { email: string }>("password/reset-link", data);
      return res.email;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "Reset email failed");
    }
  }
);

// ================ Reset Password ===============
export const resetPassword = createAsyncThunk<
  UserData, // Return user data after password reset
  Record<string, unknown>,
  { rejectValue: string }
>(
  "auth/resetPassword",
  async (data, thunkAPI) => {
    try {
      const res = await insertData<typeof data, UserData>("password/reset", data);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "Password reset failed");
    }
  }
);

// ================ Slice ===============
const resetPasswordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== Reset Email ==========
      
      .addCase(resetPasswordEmail.fulfilled, (state, action: PayloadAction<string>) => {
        state.email = action.payload;
        state.loading = false;
      })
      
      // ========== Reset Password ==========
      
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        state.loading = false;
      })
     
  },
});

export const { clearError } = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
