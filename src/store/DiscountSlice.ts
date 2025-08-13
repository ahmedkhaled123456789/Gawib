import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetData, useGetDataToken } from "../utils/api";
import {useInsertData} from "../hooks/useInsertData";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";
import { AxiosError } from "axios";

interface DiscountCode {
  code: string;
  discount:number;
  is_percentage: number;
  isActive: boolean;
}

interface DiscountCodesState {
  discountCodes: DiscountCode[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: DiscountCodesState = {
  discountCodes: null,
  loading: false,
  error: null,
};

// ========== Get All ==========
export const getDiscountCodes = createAsyncThunk<
  DiscountCode[],
  void,
  { rejectValue: string }
>("discountCodes/getAll", async (_, thunkAPI) => {
  try {
    const res = await useGetDataToken<DiscountCode[]>(`admin/discount-codes`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to fetch discount codes");
  }
});

// ========== Get One ==========
export const getDiscountCodeById = createAsyncThunk<
  DiscountCode,
  string,
  { rejectValue: string }
>("discountCodes/getOne", async (id, thunkAPI) => {
  try {
    const res = await useGetData<DiscountCode>(`admin/discount-codes/${id}`);
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
       thunkAPI.dispatch(getDiscountCodes());
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
  { id: string; data: DiscountCode },
  { rejectValue: string }
>("discountCodes/update", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInUpdateData<DiscountCode>(`admin/discount-codes/${id}`, data);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to update discount code");
  }
});

// ========== Delete ==========
export const deleteDiscountCode = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("discountCodes/delete", async (id, thunkAPI) => {
  try {
    const res = await useDeleteData(`admin/discount-codes/${id}`);
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
      state.discountCodes = [action.payload];
      state.loading = false;
      state.error = null;
    });

    builder.addCase(createDiscountCode.fulfilled, (state) => {
       state.loading = false;
      state.error = null;
    });

    builder.addCase(updateDiscountCode.fulfilled, (state, action) => {
      if (state.discountCodes) {
        state.discountCodes = state.discountCodes.map((code) =>
          code === action.payload? action.payload : code
        );
      }
      state.loading = false;
      state.error = null;
    });

    builder.addCase(deleteDiscountCode.fulfilled, (state) => {
      // if (state.discountCodes) {
      //   state.discountCodes = state.discountCodes.filter((code) => code._id !== action.meta.arg);
      // }
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
