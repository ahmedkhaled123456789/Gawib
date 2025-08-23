import { useGetDataToken } from './../utils/api';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetData } from "../utils/api";
import { AxiosError } from "axios";
import useDeleteData from "../hooks/useDeleteData";
import { useInUpdateData } from "../hooks/useUpdateData";
 import {useInsertData}  from "../hooks/useInsertData";

interface AdminData {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  is_super_admin: number;
  is_active: number;
}

interface AdminState {
  admins: AdminData | [];
  counts:[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  admins: null,
  counts:null,
  loading: false,
  error: null,
};


// ============ Get All Admins ============
export const getCounts = createAsyncThunk("admin/counts", async (_, thunkAPI) => {
  try {
    const res = await useGetDataToken<AdminData>(`admin/system-counts`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "getAdmins failed");
  }
});

// ============ Get All Admins ============
export const getAdmins = createAsyncThunk<
  AdminData,
  void,
  { rejectValue: string }
>("admin/getAdmins", async (_, thunkAPI) => {
  try {
    const res = await useGetDataToken<AdminData>(`admin/admins`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "getAdmins failed");
  }
});

// ============ Get One Admin ============
export const getAdminById = createAsyncThunk<
  AdminData,
  string, // adminId
  { rejectValue: string }
>("admin/getAdminById", async (id, thunkAPI) => {
  try {
    const res = await useGetData<AdminData>(`admin/admins/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "getAdminById failed");
  }
});

// ============ Create Admin ============
export const createAdmin = createAsyncThunk<
  AdminData,
  AdminData,
  { rejectValue: string }
>("admin/createAdmin", async (data, thunkAPI) => {
  try {
    const res = await useInsertData<AdminData>(`admin/admins`, data);
     thunkAPI.dispatch(getAdmins());
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "createAdmin failed");
  }
});


// ============ Update Admin ============
export const updateAdmin = createAsyncThunk<
  AdminData,
  { id: string; data: AdminData },
  { rejectValue: string }
>("admin/updateAdmin", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInUpdateData<AdminData>(`admin/admins/${id}`, data);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "updateAdmin failed");
  }
});

// ============ Delete Admin ============
export const deleteAdmin = createAsyncThunk<
  { message: string },
  string, // id
  { rejectValue: string }
>("admin/deleteAdmin", async (id, thunkAPI) => {
  try {
    const res = await useDeleteData(`admin/admins/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "deleteAdmin failed");
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
   
    
  },
  extraReducers: (builder) => {
     // Get All Admins
  builder.addCase(getCounts.fulfilled, (state, action) => {
    state.counts = action.payload?.data;
    state.loading = false;
    state.error = null;
  });
  // Get All Admins
  builder.addCase(getAdmins.fulfilled, (state, action) => {
    state.admins = action.payload;
    state.loading = false;
    state.error = null;
  });

  // Get Admin By ID
  builder.addCase(getAdminById.fulfilled, (state, action) => {
    state.admins = action.payload;
    state.loading = false;
    state.error = null;
  });

  // Create Admin
builder.addCase(createAdmin.fulfilled, (state) => {
  state.loading = false;
  state.error = null;
});


  // Update Admin
  builder.addCase(updateAdmin.fulfilled, (state, action) => {
    state.admins = action.payload;
    state.loading = false;
    state.error = null;
  });

  // Delete Admin
  builder.addCase(deleteAdmin.fulfilled, (state) => {
    state.admins = null; 
    state.loading = false;
    state.error = null;
  });

  // Handling Rejected (اختياري)
  builder
    .addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      }
    )
    .addMatcher(
      (action) => action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );
}


 
});
export default adminSlice.reducer;
