//derivationFormulasCrudSlice.ts

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DerivationFormulaFormData } from "../../modelOverview/DerivationFormulaFormData";

export interface IDerivationFormulasCrudState {
  derivFormulasLoading: boolean;
  derivationFormulaForEdit: DerivationFormulaFormData | null;
}

const initialState: IDerivationFormulasCrudState = {
  derivFormulasLoading: false,
  derivationFormulaForEdit: null,
};

export const derivationFormulasCrudSlice = createSlice({
  initialState,
  name: "derivationFormulasCrudSlice",
  reducers: {
    //////////////////////////////////////
    setDerivationFormulaForEdit: (
      state,
      action: PayloadAction<DerivationFormulaFormData>
    ) => {
      state.derivationFormulaForEdit = action.payload;
    },
    //////////////////////////////////////
  },
});

export default derivationFormulasCrudSlice.reducer;

export const { setDerivationFormulaForEdit } =
  derivationFormulasCrudSlice.actions;
