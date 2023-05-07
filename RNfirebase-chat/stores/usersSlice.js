import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, database } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import saveToAsyncStorage from "../helper/saveToAsyncStorage";

const base_url = "https://966a-103-171-161-131.ngrok-free.app";

const usersSlice = createSlice({
  name: "usersSlice",
  initialState: {
    users: [],
    userDetails: {},
  },
  reducers: {
    fetchUsersByNativeLanguage(state, action) {
      // Add logic function here
      AsyncStorage.getItem("userid")
        .then((userId) => {
          return axios({
            method: "GET",
            url: `${base_url}/users`,
            headers: {
              userid: userId,
            },
            params: {
              nativeLanguage: action.payload,
            },
          });
        })
        .then((response) => {
          console.log(response.data, "ini hasil");
        })
        .catch((err) => console.log(err, "<<<< ini error di reducer"));
    },

    fetchUserDetails(state, action) {
      // Add logic function here
      AsyncStorage.getItem("userid")
        .then((userId) => {
          return axios({
            method: "GET",
            url: `${base_url}/users/${userId}`,
            headers: {
              userid: userId,
            },
          });
        })
        .then((response) => {
          console.log(response.data.posts, "ini hasil posts user details");
          console.log(
            response.data.comments,
            "ini hasil comments user details"
          );
        })
        .catch((err) => console.log(err, "<<<< ini error di reducer"));
    },

    updateUserDetails(state, action) {
      // Add logic function here
      AsyncStorage.getItem("userid")
        .then((userId) => {
          return axios({
            method: "PUT",
            url: `${base_url}/users/${userId}`,
            headers: {
              userid: userId,
            },
            data: action.payload,
          });
        })
        .then((response) => {
          console.log(response.data, "ini hasil update user");
          console.log(response.data.username, "ini hasil update user");
        })
        .catch((err) => console.log(err, "<<<< ini error di reducer"));
    },

    userLogin(state, action) {
      // First we log in into the database, then we log in into the firebase account
      // List to do: add userId from response.data._id into firebase
      const { email, password } = action.payload;
      let result = {}; // To save login response from axios
      axios({
        method: "POST",
        url: `${base_url}/users/login`,
        data: action.payload,
      })
        .then((response) => {
          result = response.data;
          return signInWithEmailAndPassword(auth, email, password);
        })
        .then(() => saveToAsyncStorage(result))
        .then(() => AsyncStorage.getItem("userid"))
        .then((userId) => console.log(`Login success with user id ${userId}`))
        .catch((err) => console.log(err, "<<<< ini error di reducer"));
    },

    userSignUp(state, action) {
      // these are temporary additionals
      const { email, password, username } = action.payload;
      const additionals = {
        nativeLanguage: "Indonesian/Bahasa Indonesia",
        targetLanguage: ["English", "German/Deutsch"],
        role: "regular",
      };
      let result = {};
      axios({
        method: "POST",
        url: `${base_url}/users/register`,
        data: { ...action.payload, ...additionals },
      })
        .then((response) => {
          console.log("selesai axios");
          result = response.data;
          return createUserWithEmailAndPassword(auth, email, password);
        })
        .then((userCredential) => {
          console.log("selesai firebase");
          const user = userCredential.user;
          // Add the user's email and username to Firestore
          addDoc(collection(database, "users"), {
            email: user.email,
            username: username,
          });
        })
        .then(() => saveToAsyncStorage(result))
        .then(() => AsyncStorage.getItem("userid"))
        .then((userId) => console.log(`signup success with user id ${userId}`))
        .catch((err) => console.log(err, "<<<< ini error di reducer"));
    },
  },
});

export const {
  fetchUsersByNativeLanguage,
  fetchUserDetails,
  updateUserDetails,
  userLogin,
  userSignUp,
} = usersSlice.actions;
export default usersSlice.reducer;
