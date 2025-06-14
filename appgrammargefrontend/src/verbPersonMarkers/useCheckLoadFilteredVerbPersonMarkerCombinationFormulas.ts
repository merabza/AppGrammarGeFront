//useCheckLoadFilteredVerbPersonMarkerCombinationFormulas.ts

import { useCallback } from "react";
import { useAppSelector } from "../appcarcass/redux/hooks";
import { useLazyGetFilteredVerbPersonMarkerCombinationFormulasQuery } from "../redux/api/filteredApi";

export function createFilteredVerbPersonMarkerCombinationFormulasUrl(
    verbPluralityTypeId?: number | null,
    verbPersonMarkerParadigmId?: number | null,
    verbTypeId?: number | null,
    verbSeriesId?: number | null
) {
    const urlStart = "/filtered/verbpersonmarkercombination";
    const query = [];
    if (verbPluralityTypeId)
        query.push(`verbPluralityTypeId=${verbPluralityTypeId}`);
    if (verbPersonMarkerParadigmId)
        query.push(`verbPersonMarkerParadigmId=${verbPersonMarkerParadigmId}`);
    if (verbTypeId) query.push(`verbTypeId=${verbTypeId}`);
    if (verbSeriesId) query.push(`verbSeriesId=${verbSeriesId}`);

    return `${urlStart}${query.length ? "?" + query.join("&") : ""}`;
}

export type fnLoadFilteredVerbPersonMarkerCombinationFormulas = (
    verbPluralityTypeId?: number | null,
    verbPersonMarkerParadigmId?: number | null,
    verbTypeId?: number | null,
    verbSeriesId?: number | null
) => void;

export function useCheckLoadFilteredVerbPersonMarkerCombinationFormulas(): [
    fnLoadFilteredVerbPersonMarkerCombinationFormulas,
    boolean
] {
    const { filters } = useAppSelector((state) => state.filteredState);

    const [
        getFilteredVerbPersonMarkerCombinationFormulas,
        { isLoading: LoadingFilteredVerbPersonMarkerCombinationFormulas },
    ] = useLazyGetFilteredVerbPersonMarkerCombinationFormulasQuery();

    const checkLoadFilteredVerbPersonMarkerCombinationFormulas = useCallback(
        async (
            verbPluralityTypeId?: number | null,
            verbPersonMarkerParadigmId?: number | null,
            verbTypeId?: number | null,
            verbSeriesId?: number | null
        ) => {
            // console.log(
            //   "useCheckLoadFilteredVerbPersonMarkerCombinationFormulas checkLoadFilteredVerbPersonMarkerCombinationFormulas started derivFormulasLoading=",
            //   derivFormulasLoading
            // );

            const filterName =
                createFilteredVerbPersonMarkerCombinationFormulasUrl(
                    verbPluralityTypeId,
                    verbPersonMarkerParadigmId,
                    verbTypeId,
                    verbSeriesId
                );

            // console.log(
            //   "useCheckLoadFilteredVerbPersonMarkerCombinationFormulas checkLoadFilteredVerbPersonMarkerCombinationFormulas derivFormulasLoading checked modelDataState.FilteredVerbPersonMarkerCombinationFormulas=",
            //   modelDataState.FilteredVerbPersonMarkerCombinationFormulas
            // );

            if (filters.includes(filterName)) return;

            // console.log(
            //   "useCheckLoadFilteredVerbPersonMarkerCombinationFormulas checkLoadFilteredVerbPersonMarkerCombinationFormulas modelDataState.FilteredVerbPersonMarkerCombinationFormulas checked"
            // );

            await getFilteredVerbPersonMarkerCombinationFormulas({
                verbPluralityTypeId,
                verbPersonMarkerParadigmId,
                verbTypeId,
                verbSeriesId,
            });

            // console.log(
            //   "useCheckLoadFilteredVerbPersonMarkerCombinationFormulas checkLoadFilteredVerbPersonMarkerCombinationFormulas finished"
            // );
        },
        [filters, LoadingFilteredVerbPersonMarkerCombinationFormulas]
    );

    return [
        checkLoadFilteredVerbPersonMarkerCombinationFormulas,
        LoadingFilteredVerbPersonMarkerCombinationFormulas,
    ];
}
