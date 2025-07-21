import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { useGetData } from "../hooks/useGetData";

 
interface QuestionData {
 key: string;
 value: string;
  type: string;
 }

interface QuestionState {
  question: QuestionData | null;
  questions :  QuestionData | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  question: null,
  questions:null,
  loading: false,
  error: null,
};

// ================ getQuestion ===============
export const getQuestion = createAsyncThunk<
  QuestionData,
  { id: string }, 
  { rejectValue: string }
>(
  "question/getQuestion",
  async ({ id }, thunkAPI) => {
    try {
      const res = await useGetData<QuestionData>(`questions/${id}`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getQuestions failed");
    }
  }
);


// ================ getQuestions ===============
export const getQuestions = createAsyncThunk<
  QuestionData,
  { id: string }, 
  { rejectValue: string }
>(
  "question/getQuestions",
  async (_, thunkAPI) => {
    try {
      const res = await useGetData<QuestionData>(`questions`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getQuestions failed");
    }
  }
);
// ================ Slice ===============
const settingSlice = createSlice({
  name: "question",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getQuestion
     .addCase(getQuestion.fulfilled, (state, action: PayloadAction<QuestionData>) => {
        state.question = action.payload;
        state.loading = false;
        state.error = null;
      })
      // getQuestions
.addCase(getQuestions.fulfilled, (state, action: PayloadAction<QuestionData>) => {
        state.questions = action.payload;
        state.loading = false;
        state.error = null;
      })       
  },
});

export default settingSlice.reducer;
