import { lazy, Suspense } from "react";
import Auth from "../Auth/Auth";
import DashboardLayout from "../Layout/DashboardLayout";
import PrivateRoute from "./PrivateRoute";

// Lazy load all components
const AllUsers = lazy(() => import("../screen/user/AllUsers"));
const Categories = lazy(() => import("../screen/categories/Categories"));
const Admins = lazy(() => import("../screen/admins/Admins"));
const Questions = lazy(() => import("../screen/questions/Questions"));
const SettingsPage = lazy(() => import("../screen/settings/SettingsPage"));
const Game = lazy(() => import("../screen/game/Game"));
const Groups = lazy(() => import("../screen/group/Groups"));
const SalesRecovered = lazy(
  () => import("../screen/salesRecovered/SalesRecovered")
);
const ContactUs = lazy(() => import("../screen/contactUs/ContactUs"));
const Discount = lazy(() => import("../screen/discount/Discount"));
const UpdateUser = lazy(() => import("../screen/user/UpdateUser"));
const SocialMedia = lazy(() => import("../screen/socialLonk/SocialMedia"));
const AddUser = lazy(() => import("../screen/user/AddUser"));
const GamePackages = lazy(() => import("../screen/GamePackages/GamePackages"));
const PostedQuestions = lazy(
  () => import("../screen/PostedQuestions/posted-questions")
);
const UpdateAdmin = lazy(() => import("../screen/admins/UpdateAdmin"));
const UpdateGroup = lazy(() => import("../screen/group/UpdateGroup"));
const Payment = lazy(() => import("../screen/sales/Payment"));
const SocialMediaEdit = lazy(
  () => import("../screen/socialLonk/SocialMediaEdit")
);
const AddSocialMedia = lazy(
  () => import("../screen/socialLonk/AddSocialMedia")
);

// Loading component
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Wrapper component with Suspense
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);

export const ROUTES = [
  {
    path: "/login",
    element: <Auth />,
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            path: "",
            element: (
              <SuspenseWrapper>
                <AllUsers />
              </SuspenseWrapper>
            ),
          },
          {
            path: "add-user",
            element: (
              <SuspenseWrapper>
                <AddUser />
              </SuspenseWrapper>
            ),
          },
          {
            path: "categories",
            element: (
              <SuspenseWrapper>
                <Categories />
              </SuspenseWrapper>
            ),
          },
          {
            path: "admins",
            element: (
              <SuspenseWrapper>
                <Admins />
              </SuspenseWrapper>
            ),
          },
          {
            path: "admin/edit/:id",
            element: (
              <SuspenseWrapper>
                <UpdateAdmin />
              </SuspenseWrapper>
            ),
          },
          {
            path: "questions",
            element: (
              <SuspenseWrapper>
                <Questions />
              </SuspenseWrapper>
            ),
          },
          {
            path: "posted-questions",
            element: (
              <SuspenseWrapper>
                <PostedQuestions />
              </SuspenseWrapper>
            ),
          },
          {
            path: "game-packages",
            element: (
              <SuspenseWrapper>
                <GamePackages />
              </SuspenseWrapper>
            ),
          },
          {
            path: "settings",
            element: (
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "socialMedia",
            element: (
              <SuspenseWrapper>
                <SocialMedia />
              </SuspenseWrapper>
            ),
          },
          {
            path: "add-socialMedia",
            element: (
              <SuspenseWrapper>
                <AddSocialMedia />
              </SuspenseWrapper>
            ),
          },
          {
            path: "socialMedia/edit/:id",
            element: (
              <SuspenseWrapper>
                <SocialMediaEdit />
              </SuspenseWrapper>
            ),
          },
          {
            path: "game",
            element: (
              <SuspenseWrapper>
                <Game />
              </SuspenseWrapper>
            ),
          },
          {
            path: "groups",
            element: (
              <SuspenseWrapper>
                <Groups />
              </SuspenseWrapper>
            ),
          },
          {
            path: "group/edit/:id",
            element: (
              <SuspenseWrapper>
                <UpdateGroup />
              </SuspenseWrapper>
            ),
          },
          {
            path: "payments",
            element: (
              <SuspenseWrapper>
                <Payment />
              </SuspenseWrapper>
            ),
          },
          {
            path: "salesRecovered",
            element: (
              <SuspenseWrapper>
                <SalesRecovered />
              </SuspenseWrapper>
            ),
          },
          {
            path: "contactus",
            element: (
              <SuspenseWrapper>
                <ContactUs />
              </SuspenseWrapper>
            ),
          },
          {
            path: "discount",
            element: (
              <SuspenseWrapper>
                <Discount />
              </SuspenseWrapper>
            ),
          },
          {
            path: "user/:id",
            element: (
              <SuspenseWrapper>
                <UpdateUser />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
];
