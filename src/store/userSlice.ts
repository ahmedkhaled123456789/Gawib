import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useGetDataToken } from "../utils/api";
import { AxiosError } from "axios";
import { useInsertData } from "../hooks/useInsertData";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";

interface UserData {
  data?: any;
  firstName: string;
  lastName: string;
  email: string;
  status:number;
  phone: string;
  password?: string;
  confirmPassword?: string;
}

interface UserState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// ==================== getUser ====================
export const getUser = createAsyncThunk<UserData, void, { rejectValue: string }>(
  "user/getUser",
  async (_, thunkAPI) => {
    try {
      const res = await useGetDataToken<UserData>(`admin/users`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getUser failed");
    }
  }
);

// ==================== createUser ====================
export const createUser = createAsyncThunk<UserData, UserData, { rejectValue: string }>(
  "user/createUser",
  async (userData, thunkAPI) => {
    try {
      const res = await useInsertData<UserData>(`admin/users`, userData);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "createUser failed");
    }
  }
);

// ==================== updateUser ====================
export const updateUser = createAsyncThunk<
  UserData,
  { id: string; formData: Partial<UserData> },
  { rejectValue: string }
>(
  "user/updateUser",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await useInUpdateData<Partial<UserData>, UserData>(
        `admin/users/${id}`,
        formData
      );

      thunkAPI.dispatch(getUser());

      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        err.response?.data.message || "updateUser failed"
      );
    }
  }
);



// ==================== deleteUser ====================
export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
  "user/deleteUser",
  async (id, thunkAPI) => {
    try {
      await useDeleteData(`admin/users/${id}`);
      return id; // Return deleted ID so we can remove from state
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "deleteUser failed");
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ===== GET =====
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching user";
      });

    // ===== CREATE =====
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error creating user";
      });

    // ===== UPDATE =====
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.loading = false;
      });

    // ===== DELETE =====
    builder
      .addCase(deleteUser.fulfilled, (state, action) => {
        if (state.user && state.user.data?._id === action.payload) {
          state.user = null; // Remove deleted user from state
        }
        state.loading = false;
      });
  },
});

export default userSlice.reducer;

