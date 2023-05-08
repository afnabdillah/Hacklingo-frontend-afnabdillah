import { configureStore } from "@reduxjs/toolkit";
import forumsSlice from "./forumsSlice.js";
import usersSlice from "./usersSlice.js";

export const store = configureStore({
  reducer: {
    usersReducer: usersSlice,
    forumsReducer: forumsSlice
  },
});
