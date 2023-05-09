import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import base_url from "./base_url";

// export const fetchArticles = createAsyncThunk(
//   "articlesSlice/fetchArticles", // this is the action name
//   async (input, { rejectWithValue }) => {
//     // this is the action
//     try {
//       const userId = await AsyncStorage.getItem("userid");
//       const response = await axios({
//         method: "GET",
//         url: `${base_url}/articles`,
//         headers: {
//           userid: userId,
//         },
//         params : {
//           search : input
//         }
//       });
//       return response.data;
//     } catch (err) {
//       if (err.response) {
//         return rejectWithValue(err.response.data);
//       } else {
//         throw err;
//       }
//     }
//   }
// );

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
        },
        logout(state){
            state.userId = null
            state.email = null
            state.username = null
        }
    },
  });
  
  export default authSlice.reducer;

  export const { loginSuccess, logout } = authSlice.actions