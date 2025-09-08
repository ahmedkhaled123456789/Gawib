// features/payment/paymentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { ApiResponse, Paginated, Payment } from "../types/payment";
import { useGetDataToken } from "../utils/api";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";
 
export type PaginatedPayments = ApiResponse<Paginated<Payment>>;

interface PaymentState {
  payments: PaginatedPayments | null; 
  selectedPayment: Payment | null; 
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: null,
  selectedPayment: null,
  loading: false,
  error: null,
};

// ============ Get All Payments ============
export const getPayments = createAsyncThunk<
  PaginatedPayments, 
  number,
  { rejectValue: string }
>(
  "payments/getPayments",
  async (page, thunkAPI) => {
    try {
      const res = await useGetDataToken<PaginatedPayments>(`admin/payments?page=${page}`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getPayments failed");
    }
  }
);



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
// export const createPayment = createAsyncThunk<
//   Payment,
//   Partial<Payment>,
//   { rejectValue: string }
// >("payments/createPayment", async (data, thunkAPI) => {
//   try {
//     const res = await useInsertData<Payment>(`admin/payments`, data);
//     thunkAPI.dispatch(getPayments()); // refresh list
//     return res;
//   } catch (error) {
//     const err = error as AxiosError<{ message: string }>;
//     return thunkAPI.rejectWithValue(
//       err.response?.data.message || "createPayment failed"
//     ); 
//   }
// });

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
    thunkAPI.dispatch(getPayments(1)); 
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
