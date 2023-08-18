//verbPersonMarkerFormulasCrudSlice.ts

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { VerbPersonMarkerFormulaFormData } from "../../modelOverview/VerbPersonMarkerFormulaData";

export interface IVerbPersonMarkerFormulasCrudState {
  derivFormulasLoading: boolean;
  verbPersonMarkerFormulaForEdit: VerbPersonMarkerFormulaFormData | null;
}

const initialState: IVerbPersonMarkerFormulasCrudState = {
  derivFormulasLoading: false,
  verbPersonMarkerFormulaForEdit: null,
};

export const verbPersonMarkerFormulasCrudSlice = createSlice({
  initialState,
  name: "verbPersonMarkerFormulasCrudSlice",
  reducers: {
    //////////////////////////////////////
    setVerbPersonMarkerFormulaForEdit: (
      state,
      action: PayloadAction<VerbPersonMarkerFormulaFormData>
    ) => {
      state.verbPersonMarkerFormulaForEdit = action.payload;
    },
    //////////////////////////////////////
  },
});

export default verbPersonMarkerFormulasCrudSlice.reducer;

export const { setVerbPersonMarkerFormulaForEdit } =
  verbPersonMarkerFormulasCrudSlice.actions;
