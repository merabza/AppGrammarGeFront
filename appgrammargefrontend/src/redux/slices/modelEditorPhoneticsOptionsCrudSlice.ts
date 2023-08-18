//modelEditorPhoneticsOptionsCrudSlice.ts

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PhoneticsOptionEditFormData } from "../../modelOverview/PhoneticsOptionEditFormData";

export interface IPhoneticsOptionsCrudState {
  phoneticsOptionsLoading: boolean;
  phoneticsOptionForEdit: PhoneticsOptionEditFormData | null;
}

const initialState: IPhoneticsOptionsCrudState = {
  phoneticsOptionsLoading: false,
  phoneticsOptionForEdit: null,
};

export const modelEditorPhoneticsOptionsCrudSlice = createSlice({
  initialState,
  name: "modelEditorPhoneticsOptionsCrudSlice",
  reducers: {
    //////////////////////////////////////
    setPhoneticsOptionForEdit: (
      state,
      action: PayloadAction<PhoneticsOptionEditFormData>
    ) => {
      state.phoneticsOptionForEdit = action.payload;
    },
    //////////////////////////////////////
  },
});

export default modelEditorPhoneticsOptionsCrudSlice.reducer;

export const { setPhoneticsOptionForEdit } =
  modelEditorPhoneticsOptionsCrudSlice.actions;
