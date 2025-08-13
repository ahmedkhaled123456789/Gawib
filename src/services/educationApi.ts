import { createApi } from "@reduxjs/toolkit/query/react";
import { getDataToken } from "../hooks/useGetData";
    
export const educationApi = createApi({
  reducerPath: "educationApi",
  baseQuery: async () => ({ data: {} }),
  endpoints: (builder) => ({
    getAdmins: builder.query({
      async queryFn() {
        try {
          const data = await getDataToken("admin/admins");
          return { data };
        } catch (error: any) {
          return { error: { status: 500, data: error.message } };
        }
      },
    }),

    getCategories: builder.query({
      async queryFn() {
        try {
          const data = await getDataToken("admin/categories");
          return { data };
        } catch (error: any) {
          return { error: { status: 500, data: error.message } };
        }
      },
    }),

    getUser: builder.query({
      async queryFn() {
        try {
          const data = await getDataToken("admin/users");
          return { data };
        } catch (error: any) {
          return { error: { status: 500, data: error.message } };
        }
      },
    }),

    getGamePackages: builder.query({
      async queryFn() {
        try {
          const data = await getDataToken("admin/game-packages");
          return { data };
        } catch (error: any) {
          return { error: { status: 500, data: error.message } };
        }
      },
    }),

    getGames: builder.query({
      async queryFn() {
        try {
          const data = await getDataToken("admin/games");
          return { data };
        } catch (error: any) {
          return { error: { status: 500, data: error.message } };
        }
      },
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetAdminsQuery,
  useGetUserQuery,
  useGetGamePackagesQuery,
  useGetGamesQuery,
} = educationApi;
