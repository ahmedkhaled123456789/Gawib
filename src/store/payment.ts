// features/payment/paymentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { ApiResponse, Payment } from "../types/payment";
import { useGetDataToken } from "../utils/api";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";
import { useInsertData } from "../hooks/useInsertData";

export type PaginatedPayments = ApiResponse<Payment[]>;

interface PaymentState {
  payments: PaginatedPayments | null;
  selectedPayment: Payment | null;
  refundedPayments: PaginatedPayments | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: null,
  selectedPayment: null,
  refundedPayments: null,
  loading: false,
  error: null,
};

// ============ Get All Payments ============
export const getPayments = createAsyncThunk<
  PaginatedPayments,
  number,
  { rejectValue: string }
>("payments/getPayments", async (page, thunkAPI) => {
  try {
    const res = await useGetDataToken<PaginatedPayments>(
      `admin/payments?page=${page}`
    );
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getPayments failed"
    );
  }
});

// ============ Get One Payment ============
export const getPaymentById = createAsyncThunk<
  Payment,
  number,
  { rejectValue: string }
>("payments/getPaymentById", async (id, thunkAPI) => {
  try {
    const res = await useGetDataToken<Payment>(`admin/payments/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getPaymentById failed"
    );
  }
});

// ============ Update Payment ============
export const updatePayment = createAsyncThunk<
  Payment,
  { id: number; status: number },
  { rejectValue: string }
>("payments/updatePayment", async ({ id, status }, thunkAPI) => {
  try {
    const res = await useInUpdateData<any, Payment>(
      `admin/payments/${id}?status=${status}`,
      {}
    );
    thunkAPI.dispatch(getPayments(1));
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "updatePayment failed"
    );
  }
});

// ============ Delete Payment ============
export const deletePayment = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: string }
>("payments/deletePayment", async (id, thunkAPI) => {
  try {
    const res = await useDeleteData(`admin/payments/${id}`);
    thunkAPI.dispatch(getPayments(1));
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "deletePayment failed"
    );
  }
});

// ============ Refund Payment ============
export const refundPayment = createAsyncThunk<
  any,
  { paymentId: number },
  { rejectValue: string }
>("payments/refundPayment", async ({ paymentId }, thunkAPI) => {
  try {
    const res = await useInsertData<any>(
      `admin/payments/refund/${paymentId}`,
      {}
    );
    thunkAPI.dispatch(getPayments(1));
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "refundPayment failed"
    );
  }
});

// Get Refunded Payments
export const getRefundedPayments = createAsyncThunk<
  PaginatedPayments,
  number,
  { rejectValue: string }
>("payments/getRefundedPayments", async (page, thunkAPI) => {
  try {
    const res = await useGetDataToken<PaginatedPayments>(
      `admin/payments?filter[status]=2&page=${page}`
    );
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getRefundedPayments failed"
    );
  }
});

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
        state.loading = false;
        state.error = null;
      })

      // Get By ID
      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.selectedPayment = action.payload;
        state.loading = false;
        state.error = null;
      })

      // Get Refunded Payments
      .addCase(getRefundedPayments.fulfilled, (state, action) => {
        state.refundedPayments = action.payload;
        state.loading = false;
        state.error = null;
      })

      // Common Pending
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Common Rejected
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        }
      );
  },
});

export default paymentSlice.reducer;
