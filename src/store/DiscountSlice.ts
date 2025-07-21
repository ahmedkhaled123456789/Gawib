import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { useGetData } from "../hooks/useGetData";

 
interface DiscountData {
 category_id: number;
 name: string;
  description: string;
  image:string;
  is_active: boolean,

 }

interface DiscountState {
  discount: DiscountData | null;
  discounts :  DiscountData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DiscountState = {
  discount: null,
  discounts:null,
  loading: false,
  error: null,
};

// ================ get Discount ===============
export const getDiscount = createAsyncThunk<
  DiscountData,
  { id: string }, 
  { rejectValue: string }
>(
  "discount/getDiscount",
  async ({ id }, thunkAPI) => {
    try {
      const res = await useGetData<DiscountData>(`discount-codes/${id}`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getDiscount failed");
    }
  }
);


// ================ get Discounts ===============
export const getDiscounts = createAsyncThunk<
  DiscountData,
  { id: string }, 
  { rejectValue: string }
>(
  "discount/getDiscounts",
  async (_, thunkAPI) => {
    try {
      const res = await useGetData<DiscountData>(`discount-codes`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getDiscount failed");
    }
  }
);
// ================ Slice ===============
const DiscountsSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getGame
     .addCase(getDiscount.fulfilled, (state, action: PayloadAction<DiscountData>) => {
        state.discount = action.payload;
        state.loading = false;
        state.error = null;
      })
      // getGames
.addCase(getDiscounts.fulfilled, (state, action: PayloadAction<DiscountData>) => {
        state.discounts = action.payload;
        state.loading = false;
        state.error = null;
      })       
  },
});

export default DiscountsSlice.reducer;
