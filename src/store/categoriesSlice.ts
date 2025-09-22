// src/store/categoriesSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { useGetData } from "../hooks/useGetData";
import { useInUpdateData } from "../hooks/useUpdateData";
import { useGetDataToken } from "../utils/api";
import useDeleteData from "../hooks/useDeleteData";
import { useInsertDataWithImage } from "../hooks/useInsertData";

// ==================== Types ====================
export interface Category {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  games_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  data: Category[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

interface CategoryState {
  category: Category | null;
  categories: CategoriesResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  category: null,
  categories: null,
  loading: false,
  error: null,
};

// ==================== Thunks ====================

// ===== Get single category =====
export const getCategory = createAsyncThunk<
  Category,
  { id: string },
  { rejectValue: string }
>("category/getCategory", async ({ id }, thunkAPI) => {
  try {
    const res = await useGetData<Category>(`admin/categories/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getCategory failed"
    );
  }
});

// ===== Get all categories with pagination =====
export const getCategories = createAsyncThunk<
  CategoriesResponse,
  number | void,
  { rejectValue: string }
>("category/getCategories", async (page = 1, thunkAPI) => {
  try {
    const res = await useGetDataToken<CategoriesResponse>(
      `admin/categories?page=${page}`
    );
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getCategories failed"
    );
  }
});

// ===== Get all categories for dropdown =====
export const getAllCategoriesForDropdown = createAsyncThunk<
  CategoriesResponse,
  number | void,
  { rejectValue: string }
>("category/getCategories", async (_, thunkAPI) => {
  try {
    const res = await useGetDataToken<CategoriesResponse>(`admin/categories`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getCategories failed"
    );
  }
});

// ===== Add category =====
export const addCategory = createAsyncThunk<
  Category,
  FormData,
  { rejectValue: string }
>("category/addCategory", async (formData, thunkAPI) => {
  try {
    const res = await useInsertDataWithImage<Category>(
      "admin/categories",
      formData
    );
    thunkAPI.dispatch(getCategories()); // refresh list
    return res;
  } catch (error) {
    console.error("Error adding category:", error);
    return thunkAPI.rejectWithValue("فشل في إضافة التصنيف");
  }
});

// ===== Update category =====
export const updateCategory = createAsyncThunk<
  Category,
  { id: string; formData: Partial<Category> },
  { rejectValue: string }
>("category/updateCategory", async ({ id, formData }, thunkAPI) => {
  try {
    const res = await useInUpdateData<Partial<Category>, Category>(
      `admin/categories/${id}`,
      formData
    );
    thunkAPI.dispatch(getCategories()); // refresh list
    return res;
  } catch (error) {
    console.error("Error updating category:", error);
    return thunkAPI.rejectWithValue("فشل في تعديل التصنيف");
  }
});

// ===== Delete category =====
export const deleteCategory = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("category/deleteCategory", async (id, { rejectWithValue }) => {
  try {
    await useDeleteData(`admin/categories/${id}`);
    return id;
  } catch (error) {
    console.error("Error deleting category:", error);
    return rejectWithValue("فشل في حذف التصنيف");
  }
});

// ==================== Slice ====================
const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get single category
      .addCase(
        getCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.category = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      // Get all categories
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getCategories.fulfilled,
        (state, action: PayloadAction<CategoriesResponse>) => {
          state.categories = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "فشل في تحميل المجموعات";
      })
      // Add category
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategory.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "فشل في إضافة التصنيف";
      })
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "فشل في تعديل التصنيف";
      })
      // Delete category
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<string>) => {
          if (state.categories) {
            state.categories.data = state.categories.data.filter(
              (cat) => cat.id.toString() !== action.payload
            );
          }
        }
      );
  },
});

export default categoriesSlice.reducer;
