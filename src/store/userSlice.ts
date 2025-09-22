// src/store/userSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { useGetDataToken } from "../utils/api";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";

export interface UserItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: boolean;
  nationality?: string;
  created_at?: string;
  played_games?: number;
  total_purchases_amount?: number;
}

export interface UsersResponse {
  success: boolean;
  status: boolean;
  message: string;
  data: UserItem[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

interface UserState {
  users: UsersResponse | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  searchQuery: string;
}

const initialState: UserState = {
  users: null,
  loading: false,
  error: null,
  currentPage: 1,
  searchQuery: "",
};

// ==================== getUser ====================
export const getUser = createAsyncThunk<
  UsersResponse,
  { page?: number; search?: string },
  { rejectValue: string }
>("user/getUser", async ({ page = 1, search = "" }, thunkAPI) => {
  try {
    const query = search ? `&filter[search]=${search}` : "";
    const res = await useGetDataToken<UsersResponse>(
      `admin/users?page=${page}${query}`
    );
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getUser failed"
    );
  }
});

// ==================== updateUser ====================
export const updateUser = createAsyncThunk<
  UserItem,
  { id: string; status: boolean },
  { rejectValue: string }
>("user/updateUser", async ({ id, status }, thunkAPI) => {
  try {
    // useInUpdateData بيرجع الشكل: { success, status, message, data }
    const res = await useInUpdateData<{ status: boolean }, { data: UserItem }>(
      `admin/users/${id}`,
      { status }
    );
    return res.data; // ✅ فقط الـ user updated
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "updateUser failed"
    );
  }
});

// ==================== deleteUser ====================
export const deleteUser = createAsyncThunk<
  number, // بنرجع الـ id المحذوف
  string, // id المستخدم للحذف
  { rejectValue: string }
>("user/deleteUser", async (id, thunkAPI) => {
  try {
    // useDeleteData بيرجع الشكل: { success, status, message }
    await useDeleteData(`admin/users/${id}`);
    return Number(id); // نرجع id عشان نحذفه من ال state
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "deleteUser failed"
    );
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== GET =====
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<UsersResponse>) => {
          state.users = action.payload;
          state.loading = false;
          state.currentPage = action.payload.meta.current_page;
        }
      )
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching users";
      })

      // ===== UPDATE =====
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserItem>) => {
          if (state.users) {
            state.users = {
              ...state.users,
              data: state.users.data.map((u) =>
                u.id === action.payload.id ? { ...u, ...action.payload } : u
              ),
            };
          }
          state.loading = false;
        }
      )
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error updating user";
      });

    // ===== DELETE =====
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        if (state.users) {
          state.users.data = state.users.data.filter(
            (u) => u.id !== action.payload
          );
        }
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error deleting user";
      });
  },
});

export const { setSearchQuery } = userSlice.actions;
export default userSlice.reducer;
