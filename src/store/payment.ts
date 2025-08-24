// features/payment/paymentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
  import { PaginatedPayments, Payment } from "../types/payment";
import { useGetDataToken } from "../utils/api";
import { useInsertData } from "../hooks/useInsertData";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";
 
interface PaymentState {
  payments: Payment[]; // list
  selectedPayment: Payment | null; // single
  pagination: PaginatedPayments | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  selectedPayment: null,
  pagination: null,
  loading: false,
  error: null,
};

// ============ Get All Payments ============
export const getPayments = createAsyncThunk<
  PaginatedPayments,
  number | void, // page number
  { rejectValue: string }
>("payments/getPayments", async (page = 1, thunkAPI) => {
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

// ============ Create Payment ============
export const createPayment = createAsyncThunk<
  Payment,
  Partial<Payment>,
  { rejectValue: string }
>("payments/createPayment", async (data, thunkAPI) => {
  try {
    const res = await useInsertData<Payment>(`admin/payments`, data);
    thunkAPI.dispatch(getPayments()); // refresh list
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "createPayment failed"
    );
  }
});

// ============ Update Payment ============
export const updatePayment = createAsyncThunk<
  Payment,
  { id: number; data: Partial<Payment> },
  { rejectValue: string }
>("payments/updatePayment", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInUpdateData<Partial<Payment>, Payment>(
      `admin/payments/${id}`,
      data
    );
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
    thunkAPI.dispatch(getPayments()); // refresh list
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "deletePayment failed"
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
        state.pagination = action.payload;
        state.payments = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      // Get By ID
      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.selectedPayment = action.payload;
        state.loading = false;
        state.error = null;
      })
      // Create
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.unshift(action.payload);
        state.loading = false;
        state.error = null;
      })
      // Update
      .addCase(updatePayment.fulfilled, (state, action) => {
        const idx = state.payments.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.payments[idx] = action.payload;
        if (state.selectedPayment?.id === action.payload.id) {
          state.selectedPayment = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      // Delete
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter(
          (p) => p.id !== Number(action.meta.arg)
        );
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
