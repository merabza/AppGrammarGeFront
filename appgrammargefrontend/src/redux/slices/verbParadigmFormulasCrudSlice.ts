//verbParadigmFormulasCrudSlice.ts

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { VerbParadigmFormulaFormData } from "../../modelOverview/VerbParadigmFormulaData";

export interface IVerbParadigmFormulasCrudState {
  derivFormulasLoading: boolean;
  verbParadigmFormulaForEdit: VerbParadigmFormulaFormData | null;
}

const initialState: IVerbParadigmFormulasCrudState = {
  derivFormulasLoading: false,
  verbParadigmFormulaForEdit: null,
};

export const verbParadigmFormulasCrudSlice = createSlice({
  initialState,
  name: "verbParadigmFormulasCrudSlice",
  reducers: {
    //////////////////////////////////////
    setVerbParadigmFormulaForEdit: (
      state,
      action: PayloadAction<VerbParadigmFormulaFormData>
    ) => {
      state.verbParadigmFormulaForEdit = action.payload;
    },
    //////////////////////////////////////
  },
});

export default verbParadigmFormulasCrudSlice.reducer;

export const { setVerbParadigmFormulaForEdit } =
  verbParadigmFormulasCrudSlice.actions;
