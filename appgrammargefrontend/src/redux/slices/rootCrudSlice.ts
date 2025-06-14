//rootCrudSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootData } from "../../derivationTreeEditor/TypesAndSchemas/RootDataTypeAndSchema";

export interface IRootCrudState {
    DeleteFailureRoot: boolean;
    rootForEdit: RootData | null;
}

const initialState: IRootCrudState = {
    rootForEdit: null,
    DeleteFailureRoot: false,
};

export const rootCrudSlice = createSlice({
    initialState,
    name: "rootCrudSlice",
    reducers: {
        //////////////////////////////////////
        setRootForEdit: (state, action: PayloadAction<RootData>) => {
            state.rootForEdit = action.payload;
        },
        //////////////////////////////////////
        setDeleteFailureRoot: (state, action: PayloadAction<boolean>) => {
            state.DeleteFailureRoot = action.payload;
        },

        //////////////////////////////////////
    },
});

export default rootCrudSlice.reducer;

export const { setRootForEdit, setDeleteFailureRoot } = rootCrudSlice.actions;
