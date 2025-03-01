import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

export const staffSlice = createSlice({
  name: "staff",
  initialState,

  reducers: {
    setStaffData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setStaffData } = staffSlice.actions;

export default staffSlice.reducer;
