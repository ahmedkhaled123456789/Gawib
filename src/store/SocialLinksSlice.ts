import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetData } from "../utils/api";
import {useInsertData} from "../hooks/useInsertData";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";
import { AxiosError } from "axios";

interface SocialLink {
  name?: string;
  icon: File;
  url: string;
  is_active: string;

}

interface SocialLinksState {
  socialLinks: SocialLink[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: SocialLinksState = {
  socialLinks: null,
  loading: false,
  error: null,
};

// ========== Get All ==========
export const getSocialLinks = createAsyncThunk<
  SocialLink[],
  void,
  { rejectValue: string }
>("socialLinks/getAll", async (_, thunkAPI) => {
  try {
    const res = await useGetData<SocialLink[]>(`admin/social-links`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to fetch social links");
  }
});

// ========== Get One ==========
export const getSocialLinkById = createAsyncThunk<
  SocialLink,
  string,
  { rejectValue: string }
>("socialLinks/getOne", async (id, thunkAPI) => {
  try {
    const res = await useGetData<SocialLink>(`admin/social-links/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to fetch social link");
  }
});

// ========== Create ==========
export const createSocialLink = createAsyncThunk<
  SocialLink,
  SocialLink,
  { rejectValue: string }
>(
  "socialLinks/create",
  async (data, thunkAPI) => {
    try {
      const res = await useInsertData<SocialLink>(`admin/social-links`, data);
       thunkAPI.dispatch(getSocialLinks());
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        err.response?.data.message || "Failed to create social link"
      );
    }
  }
);


// ========== Update ==========
export const updateSocialLink = createAsyncThunk<
  SocialLink,
  { id: string; data: SocialLink },
  { rejectValue: string }
>("socialLinks/update", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInUpdateData<SocialLink>(`admin/social-links/${id}`, data);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to update social link");
  }
});

// ========== Delete ==========
export const deleteSocialLink = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("socialLinks/delete", async (id, thunkAPI) => {
  try {
    const res = await useDeleteData(`admin/social-links/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to delete social link");
  }
});

const socialLinksSlice = createSlice({
  name: "socialLinks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSocialLinks.fulfilled, (state, action) => {
      state.socialLinks = action.payload;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(getSocialLinkById.fulfilled, (state, action) => {
      state.socialLinks = [action.payload];
      state.loading = false;
      state.error = null;
    });

    builder.addCase(createSocialLink.fulfilled, (state) => {
       state.loading = false;
      state.error = null;
    });

    builder.addCase(updateSocialLink.fulfilled, (state, action) => {
      if (state.socialLinks) {
        state.socialLinks = state.socialLinks.map((link) =>
          link === action.payload ? action.payload : link
        );
      }
      state.loading = false;
      state.error = null;
    });

    builder.addCase(deleteSocialLink.fulfilled, (state) => {
      // if (state.socialLinks) {
      //   state.socialLinks = state.socialLinks.filter((link) => link !== action.meta.arg);
      // }
      state.loading = false;
      state.error = null;
    });

    builder
      .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.endsWith("/rejected"), (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default socialLinksSlice.reducer;
