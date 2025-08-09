import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useGetDataToken } from "../utils/api";
import { AxiosError } from "axios";

interface UserData {
  data: any;
 firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface UserState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// ================ getUser ===============
export const getUser = createAsyncThunk<
  UserData,
  void, // argument type
  { rejectValue: string }
>(
  "user/getUsers",
  async (_, thunkAPI) => {
    try {
      const res = await useGetDataToken<UserData>(`admin/users`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getUser failed");
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
   
    
  },
   extraReducers: (builder) => {
 builder. // get user 
     addCase(getUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })


   }

 
});
export default userSlice.reducer;
