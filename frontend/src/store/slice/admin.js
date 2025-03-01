import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {
    setAdminData: (state, action) => {
      state.data = action.payload;
    },
    createDepartment: (state, action) => {
      state.data.department.push(action.payload);
    },
    clearAdminData: (state) => {
      state.data = null;
    },
  },
});

export const { setAdminData, clearAdminData, createDepartment } =
  adminSlice.actions;

export default adminSlice.reducer;
