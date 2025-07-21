import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import passwordReducer from "./resetPassword";
import contactReducer from "./contactSlice";
import gameReducer from "./gameSlice";
import gamePackageReducer from "./GamePackagesSlice";
import discountReducer from "./DiscountSlice";
import socialReducer from "./SocialLinksSlice";
import categoriesReducer from "./categoriesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    password:passwordReducer,
    contact:contactReducer,
    game:gameReducer,
    gamePackage:gamePackageReducer,
    discount:discountReducer,
    social:socialReducer,
    category:categoriesReducer



  },
});

 export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
