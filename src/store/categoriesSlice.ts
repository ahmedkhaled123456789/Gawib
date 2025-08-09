import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { useGetData } from "../hooks/useGetData";
import { useInUpdateData } from "../hooks/useUpdateData";
import {  useGetDataToken } from "../utils/api";
import useDeleteData from "../hooks/useDeleteData";
import  {useInsertDataWithImage}  from "../hooks/useInsertData";

interface CategoryData {
 name: string;
 description: string;
  image: string;
  is_active: boolean;
}

interface CategoryState {
  category: CategoryData | null;
  categories :  CategoryData | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  category: null,
  categories:null,
  loading: false,
  error: null,
};

// ================ getCategory ===============
export const getCategory = createAsyncThunk<
  CategoryData,
  { id: string }, // argument type
  { rejectValue: string }
>(
  "category/getCategory",
  async ({ id }, thunkAPI) => {
    try {
      const res = await useGetData<CategoryData>(`admin/categories/${id}`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getCategory failed");
    }
  }
);


// ================ getCategory ===============
export const getCategories = createAsyncThunk<
  CategoryData,
 void,
  { rejectValue: string }
>(
  "category/getCategories",
  async (_, thunkAPI) => {
    try {
      const res = await useGetDataToken<CategoryData>(`admin/categories`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getCategories failed");
    }
  }
);


// ========================== Create Category ==========================
export const addCategory = createAsyncThunk<CategoryData, FormData>(
  "category/addCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await useInsertDataWithImage<CategoryData>("admin/categories", formData);
      return data;
    } catch (error) {
      console.error("❌ Error adding Category:", error);
      return rejectWithValue("فشل في إضافة التصنيف");
    }
  }
);

// ========================== Update Category ==========================
export const updateCategory = createAsyncThunk<
  CategoryData,
  { id: string; formData: Partial<CategoryData> },
  { rejectValue: string }
>(
  "category/updateCategory",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await useInUpdateData<CategoryData, Partial<CategoryData>>(
        `admin/categories/${id}`,
        formData
      );
      return res;
    } catch (error) {
      console.error("Error updating Category:", error);
      return rejectWithValue("Failed to update Category");
    }
  }
);

// ========================== Delete Category ==========================
export const deleteCategory = createAsyncThunk<string, string>(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await useDeleteData(`admin/categories/${id}`);
      return id;
    } catch (error) {
      console.error("Error deleting Category:", error);
      return rejectWithValue("Failed to delete Category");
    }
  }
);
// ================ Slice ===============
const categoriesSlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get category 
     .addCase(getCategory.fulfilled, (state, action: PayloadAction<CategoryData>) => {
        state.category = action.payload;
        state.loading = false;
        state.error = null;
      })
      // getCategories
.addCase(getCategories.fulfilled, (state, action: PayloadAction<CategoryData>) => {
        state.categories = action.payload;
        state.loading = false;
        state.error = null;
      })
  .addCase(addCategory.fulfilled, (state, action: PayloadAction<CategoryData>) => {
        state.categories = action.payload;
        state.loading = false;
        state.error = null;
      })
       .addCase(updateCategory.fulfilled, (state, action: PayloadAction<CategoryData>) => {
        state.categories = action.payload;
        state.loading = false;
        state.error = null;
      })
         
           
  },
});

export default categoriesSlice.reducer;
