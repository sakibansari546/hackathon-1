import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slice/admin.js";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
});
