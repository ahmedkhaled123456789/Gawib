import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { insertData, useGetDataToken } from "../utils/api";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";
 
interface ContactData {
  id: string;       // لازم يكون في Id عشان update/delete
  firstName: string;
  lastName: string;
  email: string;
  answer: string;
}

interface ContactState {
  contacts: ContactData[];
  contact: ContactData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  contacts: [],
  contact: null,
  loading: false,
  error: null,
};

// ================ CRUD Thunks ===============

// GET ALL
export const getContacts = createAsyncThunk<ContactData[], void, { rejectValue: string }>(
  "contact/getContacts",
  async (_, thunkAPI) => {
    try {
      return await useGetDataToken<ContactData[]>("admin/contact-us");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getContacts failed");
    }
  }
);

// GET ONE
export const getContactById = createAsyncThunk<ContactData, string, { rejectValue: string }>(
  "contact/getContactById",
  async (id, thunkAPI) => {
    try {
      return await useGetDataToken<ContactData>("admin/contact-us", id);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getContactById failed");
    }
  }
);

// CREATE
export const addContact = createAsyncThunk<ContactData, Omit<ContactData, "id">, { rejectValue: string }>(
  "contact/addContact",
  async (data, thunkAPI) => {
    try {
      return await insertData<typeof data, ContactData>("admin/contact-us", data);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "addContact failed");
    }
  }
);

// UPDATE
export const updateContact = createAsyncThunk<
  ContactData,
  { id: string; data: Partial<ContactData> },
  { rejectValue: string }
>(
  "contact/updateContact",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await useInUpdateData<Partial<ContactData>, ContactData>(
        `admin/contact-us/${id}`,
        data
      );
      
       thunkAPI.dispatch(getContacts());

      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        err.response?.data.message || "updateContact failed"
      );
    }
  }
);


// DELETE
export const deleteContact = createAsyncThunk<string, string, { rejectValue: string }>(
  "contact/deleteContact",
  async (id, thunkAPI) => {
    try {
      await useDeleteData("admin/contact-us", id);
      return id; // هنرجّع الـ id عشان نمسحه من الـ state
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "deleteContact failed");
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
      // GET ALL
      .addCase(getContacts.pending, (state) => { state.loading = true; })
      .addCase(getContacts.fulfilled, (state, action: PayloadAction<ContactData[]>) => {
        state.contacts = action.payload;
        state.loading = false;
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "فشل في تحميل جميع الرسائل";
      })

      // GET ONE
      .addCase(getContactById.fulfilled, (state, action: PayloadAction<ContactData>) => {
        state.contact = action.payload;
      })

      // ADD
      .addCase(addContact.fulfilled, (state, action: PayloadAction<ContactData>) => {
        state.contacts.push(action.payload);
      })

      // UPDATE
      .addCase(updateContact.fulfilled, (state, action: PayloadAction<ContactData>) => {
        state.contacts = state.contacts.map((c) => (c.id === action.payload.id ? action.payload : c));
      })

      // DELETE
      .addCase(deleteContact.fulfilled, (state, action: PayloadAction<string>) => {
        state.contacts = state.contacts.filter((c) => c.id !== action.payload);
      });
  },
});

export default contactSlice.reducer;
