import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "./usersSlice.js";

export const store = configureStore({
  reducer: {
    usersReducer: usersSlice
  },
});
