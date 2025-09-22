import Auth from "../Auth/Auth";
import DashboardLayout from "../Layout/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import AllUsers from "../screen/user/AllUsers";
import Categories from "../screen/categories/Categories";
import Prices from "../screen/prices/Prices";
import Admins from "../screen/admins/Admins";
import Questions from "../screen/questions/Questions";
import SettingsPage from "../screen/settings/SettingsPage";
import Game from "../screen/game/Game";
import Groups from "../screen/group/Groups";
import Sales from "../screen/sales/Sales";
import SalesRecovered from "../screen/salesRecovered/SalesRecovered";
import ContactUs from "../screen/contactUs/ContactUs";
import Discount from "../screen/discount/Discount";
import ProductDetalis from "../screen/user/ProductDetalis";
import SocialMedia from "../screen/socialLonk/SocialMedia";
import AddUser from "../screen/user/AddUser";
import GamePackages from "../screen/GamePackages/GamePackages";
import PostedQuestions from "../screen/PostedQuestions/posted-questions";

export const ROUTES = [
  {
    path: "/login",
    element: <Auth />,
  },
  {
    path: "/",
    element: <PrivateRoute />, // protect everything inside
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          { path: "", element: <AllUsers /> },
          { path: "add-user", element: <AddUser /> },
          { path: "categories", element: <Categories /> },
          { path: "prices", element: <Prices /> },
          { path: "admins", element: <Admins /> },
          { path: "questions", element: <Questions /> },
          {path: "posted-questions", element: <PostedQuestions /> },
          { path: "game-packages", element: <GamePackages /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "socialMedia", element: <SocialMedia /> },
          { path: "game", element: <Game /> },
          { path: "groups", element: <Groups /> },
          { path: "sales", element: <Sales /> },
          { path: "salesRecovered", element: <SalesRecovered /> },
          { path: "contactus", element: <ContactUs /> },
          { path: "discount", element: <Discount /> },
          { path: "productDetails", element: <ProductDetalis /> },
        ],
      },
    ],
  },
];
