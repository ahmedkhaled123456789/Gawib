import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { useGetData } from "../hooks/useGetData";

 
interface SocialLinksData {
 category_id: number;
 name: string;
  description: string;
  image:string;
  is_active: boolean,

 }

interface SocialLinksState {
  socialLink: SocialLinksData | null;
  socialLinks :  SocialLinksData | null;
  loading: boolean;
  error: string | null;
}

const initialState: SocialLinksState = {
  socialLink: null,
  socialLinks:null,
  loading: false,
  error: null,
};

// ================ get SocialLinksData ===============
export const getSocialLink = createAsyncThunk<
  SocialLinksData,
  { id: string }, 
  { rejectValue: string }
>(
  "socialLinks/getSocialLink",
  async ({ id }, thunkAPI) => {
    try {
      const res = await useGetData<SocialLinksData>(`social-links/${id}`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getSocialLinks failed");
    }
  }
);


// ================ getSocialLinks ===============
export const getSocialLinks = createAsyncThunk<
  SocialLinksData,
  { id: string }, 
  { rejectValue: string }
>(
  "socialLinks/getSocialLinks",
  async (_, thunkAPI) => {
    try {
      const res = await useGetData<SocialLinksData>(`social-links`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getGames failed");
    }
  }
);
// ================ Slice ===============
const SocialLinksSlice = createSlice({
  name: "socialLinks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getsocialLinks
     .addCase(getSocialLink.fulfilled, (state, action: PayloadAction<SocialLinksData>) => {
        state.socialLinks = action.payload;
        state.loading = false;
        state.error = null;
      })
      // getSocialLinks
.addCase(getSocialLinks.fulfilled, (state, action: PayloadAction<SocialLinksData>) => {
        state.socialLinks = action.payload;
        state.loading = false;
        state.error = null;
      })       
  },
});

export default SocialLinksSlice.reducer;
