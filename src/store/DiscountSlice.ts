import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataToken } from "../utils/api";
import {useInsertData} from "../hooks/useInsertData";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";
import { AxiosError } from "axios";

interface DiscountCode {
  id?: number;
  code?: string;
  discount?: string;
  starts_at?: string;
  ends_at?: string;
  type?: number;
  status?: string;
  discounted_price?: number;
  emails?: string | null;
  game_package?: {
    id: number;
    name: string;
    games_count: string;
    price: string;
    number_of_buys: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface DiscountResponse {
  success: boolean;
  status: number;
  message: string;
  data: DiscountCode[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
}



interface DiscountCodesState {
  discountCodes: DiscountResponse | null;
  discountCode: DiscountCode | null;
  loading: boolean;
  error: string | null;
}

const initialState: DiscountCodesState = {
  discountCodes: null,
  discountCode: null,
  loading: false,
  error: null,
};

// ========== Get All ==========
 export const getDiscountCodes = createAsyncThunk<
  DiscountResponse, 
  number,
  { rejectValue: string }
>("discountCodes/getAll", async (page, thunkAPI) => {
  try {
    const res = await useGetDataToken<DiscountResponse>(`admin/discount-codes?page=${page}`);
    return res; 
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to fetch discount codes");
  }
});


// ========== Get One ==========
export const getDiscountCodeById = createAsyncThunk<
  DiscountResponse,
  string,
  { rejectValue: string }
>("discountCodes/getOne", async (id, thunkAPI) => {
  try {
    const res = await useGetDataToken<DiscountResponse>(`admin/discount-codes/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to fetch discount code");
  }
});

// ========== Create ==========
export const createDiscountCode = createAsyncThunk<
  DiscountCode,
  DiscountCode,
  { rejectValue: string }
>(
  "discountCodes/create",
  async (data, thunkAPI) => {
    try {
      const res = await useInsertData<DiscountCode>(`admin/discount-codes`, data);
       thunkAPI.dispatch(getDiscountCodes(1));
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        err.response?.data.message || "Failed to create discount code"
      );
    }
  }
);


// ========== Update ==========
export const updateDiscountCode = createAsyncThunk<
  DiscountCode,
  { id: string; data: Partial<DiscountCode> },
  { rejectValue: string }
>(
  "discountCodes/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await useInUpdateData<Partial<DiscountCode>, DiscountCode>(
        `admin/discount-codes/${id}`,
        data
      );
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        err.response?.data.message || "Failed to update discount code"
      );
    }
  }
);


// ========== Delete ==========
export const deleteDiscountCode = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("discountCodes/delete", async (id, thunkAPI) => {
  try {
    const res = await useDeleteData(`admin/discount-codes/${id}`);
           thunkAPI.dispatch(getDiscountCodes(1));

    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to delete discount code");
  }
});

const discountCodesSlice = createSlice({
  name: "discountCodes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
   builder.addCase(getDiscountCodes.fulfilled, (state, action) => {
  state.discountCodes = action.payload; 
  state.loading = false;
  state.error = null;
});

builder.addCase(getDiscountCodeById.fulfilled, (state, action) => {
  state.discountCode = action.payload.data[0];
  state.loading = false;
  state.error = null;
});


    builder.addCase(createDiscountCode.fulfilled, (state) => {
       state.loading = false;
      state.error = null;
    });

    builder.addCase(updateDiscountCode.fulfilled, (state) => {
      // if (state.discountCodes) {
      //   state.discountCodes = state.discountCodes.map((code) =>
      //     code === action.payload? action.payload : code
      //   );
      // }
      state.loading = false;
      state.error = null;
    });

    builder.addCase(deleteDiscountCode.fulfilled, (state) => {
      
      state.loading = false;
      state.error = null;
    });

    builder
      .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.endsWith("/rejected"), (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default discountCodesSlice.reducer;
