import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { useGetData } from "../hooks/useGetData";

 
interface GameData {
 category_id: number;
 name: string;
  description: string;
  image:string;
  is_active: boolean,

 }

interface GameState {
  game: GameData | null;
  games :  GameData | null;
  loading: boolean;
  error: string | null;
}

const initialState: GameState = {
  game: null,
  games:null,
  loading: false,
  error: null,
};

// ================ get game ===============
export const getGame = createAsyncThunk<
  GameData,
  { id: string }, 
  { rejectValue: string }
>(
  "game/getGame",
  async ({ id }, thunkAPI) => {
    try {
      const res = await useGetData<GameData>(`games/${id}`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getGame failed");
    }
  }
);


// ================ get games ===============
export const getGames = createAsyncThunk<
  GameData,
  { id: string }, 
  { rejectValue: string }
>(
  "game/getGames",
  async (_, thunkAPI) => {
    try {
      const res = await useGetData<GameData>(`games`);
      return res;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data.message || "getGames failed");
    }
  }
);
// ================ Slice ===============
const gamesSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getGame
     .addCase(getGame.fulfilled, (state, action: PayloadAction<GameData>) => {
        state.game = action.payload;
        state.loading = false;
        state.error = null;
      })
      // getGames
.addCase(getGames.fulfilled, (state, action: PayloadAction<GameData>) => {
        state.games = action.payload;
        state.loading = false;
        state.error = null;
      })       
  },
});

export default gamesSlice.reducer;
