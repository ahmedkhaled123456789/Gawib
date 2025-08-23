import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useGetDataToken } from "../utils/api";
import { AxiosError } from "axios";
import useDeleteData from "../hooks/useDeleteData";
import { useInUpdateData } from "../hooks/useUpdateData";
import { useInsertDataWithImage} from "../hooks/useInsertData";

interface GameData {
  [x: string]: any;
   name: string;
  description: string;
  image: string;
  category_id:string;
  admin_id:string;
  is_active:string;
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
  gameFree:null,
  loading: false,
  error: null,
};

// ============ Get All Games ============
export const getGames = createAsyncThunk<
  GameData,
  void,
  { rejectValue: string }
>("game/getGames", async (_, thunkAPI) => {
  try {
    const res = await useGetDataToken<GameData>(`admin/games`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "getGames failed");
  }
});
// ============ Get All Games ============
export const getGameFree = createAsyncThunk<
  GameData,
  void,
  { rejectValue: string }
>("game/getGameFree", async (_, thunkAPI) => {
  try {
    const res = await useGetDataToken<GameData>(`admin/games?filter[is_free]=1`);
    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(err.response?.data.message || "getGames failed");
  }
});
// ============ Get One Game ============
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
    return thunkAPI.rejectWithValue(err.response?.data.message || "getGameById failed");
  }
});

 // ============ Create Game ============
export const createGame = createAsyncThunk<
  GameData,
  FormData,
  { rejectValue: string }
>(
  "game/createGame",
  async (formData, thunkAPI) => {
    try {
      const res = await useInsertDataWithImage<FormData>(`admin/games`, formData);
      thunkAPI.dispatch(getGames());
      return res as unknown as GameData;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        err.response?.data.message || "createGame failed"
      );
    }
  }
);


// ============ Update Game ============
export const updateGame = createAsyncThunk<
  GameData,
  { id: string; data: FormData }, 
  { rejectValue: string }
>("game/updateGame", async ({ id, data }, thunkAPI) => {
  try {
    const res = await useInsertDataWithImage<FormData>(`admin/games/${id}`, data);
          thunkAPI.dispatch(getGames());
    return res as unknown as GameData;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "updateGame failed"
    );
  }
});

// ============ Delete Game ============
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
    return thunkAPI.rejectWithValue(err.response?.data.message || "deleteGame failed");
  }
});

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGames.fulfilled, (state, action) => {
      state.games = action.payload;
      state.loading = false;
      state.error = null;
    });
   builder.addCase(getGameFree.fulfilled, (state, action) => {
      state.games = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(getGameById.fulfilled, (state, action) => {
      state.game = action.payload;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(createGame.fulfilled, (state) => {
       state.loading = false;
      state.error = null;
    });

    builder.addCase(updateGame.fulfilled, (state) => {
       state.loading = false;
      state.error = null;
    });

    builder.addCase(deleteGame.fulfilled, (state) => {
      state.games = null;
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

export default gameSlice.reducer;
