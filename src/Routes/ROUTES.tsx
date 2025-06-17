 import Admins from "../screen/admins/Admins";
 import Categories from "../screen/categories/Categories";
import ContactUs from "../screen/contactUs/ContactUs";
import Discount from "../screen/discount/Discount";
import Game from "../screen/game/Game";
 import Groups from "../screen/group/Groups";
import Posted_questions from "../screen/Posted_questions/Posted_questions";
import Prices from "../screen/prices/Prices";
 import Questions from "../screen/questions/Questions";
import Sales from "../screen/sales/Sales";
import SalesRecovered from "../screen/salesRecovered/SalesRecovered";
import SettingsPage from "../screen/settings/SettingsPage";
import SocialMedia from "../screen/SocialMedia";
 import AllUsers from "../screen/user/AllUsers";
   import ProductDetalis from "../screen/user/ProductDetalis";

 
export const ROUTES = [
  {
    path: "/",
    element: <AllUsers />,
  },
   {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/prices",
    element: <Prices />,
  },
  {
    path: "/admins",
    element: <Admins />,
  },
   {
    path: "/questions",
    element: <Questions />,
  },
  {
    path: "/Posted_questions",
    element: <Posted_questions />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
   {
    path: "/socialMedia",
    element: <SocialMedia />,
  },
   {
    path: "/game",
    element: <Game />,
  },
   {
    path: "/groups",
    element: <Groups />,
  },
  {
    path: "/sales",
    element: <Sales />,
  },
  {
    path: "/salesRecovered",
    element: <SalesRecovered />,
  },
  {
    path: "/contactus",
    element: <ContactUs />,
  },
  {
    path: "/discount",
    element: <Discount />,
  },
  {
    path: "/productDetails",
    element: <ProductDetalis />,
  },
];
