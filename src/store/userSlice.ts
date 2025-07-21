import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user:  [],
  currentUser: [],
  userProfile: [],
  userChangePassword: [],

};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
    // show user
    
  },
 
});
export default userSlice.reducer;
