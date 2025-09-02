import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {  useGetDataToken } from "../utils/api";
import { AxiosError } from "axios";
import {useInsertData} from "../hooks/useInsertData";
import useDeleteData from "../hooks/useDeleteData";

  interface QuestionData {
  data?: any;
  game_id?: string;
  title?: string;
  options?: string[];
  image?: File;
  sound?: File;
  points?: string;
  is_active?: string | boolean;
  _method?: string;
}

interface QuestionsState {
  questions: QuestionData | null;
  question: QuestionData | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  questions: null,
  question: null,
  loading: false,
  error: null,
};

// ========== Get All Questions ==========
export const getQuestions = createAsyncThunk<
  QuestionData,
  void,
  { rejectValue: string }
>("questions/getQuestions", async (_, thunkAPI) => {
  try {
    const res = await useGetDataToken<QuestionData>(`admin/questions`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "getQuestions failed");
  }
});

// ========== Get One Question ==========
export const getQuestionById = createAsyncThunk<
  QuestionData,
  string,
  { rejectValue: string }
>("questions/getQuestionById", async (id, thunkAPI) => {
  try {
    const res = await useGetDataToken<QuestionData>(`admin/questions/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "getQuestionById failed");
  }
});

// ========== Create Question ==========
export const createQuestion = createAsyncThunk<
  QuestionData,
  QuestionData,
  { rejectValue: string }
>(
  "questions/createQuestion",
  async (data, thunkAPI) => {
    try {
      const res = await useInsertData<QuestionData>(`admin/questions`, data);
       thunkAPI.dispatch(getQuestions());
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        err.response?.data.message || "createQuestion failed"
      );
    }
  }
);


// ========== Update Question ==========
export const updateQuestion = createAsyncThunk<
  QuestionData,
  { id: string; formData: Partial<QuestionData> },
  { rejectValue: string }
>(
  "questions/updateQuestion",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await useInsertData<QuestionData>(`admin/questions/${id}`, formData);
       thunkAPI.dispatch(getQuestions());
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "updateQuestion failed");
    }
  }
);


// ========== Delete Question ==========
export const deleteQuestion = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("questions/deleteQuestion", async (id, thunkAPI) => {
  try {
    const res = await useDeleteData(`admin/questions/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "deleteQuestion failed");
  }
});

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getQuestions.fulfilled, (state, action) => {
      state.questions = action.payload;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(getQuestionById.fulfilled, (state, action) => {
      state.question = action.payload;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(createQuestion.fulfilled, (state) => {
       state.loading = false;
      state.error = null;
    });

    builder.addCase(updateQuestion.fulfilled, (state, action) => {
      state.questions = action.payload;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(deleteQuestion.fulfilled, (state) => {
      state.questions = null;
      state.loading = false;
      state.error = null;
    });

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
  },
});

export default questionsSlice.reducer;
