//modelEditorMorphemesCrudSlice.ts

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MorphemeEditFormData } from "../../modelOverview/MorphemeEditFormData";

export interface IMorphemesCrudState {
  morphemesLoading: boolean;
  morphemeForEdit: MorphemeEditFormData | null;
}

const initialState: IMorphemesCrudState = {
  morphemesLoading: false,
  morphemeForEdit: null,
};

export const modelEditorMorphemesCrudSlice = createSlice({
  initialState,
  name: "modelEditorMorphemesCrudSlice",
  reducers: {
    //////////////////////////////////////
    setMorphemeForEdit: (
      state,
      action: PayloadAction<MorphemeEditFormData>
    ) => {
      state.morphemeForEdit = action.payload;
    },
    //////////////////////////////////////
  },
});

export default modelEditorMorphemesCrudSlice.reducer;

export const { setMorphemeForEdit } = modelEditorMorphemesCrudSlice.actions;
