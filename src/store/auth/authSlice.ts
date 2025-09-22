import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { insertData } from "../../utils/api"; // ✅ renamed and moved out of hooks
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
  UserData,                     // Return type
  Record<string, unknown>,         // Argument type
  { rejectValue: string }       // Rejection type
>(
  "auth/loginUser",
  async (data, thunkAPI) => {
    try {
      const res = await insertData<typeof data, UserData>("auth/admin/login", data);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "Login failed");
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

   const token = action.payload.data?.access?.token;
  if (token) {
    localStorage.setItem("token", token);
  }

  // ✅ حفظ بيانات المستخدم (اختياري)
  const userInfo = action.payload.data?.authenticatable;
  if (userInfo) {
    localStorage.setItem("userinfo", JSON.stringify(userInfo));
  }
})

      

      
      // get user 
     .addCase(getUser.fulfilled, (state, action: PayloadAction<UserData>) => {
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
