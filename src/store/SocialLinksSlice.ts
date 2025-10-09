import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataToken } from "../utils/api";
import { useInsertDataWithImage } from "../hooks/useInsertData";
import useDeleteData from "../hooks/useDeleteData";
import { AxiosError } from "axios";

export interface SocialLink {
  id: number;
  name: string;
  url: string;
  icon: string | null;
  is_active: boolean | string;
  _method?: string;
  created_at: string | null;
  updated_at: string | null;
}

// واجهة API Response
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  locale: string;
  message: string;
  data: T;
}

// الحالة
interface SocialLinksState {
  socialLinks: SocialLink[];
  socialLink: SocialLink | null;
  loading: boolean;
  error: string | null;
}

const initialState: SocialLinksState = {
  socialLinks: [],
  socialLink: null,
  loading: false,
  error: null,
};

// Get All
export const getSocialLinks = createAsyncThunk<
  ApiResponse<{ data: SocialLink[] }>,
  void,
  { rejectValue: string }
>("socialLinks/getAll", async (_, thunkAPI) => {
  try {
    return await useGetDataToken<ApiResponse<{ data: SocialLink[] }>>(
      `admin/social-links`
    );
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "فشل جلب روابط التواصل"
    );
  }
});

// Get By ID
export const getSocialLinkById = createAsyncThunk<
  ApiResponse<SocialLink>,
  number,
  { rejectValue: string }
>("socialLinks/getById", async (id, thunkAPI) => {
  try {
    const res = await useGetDataToken<ApiResponse<SocialLink>>(
      `admin/social-links/${id}`
    );
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "فشل جلب الرابط"
    );
  }
});

// Update
export const updateSocialLink = createAsyncThunk<
  ApiResponse<SocialLink>,
  { id: number; data: Partial<SocialLink> },
  { rejectValue: string }
>("socialLinks/update", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInsertDataWithImage<ApiResponse<SocialLink>>(
      `admin/social-links/${id}`,
      data as any
    );
    thunkAPI.dispatch(getSocialLinks());
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "فشل التحديث"
    );
  }
});

// Delete
export const deleteSocialLink = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: string }
>("socialLinks/delete", async (id, thunkAPI) => {
  try {
    const res = await useDeleteData(`admin/social-links/${id}`);
    thunkAPI.dispatch(getSocialLinks());
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "فشل الحذف");
  }
});

// Create new Social Link
export const createSocialLink = createAsyncThunk<
  ApiResponse<SocialLink>,
  { name: string; url: string; is_active: boolean; icon: File },
  { rejectValue: string }
>("socialLinks/create", async (payload, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("url", payload.url);
    formData.append("is_active", payload.is_active ? "1" : "0");
    formData.append("icon", payload.icon);

    const res = await useInsertDataWithImage<ApiResponse<SocialLink>>(
      `admin/social-links`,
      formData
    );

    // Refresh list
    thunkAPI.dispatch(getSocialLinks());

    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "فشل إنشاء الرابط"
    );
  }
});

// Slice
const socialLinksSlice = createSlice({
  name: "socialLinks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ عند جلب كل الروابط
      .addCase(getSocialLinks.fulfilled, (state, action) => {
        state.socialLinks = action.payload.data.data; // ← هنا التغيير
        state.loading = false;
        state.error = null;
      })

      .addCase(createSocialLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSocialLink.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createSocialLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ أثناء الإنشاء";
      })

      // ✅ عند جلب رابط واحد
      .addCase(getSocialLinkById.fulfilled, (state, action) => {
        state.socialLink = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateSocialLink.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteSocialLink.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // عند الرفض
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload || "حدث خطأ";
        }
      );
  },
});

export default socialLinksSlice.reducer;
