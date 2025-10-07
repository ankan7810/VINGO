import { createSlice } from "@reduxjs/toolkit";

const tipsSlice = createSlice({
  name: "tips",
  initialState: { value: 0 },
  reducers: {
    setTips: (state, action) => {
      state.value = action.payload >= 0 ? action.payload : 0;
    },
  },
});

export const { setTips } = tipsSlice.actions;
export default tipsSlice.reducer;