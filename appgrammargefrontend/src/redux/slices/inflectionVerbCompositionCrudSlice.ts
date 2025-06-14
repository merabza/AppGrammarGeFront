//inflectionVerbCompositionCrudSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InflectionVerbCompositionData } from "../../derivationTreeEditor/TypesAndSchemas/InflectionVerbCompositionDataTypeAndSchema";

export interface IInflectionVerbCompositionsCrudState {
    DeleteFailureInflectionVerbComposition: boolean;
    inflectionVerbCompositionForEdit: InflectionVerbCompositionData | null;
    duplicateInflectionVerbCompositionId: number | null;
}

const initialState: IInflectionVerbCompositionsCrudState = {
    DeleteFailureInflectionVerbComposition: false,
    inflectionVerbCompositionForEdit: null,
    duplicateInflectionVerbCompositionId: null,
};

export const inflectionVerbCompositionCrudSlice = createSlice({
    initialState,
    name: "inflectionVerbCompositionCrudSlice",
    reducers: {
        //////////////////////////////////////
        setInflectionVerbCompositionForEdit: (
            state,
            action: PayloadAction<InflectionVerbCompositionData>
        ) => {
            state.inflectionVerbCompositionForEdit = action.payload;
        },
        //////////////////////////////////////
        setduplicateInflectionVerbCompositionId: (
            state,
            action: PayloadAction<number | null>
        ) => {
            state.duplicateInflectionVerbCompositionId = action.payload;
        },
        //////////////////////////////////////
        setDeleteFailureInflectionVerbComposition: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.DeleteFailureInflectionVerbComposition = action.payload;
        },

        //////////////////////////////////////
    },
});

export default inflectionVerbCompositionCrudSlice.reducer;

export const {
    setInflectionVerbCompositionForEdit,
    setduplicateInflectionVerbCompositionId,
    setDeleteFailureInflectionVerbComposition,
} = inflectionVerbCompositionCrudSlice.actions;
