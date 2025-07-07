import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LikeStateProps } from "@/app/types/interfaces";

const initialState: LikeStateProps = {
  likes: {},
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.likes[id] = !state.likes[id];
    },
  },
});

export const { toggleLike } = likeSlice.actions;
export default likeSlice.reducer;
