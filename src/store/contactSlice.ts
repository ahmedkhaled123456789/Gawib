import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { insertData } from "../utils/api"; // ✅ renamed and moved out of hooks
   
interface ContactData {
 firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface ContactState {
  contact: ContactData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  contact: null,
  loading: false,
  error: null,
};

// ================ Login ===============
export const addContact = createAsyncThunk<
  ContactData,                     // Return type
  Record<string, unknown>,         // Argument type
  { rejectValue: string }       // Rejection type
>(
  "contact/addContact",
  async (data, thunkAPI) => {
    try {
      const res = await insertData<typeof data, ContactData>("contact-us", data);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "addContact failed");
    }
  }
);

// ================ Slice ===============
const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // addContact
      .addCase(addContact.pending, (state) => {
  state.loading = true;
  state.error = null;
})
      .addCase(addContact.fulfilled, (state, action: PayloadAction<ContactData>) => {
        state.contact = action.payload;
        state.loading = false;
        state.error = null;
      })
      
.addCase(addContact.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || "فشل الإرسال";
})

      
     
  },
});

export default contactSlice.reducer;
