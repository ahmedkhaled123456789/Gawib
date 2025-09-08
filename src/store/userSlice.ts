import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useGetDataToken } from "../utils/api";
import { AxiosError } from "axios";
import { useInsertData } from "../hooks/useInsertData";
import { useInUpdateData } from "../hooks/useUpdateData";

interface UserItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: number;
}

interface UsersResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    current_page: number;
    data: UserItem[];
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface UserState {
  users: UsersResponse | null;
  user: UsersResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: null,
  user: null,
  loading: false,
  error: null,
};

// ==================== getUser ====================
export const getUser = createAsyncThunk<UsersResponse, number, { rejectValue: string }>(
  "user/getUser",
  async (page, thunkAPI) => {
    try {
      const res = await useGetDataToken<UsersResponse>(`admin/users?page=${page}`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getUser failed");
    }
  }
);


// ==================== createUser ====================
export const createUser = createAsyncThunk<UsersResponse, UsersResponse, { rejectValue: string }>(
  "user/createUser",
  async (userData, thunkAPI) => {
    try {
      const res = await useInsertData<UsersResponse>(`admin/users`, userData);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "createUser failed");
    }
  }
);

// ==================== updateUser ====================
export const updateUser = createAsyncThunk<
  UsersResponse,
  { id: string; formData: Partial<UsersResponse> },
  { rejectValue: string }
>(
  "user/updateUser",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await useInUpdateData<Partial<UsersResponse>, UsersResponse>(
        `admin/users/${id}`,
        formData
      );

      thunkAPI.dispatch(getUser(1));

      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        err.response?.data.message || "updateUser failed"
      );
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
      .addCase(getUser.fulfilled, (state, action: PayloadAction<UsersResponse>) => {
        state.users = action.payload;
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
        state.users = action.payload;
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

    
  },
});

export default userSlice.reducer;

