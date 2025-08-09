import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetData } from "../utils/api";
import { AxiosError } from "axios";
import {useInsertData} from "../hooks/useInsertData";
import { useInUpdateData } from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";

interface QuestionData {
  game_id: string;
  title: string;
  options: string[];
  image: File;
  sound: File;
  points: string;
  is_active: string;
}

interface QuestionsState {
  questions: QuestionData | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  questions: null,
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
    const res = await useGetData<QuestionData>(`admin/questions`);
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
    const res = await useGetData<QuestionData>(`admin/questions/${id}`);
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
>("questions/createQuestion", async (data, thunkAPI) => {
  try {
    const res = await useInsertData<QuestionData>(`admin/questions`, data);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "createQuestion failed");
  }
});

// ========== Update Question ==========
export const updateQuestion = createAsyncThunk<
  QuestionData,
  { id: string; data: QuestionData },
  { rejectValue: string }
>("questions/updateQuestion", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInUpdateData<QuestionData>(`admin/questions/${id}`, data);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "updateQuestion failed");
  }
});

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
      state.questions = action.payload;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(createQuestion.fulfilled, (state, action) => {
      state.questions = action.payload;
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
