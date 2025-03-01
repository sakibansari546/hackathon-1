import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slice/admin.js";
import staffReducer from "./slice/staff.js";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    staff: staffReducer,
  },
});
