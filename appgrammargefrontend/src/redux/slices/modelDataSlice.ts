//modelDataSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DerivationFormula,
  NounParadigmFormula,
  VerbParadigmFormula,
  VerbPersonMarkerFormula,
} from "../../masterData/mdTypes";

export interface IformulasssState {
  derivFormulasLoading: boolean;
  derivationFormulas: DerivationFormula[];
  nounParadigmFormulasLoading: boolean;
  nounParadigmFormulas: { [key: number]: NounParadigmFormula[] };

  verbParadigmFormulasLoading: boolean;
  verbParadigmFormulas: { [key: number]: VerbParadigmFormula[] };

  verbPersonMarkerFormulasLoading: boolean;
  verbPersonMarkerFormulas: { [key: number]: VerbPersonMarkerFormula[] };
}

const initialState: IformulasssState = {
  derivFormulasLoading: false,
  derivationFormulas: [] as DerivationFormula[],

  nounParadigmFormulasLoading: false,
  nounParadigmFormulas: {} as { [key: number]: NounParadigmFormula[] },

  verbParadigmFormulasLoading: false,
  verbParadigmFormulas: {} as { [key: number]: VerbParadigmFormula[] },

  verbPersonMarkerFormulasLoading: false,
  verbPersonMarkerFormulas: {} as { [key: number]: VerbPersonMarkerFormula[] },
};

export const modelDataSlice = createSlice({
  initialState,
  name: "modelDataSlice",
  reducers: {
    //////////////////////////////////////
    clearDerivFormulas: (state) => {
      state.derivationFormulas = [] as DerivationFormula[];
      state.derivFormulasLoading = false;
    },
    //////////////////////////////////////
    clearNounParadigmFormulas: (state, action: PayloadAction<number[]>) => {
      const paradigmIdsForClear = action.payload;
      paradigmIdsForClear.forEach((paradigmId) => {
        if (paradigmId in state.nounParadigmFormulas)
          state.nounParadigmFormulas[paradigmId] = [] as NounParadigmFormula[];
      });
      state.nounParadigmFormulasLoading = false;
    },
    //////////////////////////////////////
    clearVerbParadigmFormulas: (state, action: PayloadAction<number[]>) => {
      const paradigmIdsForClear = action.payload;
      paradigmIdsForClear.forEach((paradigmId) => {
        if (paradigmId in state.verbParadigmFormulas)
          state.verbParadigmFormulas[paradigmId] = [] as VerbParadigmFormula[];
      });
      state.verbParadigmFormulasLoading = false;
    },
    //////////////////////////////////////
    clearVerbPersonMarkerFormulas: (state, action: PayloadAction<number[]>) => {
      const paradigmIdsForClear = action.payload;
      paradigmIdsForClear.forEach((paradigmId) => {
        if (paradigmId in state.verbPersonMarkerFormulas)
          state.verbPersonMarkerFormulas[paradigmId] =
            [] as VerbPersonMarkerFormula[];
      });
      state.verbPersonMarkerFormulasLoading = false;
    },
    //////////////////////////////////////
    setDerivationFormulas: (
      state,
      action: PayloadAction<DerivationFormula[]>
    ) => {
      const data = action.payload;
      state.derivationFormulas = data;
    },
    //////////////////////////////////////
    setNounParadigmFormulas: (
      state,
      action: PayloadAction<{ paradigmId: number; data: NounParadigmFormula[] }>
    ) => {
      const payload = action.payload;
      state.nounParadigmFormulas[payload.paradigmId] = payload.data;
    },
    //////////////////////////////////////
    setVerbParadigmFormulas: (
      state,
      action: PayloadAction<{ paradigmId: number; data: VerbParadigmFormula[] }>
    ) => {
      const payload = action.payload;
      state.verbParadigmFormulas[payload.paradigmId] = payload.data;
    },
    //////////////////////////////////////
    setVerbPersonMarkerFormulas: (
      state,
      action: PayloadAction<{
        paradigmId: number;
        data: VerbPersonMarkerFormula[];
      }>
    ) => {
      const payload = action.payload;
      state.verbPersonMarkerFormulas[payload.paradigmId] = payload.data;
    },
    /////////////////////////////////////
  },
});

export default modelDataSlice.reducer;

export const {
  setDerivationFormulas,
  clearDerivFormulas,
  setNounParadigmFormulas,
  clearNounParadigmFormulas,
  setVerbParadigmFormulas,
  clearVerbParadigmFormulas,
  setVerbPersonMarkerFormulas,
  clearVerbPersonMarkerFormulas,
} = modelDataSlice.actions;
