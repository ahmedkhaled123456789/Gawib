import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { useGetDataToken } from "../utils/api";
import useDeleteData from "../hooks/useDeleteData";
import { useInsertDataWithImage } from "../hooks/useInsertData";

// ================= Interfaces =================
interface GameData {
  [x: string]: any;
  name: string;
  description: string;
  image: string;
  category_id: string;
  admin_id: string;
  is_active: string;
}

interface GameState {
  games: GameData | null;
  game: GameData | null;
  gameFree: GameData | null;
  loading: boolean;
  error: string | null;
}

const initialState: GameState = {
  games: null,
  game: null,
  gameFree: null,
  loading: false,
  error: null,
};

// ================= Thunks =================

// ---- Get All Games with optional search ----
export const getGames = createAsyncThunk<
  GameData,
  { page: number; search?: string },
  { rejectValue: string }
>("game/getGames", async ({ page, search }, thunkAPI) => {
  try {
    const url = search
      ? `admin/games?page=${page}&filter[name]=${encodeURIComponent(search)}`
      : `admin/games?page=${page}`;
    const res = await useGetDataToken<GameData>(url);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getGames failed"
    );
  }
});

// gameSlice.ts
export const getAllGamesForDropdown = createAsyncThunk<
  GameData,
  void,
  { rejectValue: string }
>("game/getAllGamesForDropdown", async (_, thunkAPI) => {
  try {
    const res = await useGetDataToken<GameData>(`admin/games`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getAllGamesForDropdown failed"
    );
  }
});

// ---- Get Free Games ----
export const getGameFree = createAsyncThunk<
  GameData,
  number,
  { rejectValue: string }
>("game/getGameFree", async (page, thunkAPI) => {
  try {
    const res = await useGetDataToken<GameData>(
      `admin/games?filter[is_free]=1&page=${page}`
    );
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getGameFree failed"
    );
  }
});

// ---- Get One Game by ID ----
export const getGameById = createAsyncThunk<
  GameData,
  string,
  { rejectValue: string }
>("game/getGameById", async (id, thunkAPI) => {
  try {
    const res = await useGetDataToken<GameData>(`admin/games/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "getGameById failed"
    );
  }
});

// ---- Create Game ----
export const createGame = createAsyncThunk<
  GameData,
  FormData,
  { rejectValue: string }
>("game/createGame", async (formData, thunkAPI) => {
  try {
    const res = await useInsertDataWithImage<FormData>(`admin/games`, formData);
    thunkAPI.dispatch(getGames({ page: 1 }));
    return res as unknown as GameData;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "createGame failed"
    );
  }
});

// ---- Update Game ----
export const updateGame = createAsyncThunk<
  GameData,
  { id: string; data: FormData },
  { rejectValue: string }
>("game/updateGame", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInsertDataWithImage<FormData>(
      `admin/games/${id}`,
      data
    );
    thunkAPI.dispatch(getGames({ page: 1 }));
    return res as unknown as GameData;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "updateGame failed"
    );
  }
});

// ---- Delete Game ----
export const deleteGame = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("game/deleteGame", async (id, thunkAPI) => {
  try {
    const res = await useDeleteData(`admin/games/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "deleteGame failed"
    );
  }
});

// ================= Slice =================
const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGames.fulfilled, (state, action) => {
        state.games = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getGameFree.fulfilled, (state, action) => {
        state.gameFree = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getGameById.fulfilled, (state, action) => {
        state.game = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createGame.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateGame.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteGame.fulfilled, (state) => {
        state.games = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllGamesForDropdown.fulfilled, (state, action) => {
        // لو الـ API بيرجع object فيه data زي { data: [...] } استخدم action.payload.data
        state.games = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllGamesForDropdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGamesForDropdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load games";
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

export default gameSlice.reducer;
