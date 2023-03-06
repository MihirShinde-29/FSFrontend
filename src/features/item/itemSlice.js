import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "item",
  initialState: {
    items: [],
    status: "idle",
  },
  reducers: {
    setItems: (state, { payload }) => {
      state.items = payload;
    },
    setStatus: (state, { payload }) => {
      state.status = payload;
    },
  },
});

export const { setItems, setStatus } = itemSlice.actions;

export default itemSlice.reducer;
