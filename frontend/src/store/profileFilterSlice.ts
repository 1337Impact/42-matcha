import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ProfileFilter {
  distance: number;
  sexual_preferences: string;
  interests: string[];
}

export const profileFilter = createSlice({
  name: "profileFilter",
  initialState: {
    distance: 10,
    sexual_preferences: "",
    interests: [],
  } as ProfileFilter,
  reducers: {
    setDistance: (state, action: PayloadAction<number>) => {
      state.distance = action.payload;
    },
    setSexualPreferences: (state, action: PayloadAction<string>) => {
      state.sexual_preferences = action.payload;
    },
    setInterests: (state, action: PayloadAction<string[]>) => {
      state.interests = action.payload as string[];
    },
  },
});

export const { setDistance, setSexualPreferences, setInterests } = profileFilter.actions;

export default profileFilter.reducer;