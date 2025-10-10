import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { useGetDataToken } from "../utils/api";

interface Question {
  id: number;
  question_text: string;
  answer_text: string;
  hint: string;
  points: number;
  is_active: boolean;
  question?: {
    image?: string | null;
    audio?: string | null;
    video?: string | null;
    text?: string;
  };
  answer?: {
    image?: string | null;
    audio?: string | null;
    video?: string | null;
    text?: string;
  };
  game_name?: string;
  admin_name?: string;
  created_at?: string;
  updated_at?: string;
}

interface FreeGame {
  id: number;
  name: string;
  description: string;
  image: string;
  is_free: boolean;
  questions: Question[];
  admin?: {
    name: string;
  };
  category?: {
    name: string;
  };
  number_of_plays?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface FreeGameResponse {
  data: FreeGame[];
  meta?: Meta;
}

interface FreeGameState {
  gameFree: FreeGameResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: FreeGameState = {
  gameFree: null,
  loading: false,
  error: null,
};

export const getFreeGames = createAsyncThunk<
  FreeGameResponse,
  number,
  { rejectValue: string }
>("freeGame/getAll", async (page, thunkAPI) => {
  try {
    const res = await useGetDataToken<{ data: FreeGame[]; meta: Meta }>(
      `admin/games?filter[is_free]=1&filter[free_game_questions]=1&page=${page}&is_paginated=true`
    );
    return { data: res.data, meta: res.meta };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getFreeGames failed"
    );
  }
});

const freeGameSlice = createSlice({
  name: "freeGame",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFreeGames: (state) => {
      state.gameFree = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFreeGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFreeGames.fulfilled, (state, action) => {
        state.loading = false;
        state.gameFree = action.payload;
      })
      .addCase(getFreeGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearError, clearFreeGames } = freeGameSlice.actions;
export default freeGameSlice.reducer;