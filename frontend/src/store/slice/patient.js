import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

export const patientSlice = createSlice({
  name: "patient",
  initialState,

  reducers: {
    setPatientData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setPatientData } = patientSlice.actions;

export default patientSlice.reducer;
