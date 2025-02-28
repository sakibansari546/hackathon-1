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
    clearAdminData: (state) => {
      state.data = null;
    },
  },
});

export const { setAdminData, clearAdminData } = adminSlice.actions;

export default adminSlice.reducer;
