import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        userId : null,
        email : null,
        username: null
    },
    reducers: {
        loginSuccess(state, action) {
            state.userId = action.payload.userId
            state.email = action.payload.email
            state.username = action.payload.username
            state.profileImageUrl = action.payload.profileImageUrl
        },
        logout(state){
            state.userId = null
            state.email = null
            state.username = null
            state.profileImageUrl = null
        }
    },
  });
  
  export default authSlice.reducer;

  export const { loginSuccess, logout } = authSlice.actions