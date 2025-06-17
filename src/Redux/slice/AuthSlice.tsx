import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import useInsertData from "../../hooks/useInsertData";
import { useGetData } from "../../hooks/useGetData";

// Define the data structure for login response
interface LoginResponse {
  data: any;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Define the shape of your initial state
interface AuthState {
  loginUser: LoginResponse | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  loginUser: JSON.parse(localStorage.getItem("user") || 'null'),
  loading: false,
  error: null,
};

console.log(initialState);

// Thunk for admin login
export const adminLogin = createAsyncThunk<
  LoginResponse, // Return type on success
  { email: string; password: string }, // Arguments
  { rejectValue: string } // Reject value type
>("auth/adminLogin", async (data, thunkAPI) => {
  try {
    const res = await useInsertData("/api/login", data);
    return res as unknown as LoginResponse;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(
      e.response?.data?.message || "Login failed"
    );
  }
});

// Thunk for admin logout
export const adminLogOut = createAsyncThunk<
  void, // No return type on success
  void, // No arguments
  { rejectValue: string } // Reject value type
>("auth/adminLogOut", async (_, thunkAPI) => {
  try {
    await useGetData("/api/logout");
  } catch (e: any) {
    return thunkAPI.rejectWithValue(
      e.response?.data?.message || "LogOut failed"
    );
  }
});

// Slice definition
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Add reducers for additional synchronous logic if needed
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        adminLogin.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.loginUser = action.payload;
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      )
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // Admin LogOut
      .addCase(adminLogOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogOut.fulfilled, (state) => {
        state.loading = false;
        state.loginUser = null; // Clear loginUser on logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(adminLogOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

// Export the synchronous action to reset errors if needed
export const { resetError } = authSlice.actions;

export default authSlice.reducer;
