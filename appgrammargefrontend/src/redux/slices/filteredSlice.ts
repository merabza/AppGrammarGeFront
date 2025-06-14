//filteredSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
    ForRecountVerbPersonMarker,
    VerbPersonMarkerCombinationFormula,
} from "../types/filtersTypes";
import { createFilteredForRecountVerbPersonMarkersUrl } from "../../verbPersonMarkers/useCheckLoadFilteredForRecountVerbPersonMarkers";
import { createFilteredVerbPersonMarkerCombinationFormulasUrl } from "../../verbPersonMarkers/useCheckLoadFilteredVerbPersonMarkerCombinationFormulas";

export interface IsStForRecountVerbPersonMarkersAction {
    data: ForRecountVerbPersonMarker[];
    verbPersonMarkerCombinationId?: number | null;
    dominantActantId?: number | null;
    morphemeId?: number | null;
}

export interface IsStVerbPersonMarkerCombinationFormulasAction {
    data: VerbPersonMarkerCombinationFormula[];
    verbPluralityTypeId?: number | null;
    verbPersonMarkerParadigmId?: number | null;
    verbTypeId?: number | null;
    verbSeriesId?: number | null;
}

export interface IfilteredState {
    forRecountVerbPersonMarkers: ForRecountVerbPersonMarker[];
    verbPersonMarkerCombinationFormulas: VerbPersonMarkerCombinationFormula[];
    filters: string[];
}

const initialState: IfilteredState = {
    forRecountVerbPersonMarkers: [] as ForRecountVerbPersonMarker[],
    verbPersonMarkerCombinationFormulas:
        [] as VerbPersonMarkerCombinationFormula[],
    filters: [] as string[],
};

export const filteredSlice = createSlice({
    initialState,
    name: "filteredSlice",
    reducers: {
        /////////////////////////////////////
        setForRecountVerbPersonMarkers: (
            state,
            action: PayloadAction<IsStForRecountVerbPersonMarkersAction>
        ) => {
            const {
                data,
                verbPersonMarkerCombinationId,
                dominantActantId,
                morphemeId,
            } = action.payload;

            const filterName = createFilteredForRecountVerbPersonMarkersUrl(
                verbPersonMarkerCombinationId,
                dominantActantId,
                morphemeId
            );

            state.filters.push(filterName);
            const newForRecountVerbPersonMarkers =
                state.forRecountVerbPersonMarkers;
            data.forEach((fe) => {
                //fe.frvpmId
                const index = newForRecountVerbPersonMarkers.findIndex(
                    (fi) => fi.frvpmId === fe.frvpmId
                );
                if (index > -1) newForRecountVerbPersonMarkers.splice(index, 1);
                newForRecountVerbPersonMarkers.push(fe);
            });
            state.forRecountVerbPersonMarkers = newForRecountVerbPersonMarkers;
        },
        /////////////////////////////////////
        setVerbPersonMarkerCombinationFormulas: (
            state,
            action: PayloadAction<IsStVerbPersonMarkerCombinationFormulasAction>
        ) => {
            const {
                data,
                verbPluralityTypeId,
                verbPersonMarkerParadigmId,
                verbTypeId,
                verbSeriesId,
            } = action.payload;

            const filterName =
                createFilteredVerbPersonMarkerCombinationFormulasUrl(
                    verbPluralityTypeId,
                    verbPersonMarkerParadigmId,
                    verbTypeId,
                    verbSeriesId
                );

            state.filters.push(filterName);
            const newVerbPersonMarkerCombinationFormulas =
                state.verbPersonMarkerCombinationFormulas;
            data.forEach((fe) => {
                //fe.frvpmId
                const index = newVerbPersonMarkerCombinationFormulas.findIndex(
                    (fi) => fi.vpmcId === fe.vpmcId
                );
                if (index > -1)
                    newVerbPersonMarkerCombinationFormulas.splice(index, 1);
                newVerbPersonMarkerCombinationFormulas.push(fe);
            });
            state.verbPersonMarkerCombinationFormulas =
                newVerbPersonMarkerCombinationFormulas;
        },
        /////////////////////////////////////
    },
});

export default filteredSlice.reducer;

export const {
    setForRecountVerbPersonMarkers,
    setVerbPersonMarkerCombinationFormulas,
} = filteredSlice.actions;
