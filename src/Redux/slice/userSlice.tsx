import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import useInsertData from "../../hooks/useInsertData";
import { useInsUpdateData } from "../../hooks/useUpdateData";
import useDeleteData from "../../hooks/useDeleteData";
import { useGetDataToken } from "../../hooks/useGetData";

// Types for user and licenses
interface ILicenses {
  createdAt: Date;
  expiresAt: Date;
  license: string;
  machines: string[];
  status: "active" | "inactive";
  updatedAt: Date;
  user: string;
  _id: string;
}

export interface User {
  _id: string;
  userName: string;
  password: string;
  phone: string;
  role: string;
  license: ILicenses[];
  email: string;
  madrasatiEmail: string;
  eduEstablishment: string;
  teacherType: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUsersData {
  pages: number;
  data: User[];
}

interface UserState {
  users: IUsersData | null;
  oneUser: { data: User } | null;
  loading: boolean;
  error: string | null;
  usersCount: string | null;
}

const initialState: UserState = {
  users: null,
  oneUser: null,
  loading: false,
  error: null,
  usersCount: null,
};

// ========================== create user =================================
export const addUser = createAsyncThunk<User, Partial<User>>(
  "user/addUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await useInsertData("/api/users", data);
      return res as User;
    } catch (error) {
      console.error("Error adding user:", error);
      return rejectWithValue("Failed to add user");
    }
  }
);

// ========================== get users =================================
export const getUsers = createAsyncThunk<
  IUsersData,
  { page: number; search: string }
>("user/getUsers", async ({ page, search }, { rejectWithValue }) => {
  try {
    const res = await useGetDataToken(
      `api/users?license=true&page=${page}&q=${search}`
    );
    return res as IUsersData;
  } catch (error) {
    console.error("Error fetching users:", error);
    return rejectWithValue("Failed to fetch users");
  }
});

// ========================== get count =================================
export const getUsersCount = createAsyncThunk(
  "user/getUsersCount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await useGetDataToken(`api/reports/users/count`);
      return res as string;
    } catch (error) {
      console.error("Error fetching users:", error);
      return rejectWithValue("Failed to fetch users");
    }
  }
);

// ========================== get user details ===============================
export const getUser = createAsyncThunk<{ data: User }, string>(
  "user/getUser",
  async (userID, { rejectWithValue }) => {
    try {
      const res = await useGetDataToken(`/api/users/${userID}`);
      return res as { data: User };
    } catch (error) {
      console.error("Error fetching user details:", error);
      return rejectWithValue("Failed to fetch user details");
    }
  }
);

// ========================== update user promotion ===========================
export const updatePromotion = createAsyncThunk<
  User,
  { id: string; formData: Partial<User> }
>("user/updatePromotion", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await useInsUpdateData(`/api/users/${id}`, formData);
    return res.data as User;
  } catch (error) {
    console.error("Error updating promotion:", error);
    return rejectWithValue("Failed to update promotion");
  }
});

// ========================== delete user =====================================
export const deleteUser = createAsyncThunk<string, string>(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await useDeleteData(`/api/users/${id}`);
      return id;
    } catch (error) {
      console.error("Error deleting user:", error);
      return rejectWithValue("Failed to delete user");
    }
  }
);

// ========================== update license =================================
export const updateLicense = createAsyncThunk<
  { data: User },
  { startDate: string; status: string }
>("user/updateLicense", async (data, { rejectWithValue }) => {
  try {
    const res = await useInsUpdateData("/api/license", data);
    return res.data as { data: User };
  } catch (error) {
    console.error("Error updating license:", error);
    return rejectWithValue("Failed to update license");
  }
});

export const updateLicenseId = createAsyncThunk<
  { data: User },
  { id: string; formData: Partial<User> }
>("user/updateLicenseId", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await useInsUpdateData(`/api/license/${id}`, formData);
    return res.data as { data: User };
  } catch (error) {
    console.error("Error updating license:", error);
    return rejectWithValue("Failed to update license");
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateLicensState: (state, action: PayloadAction<string>) => {
      if (state.users) {
        state.users.data = state.users.data.map((user) => {
          return {
            ...user,
            license: user.license?.map((v) => {
              if (v._id === action.payload) {
                return {
                  ...v,
                  status: v.status === "active" ? "inactive" : "active",
                };
              }
              return v;
            }),
          };
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Add User
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users?.data.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUsers.fulfilled,
        (state, action: PayloadAction<IUsersData>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Users count

      .addCase(getUsersCount.fulfilled, (state, action) => {
        state.usersCount = action.payload;
      })

      // Get User by ID
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload, "............. getUser ..............");
        state.oneUser = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Promotion
      .addCase(updatePromotion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updatePromotion.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          if (state.users) {
            state.users.data = state.users.data.map((user) =>
              user._id === action.payload._id ? action.payload : user
            );
          }
        }
      )
      .addCase(updatePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        if (state.users) {
          state.users.data = state.users.data.filter(
            (user) => user._id !== action.payload
          );
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update License
      .addCase(updateLicense.fulfilled, (state, action) => {
        state.loading = false;
        state.oneUser = action.payload;
      })
      .addCase(updateLicenseId.fulfilled, (state, action) => {
        state.loading = false;
        state.oneUser = action.payload;
      });
  },
});

export default userSlice.reducer;

export const { updateLicensState } = userSlice.actions;
