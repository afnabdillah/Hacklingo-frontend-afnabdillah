import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, database } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import saveToAsyncStorage from "../helper/saveToAsyncStorage";
import { NavigationActions, StackActions } from 'react-navigation';
import base_url from "./base_url";
import { loginSuccess } from "./authSlice";

export const fetchUserDetails = createAsyncThunk(
  "usersSlice/fetchUserDetails", // this is the action name
  async (_, {rejectWithValue}) => {
    // this is the action
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/users/${userId}`,
        headers: {
          userid: userId,
        },
      });
      return response.data;
    } catch(err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const fetchUsersByNativeLanguage = createAsyncThunk(
  "usersSlice/fetchUsersByNativeLanguage",
  async (nativeLanguage) => {
    try {
    const userId = await AsyncStorage.getItem("userid");
    const response = await axios({
      method: "GET",
      url: `${base_url}/users`,
      headers: {
        userid: userId,
      },
      params: {
        nativeLanguage,
      },
    });
    return response.data;
  } catch(err) {
    if (err.response) {
      return rejectWithValue(err.response.data);
    } else {
      throw err;
    }
  }
  }
);

export const userLogin = createAsyncThunk(
  "usersSlice/userLogin",
  async (input, { rejectWithValue, dispatch }) => {
    try {
      const { email, password, navigation } = input;
      // Login first to the project db for validation
      const response = await axios({
        method: "POST",
        url: `${base_url}/users/login`,
        data: input,
      });
      // Login to firebase after success
      await signInWithEmailAndPassword(auth, email, password);
      await saveToAsyncStorage(response.data);
      dispatch(loginSuccess(response.data._id))
      return true;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const userSignUp = createAsyncThunk(
  "usersSlice/userSignUp",
  async (input, { rejectWithValue }) => {
    try {
      // these are temporary additionals
      const additionals = {
        nativeLanguage: "Indonesian/Bahasa Indonesia",
        targetLanguage: ["English", "German/Deutsch"],
        role: "regular",
      };
      // Sign up first to the project database
      const { email, password, username } = input;
      const response = await axios({
        method: "POST",
        url: `${base_url}/users/register`,
        data: {
          ...input,
          ...additionals,
        },
      });
      // Sign Up to firebase if success
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Save it to firebase database
      await addDoc(collection(database, "users"), {
        email: user.email,
        username: username,
      });
      // Save it to async storage
      await saveToAsyncStorage(response.data);
      const userId = await AsyncStorage.getItem("itemid");
      return userId;
    } catch (err) {
      // return err.response if it was an axios error with reject with value
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const logoutUser = createAsyncThunk(
  "usersSlice/logoutUser",
  async () => {
    try {
      await AsyncStorage.multiRemove(["username", "email", "userid"]);
      await signOut(auth);
    } catch (err) {
      console.log("Error logging out: ", err);
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "usersSlice/updateUserDetails",
  async (input, { rejectWithValue }) => {
    try {
      // console.log(input, "<<<< ini input di axios");
      input.append("context", "image");
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "PUT",
        url: `${base_url}/users/${userId}`,
        headers: {
          userid: userId,
          "Content-Type" : "multipart/form-data"
        },
        data: input,
      });
      console.log(response.data, "<<< ini hasil dari axios");
      return response.data;
    } catch (err) {
      // return err.response if it was an axios error with reject with value
      if (err.response) {
        console.log(err.response.data);
        return rejectWithValue(err.response.data);
      } else {
        console.log(err, "masuk throw error");
      }
    }
  }
);

export const deleteUser = createAsyncThunk(
  "usersSlice/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "DELETE",
        url: `${base_url}/users/${userId}`,
        headers: {
          userid: userId,
        }
      });
      return response.data;
    } catch (err) {
      // return err.response if it was an axios error with reject with value
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

const usersSlice = createSlice({
  name: "usersSlice",
  initialState: {
    users: [],
    userDetails: {},
    status: {
      userDetails: "idle",
      users: "idle",
      updateUserDetails: "idle",
      userSignUp: "idle",
      userLogin: "idle"
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state, action) => {
        state.status.userDetails = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status.userDetails = "idle";
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status.userDetails = "error";
      })
      .addCase(fetchUsersByNativeLanguage.pending, (state, action) => {
        state.status.users = "loading";
      })
      .addCase(fetchUsersByNativeLanguage.fulfilled, (state, action) => {
        state.status.users = "idle";
        state.users = action.payload;
      })
      .addCase(fetchUsersByNativeLanguage.rejected, (state, action) => {
        state.status.users = "error";
      })
      .addCase(updateUserDetails.pending, (state, action) => {
        state.status.updateUserDetails = "loading";
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.status.updateUserDetails = "idle";
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status.updateUserDetails = "error";
      })
      .addCase(userSignUp.pending, (state, action) => {
        state.status.userSignUp = "loading";
      })
      .addCase(userSignUp.fulfilled, (state, action) => {
        state.status.userSignUp = "idle";
      })
      .addCase(userSignUp.rejected, (state, action) => {
        state.status.userSignUp = "error";
      })
      .addCase(userLogin.pending, (state, action) => {
        state.status.userLogin = "loading";
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status.userLogin = "idle";
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status.userLogin = "error";
      });
  },
});

export default usersSlice.reducer;
