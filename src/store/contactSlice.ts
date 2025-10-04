// store/contactSlice.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { insertData, useGetDataToken } from "../utils/api";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";

// ====== Types ======
export interface ContactData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
  answer: string | null;
  created_at: string;
  updated_at: string;
}

interface MetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Meta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: MetaLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

interface TopLinks {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  locale: string;
  message: string;
  data: T;
  links?: TopLinks | null;
  meta?: Meta | null;
}

interface ContactState {
  contacts: ApiResponse<ContactData[]> | null;
  contact: ContactData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  contacts: null,
  contact: null,
  loading: false,
  error: null,
};

// ================ Thunks ===============

// GET ALL
export const getContacts = createAsyncThunk<
  ApiResponse<ContactData[]>,
  number,
  { rejectValue: string }
>("contact/getContacts", async (page, thunkAPI) => {
  try {
    return await useGetDataToken<ApiResponse<ContactData[]>>(
      `admin/contact-us?page=${page}`
    );
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getContacts failed"
    );
  }
});

// GET ONE
export const getContactById = createAsyncThunk<
  ContactData,
  string,
  { rejectValue: string }
>("contact/getContactById", async (id, thunkAPI) => {
  try {
    return await useGetDataToken<ContactData>(`admin/contact-us/${id}`);
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getContactById failed"
    );
  }
});

// CREATE
export const addContact = createAsyncThunk<
  ContactData,
  Omit<ContactData, "id">,
  { rejectValue: string }
>("contact/addContact", async (data, thunkAPI) => {
  try {
    return await insertData<typeof data, ContactData>("admin/contact-us", data);
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "addContact failed"
    );
  }
});

// UPDATE
export const updateContact = createAsyncThunk<
  ContactData,
  { id: string; data: Partial<ContactData> },
  { rejectValue: string }
>("contact/updateContact", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInUpdateData<Partial<ContactData>, ContactData>(
      `admin/contact-us/${id}`,
      data
    );

    thunkAPI.dispatch(getContacts(1));
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "updateContact failed"
    );
  }
});

// DELETE
// DELETE
export const deleteContact = createAsyncThunk<
  { id: number },
  number,
  { rejectValue: string }
>("contact/deleteContact", async (id, thunkAPI) => {
  try {
    // هنا بنستخدم الهيلبر المخصص للحذف
    await useDeleteData(`admin/contact-us/${id}`);
    return { id };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "deleteContact failed"
    );
  }
});

// ================ Slice ===============
const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getContacts.fulfilled,
        (state, action: PayloadAction<ApiResponse<ContactData[]>>) => {
          state.contacts = action.payload;
          state.loading = false;
        }
      )
      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "فشل في تحميل جميع الرسائل";
      })

      // GET ONE
      .addCase(
        getContactById.fulfilled,
        (state, action: PayloadAction<ContactData>) => {
          state.contact = action.payload;
        }
      )

      // ADD
      .addCase(
        addContact.fulfilled,
        (state, action: PayloadAction<ContactData>) => {
          if (state.contacts) {
            state.contacts.data = [action.payload, ...state.contacts.data];
            if (state.contacts.meta) {
              state.contacts.meta.total = (state.contacts.meta.total || 0) + 1;
            }
          }
        }
      )

      // UPDATE
      .addCase(
        updateContact.fulfilled,
        (state, action: PayloadAction<ContactData>) => {
          if (state.contacts) {
            state.contacts.data = state.contacts.data.map((c) =>
              c.id === action.payload.id ? action.payload : c
            );
          }
        }
      )

      // DELETE
      .addCase(deleteContact.fulfilled, (state, action) => {
        if (state.contacts) {
          state.contacts.data = state.contacts.data.filter(
            (c) => c.id !== action.payload.id
          );
          if (state.contacts.meta) {
            state.contacts.meta.total = (state.contacts.meta.total || 1) - 1;
          }
        }
      });
  },
});

export default contactSlice.reducer;
