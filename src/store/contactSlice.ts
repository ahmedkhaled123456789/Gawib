import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { insertData, useGetDataToken } from "../utils/api";
import { useInUpdateData } from "../hooks/useUpdateData";

// ====== Types ======
interface ContactData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

interface Pagination<T> {
  current_page: number;
  data: T[];
  total: number;
  per_page: number;
  last_page: number;
}

interface ApiResponse<T> {
  success: boolean;
  status: number;
  locale: string;
  message: string;
  data: T;
}

interface ContactState {
  contacts: ApiResponse<Pagination<ContactData>> | null;
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

// ================ CRUD Thunks ===============

// GET ALL
export const getContacts = createAsyncThunk<
  ApiResponse<Pagination<ContactData>>,
  number,
  { rejectValue: string }
>("contact/getContacts", async (page, thunkAPI) => {
  try {
    return await useGetDataToken<ApiResponse<Pagination<ContactData>>>(`admin/contact-us?page=${page}`);
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "getContacts failed");
  }
});

// GET ONE
export const getContactById = createAsyncThunk<ContactData, string, { rejectValue: string }>(
  "contact/getContactById",
  async (id, thunkAPI) => {
    try {
      return await useGetDataToken<ContactData>(`admin/contact-us/${id}`);
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
    return thunkAPI.rejectWithValue(err.response?.data.message || "updateContact failed");
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
      })
      .addCase(getContacts.fulfilled, (state, action: PayloadAction<ApiResponse<Pagination<ContactData>>>) => {
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
        // أضف العنصر الجديد في الـ data array لو موجودة
        if (state.contacts) {
          state.contacts.data.data.push(action.payload);
        }
      })

      // UPDATE
      .addCase(updateContact.fulfilled, (state, action: PayloadAction<ContactData>) => {
        if (state.contacts) {
          state.contacts.data.data = state.contacts.data.data.map((c) =>
            c.id === action.payload.id ? action.payload : c
          );
        }
      });
  },
});

export default contactSlice.reducer;
