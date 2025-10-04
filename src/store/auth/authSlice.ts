import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { insertData } from "../../utils/api";
import { useGetData } from "../../hooks/useGetData";

interface UserData {
  data: any;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// ================ Login ===============
export const loginUser = createAsyncThunk<
  UserData, // return type
  Record<string, unknown>, // argument type
  { rejectValue: string }
>("auth/loginUser", async (data, thunkAPI) => {
  try {
    const res = await insertData<typeof data, UserData>(
      "auth/admin/login",
      data
    );
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "Login failed"
    );
  }
});

// ================ getUser ===============
export const getUser = createAsyncThunk<
  UserData,
  { id: string },
  { rejectValue: string }
>("auth/getUser", async ({ id }, thunkAPI) => {
  try {
    const res = await useGetData<UserData>(`manage/users/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getUser failed"
    );
  }
});

// ================ Log Out ===============
export const logOut = createAsyncThunk<
  UserData,
  Record<string, unknown>,
  { rejectValue: string }
>("auth/logout", async (data, thunkAPI) => {
  try {
    const res = await insertData<typeof data, UserData>("auth/logout", data);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "Logout failed"
    );
  }
});

// ================ Slice ===============
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== Login =====
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserData>) => {
          state.user = action.payload;
          state.loading = false;
          state.error = null;

          // حفظ الـ token
          const token = action.payload.data?.access?.token;
          if (token) {
            localStorage.setItem("token", token);
          }

          // حفظ بيانات المستخدم
          const userInfo = action.payload.data?.authenticatable;
          if (userInfo) {
            localStorage.setItem("userinfo", JSON.stringify(userInfo));
          }
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ===== Get User =====
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ===== Log Out =====
      .addCase(logOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;

        // مسح البيانات من localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userinfo");
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
