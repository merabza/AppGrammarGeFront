//nounParadigmFormulasCrudSlice.ts

import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { NounParadigmFormulaFormData } from "../../modelOverview/NounParadigmFormulaData";

export interface INounParadigmFormulasCrudState {
    derivFormulasLoading: boolean;
    nounParadigmFormulaForEdit: NounParadigmFormulaFormData | null;
}

const initialState: INounParadigmFormulasCrudState = {
    derivFormulasLoading: false,
    nounParadigmFormulaForEdit: null,
};

export const nounParadigmFormulasCrudSlice = createSlice({
    initialState,
    name: "nounParadigmFormulasCrudSlice",
    reducers: {
        //////////////////////////////////////
        setNounParadigmFormulaForEdit: (
            state,
            action: PayloadAction<NounParadigmFormulaFormData>
        ) => {
            state.nounParadigmFormulaForEdit = action.payload;
        },
        //////////////////////////////////////
    },
});

export default nounParadigmFormulasCrudSlice.reducer;

export const { setNounParadigmFormulaForEdit } =
    nounParadigmFormulasCrudSlice.actions;
