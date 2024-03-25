import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface Settings {
  excludeDeprecatedAssets: boolean;
  excludeCommunityAssets: boolean;
}

export interface DexState {
  settings: Settings;
}

const initialState: DexState = {
  settings: {
    excludeDeprecatedAssets: true,
    excludeCommunityAssets: false,
  },
};

export const dexSlice = createSlice({
  name: "dexSlice",
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
    },
    setExcludeDeprecatedAssets: (state, action: PayloadAction<boolean>) => {
      state.settings.excludeDeprecatedAssets = action.payload;
    },
    setExcludeCommunityAssets: (state, action: PayloadAction<boolean>) => {
      state.settings.excludeCommunityAssets = action.payload;
    },
  },
});

export const {
  updateSettings: update,
  setExcludeDeprecatedAssets,
  setExcludeCommunityAssets,
} = dexSlice.actions;

export const selectSettings = (state: RootState) => state.dex.settings;

export const dexReducer = dexSlice.reducer;
