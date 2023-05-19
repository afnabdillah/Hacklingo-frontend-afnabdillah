import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, database } from "../config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import saveToAsyncStorage from "../helper/saveToAsyncStorage";
import base_url from "./base_url";
import { loginSuccess, updateSuccess } from "./authSlice";
import { FirebaseError } from "firebase/app";

export const fetchUserDetails = createAsyncThunk(
  "usersSlice/fetchUserDetails", // this is the action name
  async (_, { rejectWithValue }) => {
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
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const uploadChatImage = createAsyncThunk(
  "usersSlice/uploadChatImage", // this is the action name
  async (input, { rejectWithValue }) => {
    // this is the action
    try {
      const formData = new FormData();
      formData.append("file", input);
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "POST",
        url: `${base_url}/users/chatImage`,
        headers: {
          userid: userId,
        },
        data: formData,
      });
      return response.data;
    } catch (err) {
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
  async (targetLanguage, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/users`,
        headers: {
          userid: userId,
        },
        params: {
          targetLanguage,
        },
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else {
        throw err;
      }
    }
  }
);

export const fetchUsersBySearch = createAsyncThunk(
  "usersSlice/fetchUsersBySearch",
  async (search, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/users/usernames`,
        headers: {
          userid: userId,
        },
        params: {
          search,
        },
      });
      return response.data;
    } catch (err) {
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
      const { email, password } = input;
      // Login first to the project db for validation
      const response = await axios({
        method: "POST",
        url: `${base_url}/users/login`,
        data: input,
      });
      // Login to firebase after success
      await signInWithEmailAndPassword(auth, email, password);
      await saveToAsyncStorage(response.data);
      dispatch(
        loginSuccess({
          userId: response.data._id,
          email: response.data.email,
          username: response.data.username,
          profileImageUrl: response.data.profileImageUrl || "",
          nativeLanguage: response.data.nativeLanguage,
          targetLanguage: response.data.targetLanguage,
          role: response.data.role,
          deviceToken: response.data.deviceToken,
        })
      );
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
  async (input, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("email", input.email);
      formData.append("password", input.password);
      formData.append("username", input.username);
      formData.append("nativeLanguage", input.nativeLanguage);
      formData.append("targetLanguage", JSON.stringify(input.targetLanguage));
      formData.append("deviceToken", input.deviceToken);
      formData.append("role", "regular");
      // console.log(input.selectedImageData, "<<<< ini hasil selected image data");
      if (Object.keys(input.selectedImageData).length !== 0) {
        formData.append("file", input.selectedImageData);
        formData.append("context", "image");
      }
      // console.log(formData, "<<<< ini isi form Sign Up");
      // Sign up first to the project database
      const response = await axios({
        method: "POST",
        url: `${base_url}/users/register`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Sign Up to firebase if success
      const { user } = await createUserWithEmailAndPassword(
        auth,
        input.email,
        input.password
      );
      // Save it to firebase database
      // console.log(response.data.profileImageUrl, "<<<<< iin hasil profile image url sign up");
      const firebaseResult = await addDoc(collection(database, "users"), {
        email: user.email,
        username: response.data.username,
        profileImageUrl: response.data.profileImageUrl || "",
      });
      // console.log(firebaseResult, "<<<<< this is the result from firebase add Doc");
      // Save it to async storage
      await saveToAsyncStorage(response.data);
      dispatch(
        loginSuccess({
          userId: response.data._id,
          email: response.data.email,
          username: response.data.username,
          profileImageUrl: response.data.profileImageUrl || "",
          nativeLanguage: response.data.nativeLanguage,
          targetLanguage: response.data.targetLanguage,
          role: response.data.role,
          deviceToken: response.data.deviceToken,
        })
      );
      return true;
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

export const fetchOtherUserByEmail = createAsyncThunk(
  "usersSlice/fetchOtherUserByEmail",
  async (email, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userid");
      const response = await axios({
        method: "GET",
        url: `${base_url}/users/email`,
        headers: {
          userid: userId,
        },
        params: { email },
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data.message);
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
  async (input, { rejectWithValue, dispatch }) => {
    try {
      input.append("context", "image");
      // console.log(input, "<<<< ini input image");
      const userId = await AsyncStorage.getItem("userid");
      const userEmail = await AsyncStorage.getItem("email");
      const response = await axios({
        method: "PUT",
        url: `${base_url}/users/${userId}`,
        headers: {
          userid: userId,
          "Content-Type": "multipart/form-data",
        },
        data: input,
      });
      // Save it to reducer
      dispatch(
        updateSuccess({
          username: response.data.username,
          profileImageUrl: response.data.profileImageUrl,
          nativeLanguage: response.data.nativeLanguage,
        })
      );
      // Save it to Async Storage
      await saveToAsyncStorage(response.data);
      // Save it to firebase database
      const usersCollectionRef = collection(database, "users");
      const q = query(usersCollectionRef, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);
      console.log(
        querySnapshot.empty,
        "<<<< ini isi snapshot kosong atau tidak"
      );
      console.log(
        querySnapshot.docs[0].ref,
        "<<<< ini hasil mendapatkan query dari update users"
      );
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        const updatedFirebaseResult = await updateDoc(userDocRef, {
          username: response.data.username,
          profileImageUrl: response.data.profileImageUrl,
        });
        console.log(updatedFirebaseResult, "<<<< ini hasil update firebase");
      } else {
        throw { message: "Email not found on firebase" };
      }
      return response.data;
    } catch (err) {
      // return err.response if it was an axios error with reject with value
      if (err.response) {
        return rejectWithValue(err.response.data);
      } else if (err instanceof FirebaseError) {
        console.log(err, "masuk error firebase");
        return rejectWithValue(err);
      } else {
        console.log(err, "masuk throw error");
        return rejectWithValue(err);
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
        },
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
    usersBySearch: [],
    userByEmail: {},
    status: {
      userDetails: "idle",
      users: "idle",
      updateUserDetails: "idle",
      userSignUp: "idle",
      userLogin: "idle",
      usersBySearch: "idle",
      uploadChatImage: "idle",
      userByEmail: "idle",
    },
  },
  reducers: {
    deleteUsersBySearch(state, action) {
      state.usersBySearch = [];
    },
  },
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
      .addCase(fetchUsersBySearch.pending, (state, action) => {
        state.status.usersBySearch = "loading";
      })
      .addCase(fetchUsersBySearch.fulfilled, (state, action) => {
        state.status.usersBySearch = "idle";
        state.usersBySearch = action.payload;
      })
      .addCase(fetchUsersBySearch.rejected, (state, action) => {
        state.status.usersBySearch = "error";
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
      })
      .addCase(uploadChatImage.pending, (state, action) => {
        state.status.uploadChatImage = "loading";
      })
      .addCase(uploadChatImage.fulfilled, (state, action) => {
        state.status.uploadChatImage = "idle";
      })
      .addCase(uploadChatImage.rejected, (state, action) => {
        state.status.uploadChatImage = "error";
      })
      .addCase(fetchOtherUserByEmail.pending, (state, action) => {
        state.status.userByEmail = "loading";
      })
      .addCase(fetchOtherUserByEmail.fulfilled, (state, action) => {
        state.status.userByEmail = "idle";
        state.userByEmail = action.payload;
      })
      .addCase(fetchOtherUserByEmail.rejected, (state, action) => {
        state.status.userByEmail = "error";
      });
  },
});

export default usersSlice.reducer;

export const { deleteUsersBySearch } = usersSlice.actions;
