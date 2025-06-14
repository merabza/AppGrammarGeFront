//inflectionCrudSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InflectionData } from "../../derivationTreeEditor/TypesAndSchemas/InflectionDataTypeAndSchema";

export interface IInflectionsCrudState {
    DeleteFailureInflection: boolean;
    inflectionForEdit: InflectionData | null;
    duplicateInflectionId: number | null;
}

const initialState: IInflectionsCrudState = {
    DeleteFailureInflection: false,
    inflectionForEdit: null,
    duplicateInflectionId: null,
};

export const inflectionCrudSlice = createSlice({
    initialState,
    name: "inflectionCrudSlice",
    reducers: {
        //////////////////////////////////////
        setInflectionForEdit: (
            state,
            action: PayloadAction<InflectionData>
        ) => {
            state.inflectionForEdit = action.payload;
        },
        //////////////////////////////////////
        setduplicateInflectionId: (
            state,
            action: PayloadAction<number | null>
        ) => {
            state.duplicateInflectionId = action.payload;
        },
        //////////////////////////////////////
        setDeleteFailureInflection: (state, action: PayloadAction<boolean>) => {
            state.DeleteFailureInflection = action.payload;
        },

        //////////////////////////////////////
    },
});

export default inflectionCrudSlice.reducer;

export const {
    setInflectionForEdit,
    setduplicateInflectionId,
    setDeleteFailureInflection,
} = inflectionCrudSlice.actions;
