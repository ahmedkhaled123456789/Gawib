// store/questionsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataToken } from "../utils/api";
import { AxiosError } from "axios";
import { useInsertData } from "../hooks/useInsertData";
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
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
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

// ========== Get All Questions Not Active ==========
export const getQuestions = createAsyncThunk<
  QuestionData,
  { page: number; search?: string; sort?: string; points?: string },
  { rejectValue: string }
>(
  "questions/getQuestions",
  async ({ page, search, sort, points }, thunkAPI) => {
    try {
let url = `admin/questions?page=${page}&filter[is_active]=0&filter[free_game_questions]=0`;

      if (search) url += `&filter[search]=${encodeURIComponent(search)}`;
      if (sort) url += `&sort=${encodeURIComponent(sort)}`;
      if (points) url += `&filter[points]=${encodeURIComponent(points)}`;

      const res = await useGetDataToken<QuestionData>(url);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        err.response?.data.message || "getQuestions failed"
      );
    }
  }
);

// ========== Get Active Questions ==========
export const getQuestionsActive = createAsyncThunk<
  QuestionData,
  { page: number; search?: string; sort?: string; points?: string },
  { rejectValue: string }
>(
  "questions/getQuestionsActive",
  async ({ page, search, sort, points }, thunkAPI) => {
    try {
let url = `admin/questions?page=${page}&filter[is_active]=1&filter[free_game_questions]=0`;

      if (search) url += `&filter[search]=${encodeURIComponent(search)}`;
      if (sort) url += `&sort=${encodeURIComponent(sort)}`;
      if (points) url += `&filter[points]=${encodeURIComponent(points)}`;

      const res = await useGetDataToken<QuestionData>(url);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        err.response?.data.message || "getQuestionsActive failed"
      );
    }
  }
);

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
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getQuestionById failed"
    );
  }
});

// ========== Create Question ==========
export const createQuestion = createAsyncThunk<QuestionData, FormData>(
  "questions/createQuestion",
  async (formData, thunkAPI) => {
    try {
      const res = await useInsertData<QuestionData>(
        `admin/questions`,
        formData as any
      );
      thunkAPI.dispatch(getQuestions({ page: 1 }));
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
  any,
  { id: string; formData: FormData; isActivePage?: boolean }, // إضافة isActivePage
  { rejectValue: string }
>("questions/updateQuestion", async ({ id, formData, isActivePage = false }, thunkAPI) => {
  try {
    const res = await useInsertData<any>(
      `admin/questions/${id}`,
      formData as any
    );

    // بناءً على نوع الصفحة، نقوم بإعادة تحميل البيانات المناسبة
    if (isActivePage) {
      thunkAPI.dispatch(getQuestionsActive({ page: 1 }));
    } else {
      thunkAPI.dispatch(getQuestions({ page: 1 }));
    }

    return { id, updatedData: res };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "updateQuestion failed"
    );
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
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "deleteQuestion failed"
    );
  }
});

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    updateQuestionInList: (state, action) => {
      if (state.questions?.data && Array.isArray(state.questions.data)) {
        const updatedIndex = state.questions.data.findIndex(
          (q) => q.id === action.payload.id
        );
        if (updatedIndex !== -1) {
          state.questions.data[updatedIndex] = {
            ...state.questions.data[updatedIndex],
            ...action.payload.updatedData
          };
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getQuestionsActive.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getQuestionById.fulfilled, (state, action) => {
        state.question = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
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

export const { updateQuestionInList } = questionsSlice.actions;
export default questionsSlice.reducer;