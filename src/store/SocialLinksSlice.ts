import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataToken } from "../utils/api";
import { useInsertData2} from "../hooks/useInsertData";
import useDeleteData from "../hooks/useDeleteData";
import { AxiosError } from "axios";

// Social Link Object
interface SocialLink {
  id: number;
  name: string;
  url: string;
  icon: string | null;
  is_active: string;
 _method?: string; 
  created_at: string | null;
  updated_at: string | null;
}

// Response Wrapper (اللي بيرجع من الـ API)
interface ApiResponse<T> {
  success: boolean;
  status: number;
  locale: string;
  message: string;
  data: {
    data: T;
  };
}

// Slice State
interface SocialLinksState {
  socialLinks: SocialLink[];  // نخزن هنا الـ Array
  loading: boolean;
  error: string | null;
}

const initialState: SocialLinksState = {
  socialLinks: [],
  loading: false,
  error: null,
};



// Get All
export const getSocialLinks = createAsyncThunk<
  ApiResponse<SocialLink[]>, // return type
  void,
  { rejectValue: string }
>("socialLinks/getAll", async (_, thunkAPI) => {
  try {
    return await useGetDataToken<ApiResponse<SocialLink[]>>(`admin/social-links`);
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to fetch social links");
  }
});

// Create
// export const createSocialLink = createAsyncThunk<
//   ApiResponse<SocialLink>,
//   FormData,
//   { rejectValue: string }
// >("socialLinks/create", async (data, thunkAPI) => {
//   try {
//     const res = await useInsertData<ApiResponse<SocialLink>>(`admin/social-links`, data);
//     thunkAPI.dispatch(getSocialLinks());
//     return res;
//   } catch (error) {
//     const err = error as AxiosError<{ message: string }>;
//     return thunkAPI.rejectWithValue(err.response?.data.message || "Failed to create social link");
//   }
// });

// Update
export const updateSocialLink = createAsyncThunk<
  ApiResponse<SocialLink>, // Response Type
  { id: string; data: Partial<SocialLink> }, // Request Params
  { rejectValue: string }
>("socialLinks/update", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInsertData2<ApiResponse<SocialLink>, Partial<SocialLink>>(
      `admin/social-links/${id}`,
      data
    );

    thunkAPI.dispatch(getSocialLinks());
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "update failed");
  }
});






// Delete
export const deleteSocialLink = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("socialLinks/delete", async (id, thunkAPI) => {
  try {
    const res = await useDeleteData(`admin/social-links/${id}`);
    thunkAPI.dispatch(getSocialLinks());
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
      state.socialLinks = action.payload.data.data; 
      state.loading = false;
      state.error = null;
    });

    // builder.addCase(getSocialLinkById.fulfilled, (state, action) => {
    //   state.socialLinks = [action.payload.data]; // عنصر واحد
    //   state.loading = false;
    //   state.error = null;
    // });

    // builder.addCase(createSocialLink.fulfilled, (state) => {
    //   state.loading = false;
    //   state.error = null;
    // });

    builder.addCase(updateSocialLink.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });

    builder.addCase(deleteSocialLink.fulfilled, (state) => {
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
