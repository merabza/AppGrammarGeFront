//derivationCrudSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DerivationBranchData } from "../../derivationTreeEditor/TypesAndSchemas/DerivationBranchDataTypeAndSchema";

export interface IDerivationsCrudState {
  DeleteFailureDerivation: boolean;
  derivationBranchForEdit: DerivationBranchData | null;
  duplicateDerivationBranchId: number | null;
}

const initialState: IDerivationsCrudState = {
  DeleteFailureDerivation: false,
  derivationBranchForEdit: null,
  duplicateDerivationBranchId: null,
};

export const derivationCrudSlice = createSlice({
  initialState,
  name: "derivationCrudSlice",
  reducers: {
    //////////////////////////////////////
    setDerivationBranchForEdit: (
      state,
      action: PayloadAction<DerivationBranchData>
    ) => {
      state.derivationBranchForEdit = action.payload;
    },
    //////////////////////////////////////
    setduplicateDerivationBranchId: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.duplicateDerivationBranchId = action.payload;
    },
    //////////////////////////////////////
    setDeleteFailureDerivation: (state, action: PayloadAction<boolean>) => {
      state.DeleteFailureDerivation = action.payload;
    },

    //////////////////////////////////////
  },
});

export default derivationCrudSlice.reducer;

export const {
  setDerivationBranchForEdit,
  setduplicateDerivationBranchId,
  setDeleteFailureDerivation,
} = derivationCrudSlice.actions;
