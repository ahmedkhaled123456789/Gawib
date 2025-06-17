import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./slice/AuthSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userSlice from "./slice/userSlice";
import ProductSlice from "./slice/productSlice";

 
const rootReducer = combineReducers({
  auth: AuthSlice,
  userSlice: userSlice,
  products:ProductSlice,
 });

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
