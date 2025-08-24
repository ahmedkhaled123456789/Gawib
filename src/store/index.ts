import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import contactReducer from "./contactSlice";
import gameReducer from "./gameSlice";
import gamePackageReducer from "./GamePackagesSlice";
import discountCodesReducer from "./DiscountSlice";
import socialLinksReducer from "./SocialLinksSlice";
import categoriesReducer from "./categoriesSlice";
import settingsReducer from "./settingSlice";
import questionsReducer from "./questionsSlice";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice";
import paymentReducer from "./payment";

const store = configureStore({
  reducer: {
    auth: authReducer,
    contact: contactReducer,
    game: gameReducer,
    gamePackage: gamePackageReducer,
    discountCodes: discountCodesReducer,
    socialLinks: socialLinksReducer,
    categories: categoriesReducer,
    settings: settingsReducer,
    questions: questionsReducer,
    user:userReducer,
    admin:adminReducer,
    payment:paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
