//modelEditorPhoneticsTypesCrudSlice.ts

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PhoneticsTypeEditFormData } from "../../modelOverview/PhoneticsTypeEditFormData";

export interface IPhoneticsTypesCrudState {
  phoneticsTypesLoading: boolean;
  phoneticsTypeForEdit: PhoneticsTypeEditFormData | null;
}

const initialState: IPhoneticsTypesCrudState = {
  phoneticsTypesLoading: false,
  phoneticsTypeForEdit: null,
};

export const modelEditorPhoneticsTypesCrudSlice = createSlice({
  initialState,
  name: "modelEditorPhoneticsTypesCrudSlice",
  reducers: {
    //////////////////////////////////////
    setPhoneticsTypeForEdit: (
      state,
      action: PayloadAction<PhoneticsTypeEditFormData>
    ) => {
      state.phoneticsTypeForEdit = action.payload;
    },
    //////////////////////////////////////
  },
});

export default modelEditorPhoneticsTypesCrudSlice.reducer;

export const { setPhoneticsTypeForEdit } =
  modelEditorPhoneticsTypesCrudSlice.actions;
