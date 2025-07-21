import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { insertData } from "../../utils/api"; // ✅ renamed and moved out of hooks
import { useGetData } from "../../hooks/useGetData";
import { useInUpdateData } from "../../hooks/useUpdateData";
 
interface UserData {
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
interface UpdateUserArgs {
  id: string;
  data: Partial<UserData>; // or any DTO type you use for update
}
// ================ Login ===============
export const loginUser = createAsyncThunk<
  UserData,                     // Return type
  Record<string, unknown>,         // Argument type
  { rejectValue: string }       // Rejection type
>(
  "auth/loginUser",
  async (data, thunkAPI) => {
    try {
      const res = await insertData<typeof data, UserData>("auth/login", data);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "Login failed");
    }
  }
);
 
// ================ Signup ===============
export const signupUser = createAsyncThunk<
  UserData,
  Record<string, unknown>,
  { rejectValue: string }
>(
  "auth/signupUser",
  async (data, thunkAPI) => {
    try {
      const res = await insertData<typeof data, UserData>("auth/register", data);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "Signup failed");
    }
  }
);

// ================ getUser ===============
export const getUser = createAsyncThunk<
  UserData,
  { id: string }, // argument type
  { rejectValue: string }
>(
  "auth/getUser",
  async ({ id }, thunkAPI) => {
    try {
      const res = await useGetData<UserData>(`manage/users/${id}`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getUser failed");
    }
  }
);



// ================ update User ===============
export const updateUser = createAsyncThunk<
  UserData,
  UpdateUserArgs,
  { rejectValue: string }
>(
  "auth/updateUser",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await useInUpdateData<UserData>(`manage/users/${id}`, data);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "فشل في تحديث المستخدم");
    }
  }
);
// ================ log out ===============
export const logOut = createAsyncThunk<
  UserData,
  Record<string, unknown>,
  { rejectValue: string }
>(
  "auth/logout",
  async (data, thunkAPI) => {
    try {
      const res = await insertData<typeof data, UserData>("auth/logout", data);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "Signup failed");
    }
  }
);

// ================ Slice ===============
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      

      // Signup Cases
      
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })

      // get user 
     .addCase(getUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })

      //  update user
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
            // Log Out Cases
      
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
      state.loading = false;
      state.error = null;
      })
     
  },
});

export default authSlice.reducer;
