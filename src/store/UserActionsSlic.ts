import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { useInsertData2 } from "../hooks/useInsertData";

// ==================== Interfaces ====================
export interface UserItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: boolean; // نخزن boolean في ال state
  nationality?: string;
  created_at?: string;
  played_games?: number;
  total_purchases_amount?: number;
}

interface UserState {
  users: UserItem[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// ==================== createUser ====================
// request payload
export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  played_games?: number;
  status?: number; // request يُرسل كـ رقم (0/1)
}

export const createUser = createAsyncThunk<
  UserItem, // response type stored in state
  CreateUserPayload, // request payload type
  { rejectValue: string }
>("user/createUser", async (userData, thunkAPI) => {
  try {
    const res = await useInsertData2<any, CreateUserPayload>(
      "admin/users",
      userData
    );

    // normalize status to boolean (API قد يرجع 0/1)
    const normalizedUser: UserItem = {
      ...res,
      status: Boolean((res as any).status),
    };

    return normalizedUser;
  } catch (error) {
    // نتعامل مع AxiosError عشان نقدر نقرأ err.response.data.message
    const err = error as AxiosError<{
      message?: string;
      errors?: Record<string, string[]>;
    }>;

    const serverMessage =
      err.response?.data?.message ?? err.message ?? "حدث خطأ أثناء إنشاء المستخدم";

    return thunkAPI.rejectWithValue(serverMessage);
  }
});

// ==================== Slice ====================
const UserActionsSlice = createSlice({
  name: "userActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== CREATE USER =====
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<UserItem>) => {
        state.users.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error creating user";
      });
  },
});

export default UserActionsSlice.reducer;
