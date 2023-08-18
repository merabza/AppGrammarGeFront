//useCheckLoadFilteredForRecountVerbPersonMarkers.ts

import { useCallback } from "react";
import { useAppSelector } from "../appcarcass/redux/hooks";
import { useLazyGetFilteredForRecountVerbPersonMarkersQuery } from "../redux/api/filteredApi";

export function createFilteredForRecountVerbPersonMarkersUrl(
  verbPersonMarkerCombinationId?: number | null,
  dominantActantId?: number | null,
  morphemeId?: number | null
) {
  const urlStart = "/filtered/forRecountVerbPersonMarkers";
  const query = [];
  if (verbPersonMarkerCombinationId)
    query.push(
      `verbPersonMarkerCombinationId=${verbPersonMarkerCombinationId}`
    );
  if (dominantActantId) query.push(`dominantActantId=${dominantActantId}`);
  if (morphemeId) query.push(`morphemeId=${morphemeId}`);

  return `${urlStart}${query.length ? "?" + query.join("&") : ""}`;
}

export type fnLoadFilteredForRecountVerbPersonMarkers = (
  verbPersonMarkerCombinationId?: number | null,
  dominantActantId?: number | null,
  morphemeId?: number | null
) => void;

export function useCheckLoadFilteredForRecountVerbPersonMarkers(): [
  fnLoadFilteredForRecountVerbPersonMarkers,
  boolean
] {
  const { filters } = useAppSelector((state) => state.filteredState);

  const [
    getFilteredForRecountVerbPersonMarkers,
    { isLoading: LoadingFilteredForRecountVerbPersonMarkers },
  ] = useLazyGetFilteredForRecountVerbPersonMarkersQuery();

  const checkLoadFilteredForRecountVerbPersonMarkers = useCallback(
    async (
      verbPersonMarkerCombinationId?: number | null,
      dominantActantId?: number | null,
      morphemeId?: number | null
    ) => {
      // console.log(
      //   "useCheckLoadFilteredForRecountVerbPersonMarkers checkLoadFilteredForRecountVerbPersonMarkers started derivFormulasLoading=",
      //   derivFormulasLoading
      // );

      const filterName = createFilteredForRecountVerbPersonMarkersUrl(
        verbPersonMarkerCombinationId,
        dominantActantId,
        morphemeId
      );

      // console.log(
      //   "useCheckLoadFilteredForRecountVerbPersonMarkers checkLoadFilteredForRecountVerbPersonMarkers derivFormulasLoading checked modelDataState.FilteredForRecountVerbPersonMarkers=",
      //   modelDataState.FilteredForRecountVerbPersonMarkers
      // );

      if (filters.includes(filterName)) return;

      // console.log(
      //   "useCheckLoadFilteredForRecountVerbPersonMarkers checkLoadFilteredForRecountVerbPersonMarkers modelDataState.FilteredForRecountVerbPersonMarkers checked"
      // );

      await getFilteredForRecountVerbPersonMarkers({
        verbPersonMarkerCombinationId,
        dominantActantId,
        morphemeId,
      });

      // console.log(
      //   "useCheckLoadFilteredForRecountVerbPersonMarkers checkLoadFilteredForRecountVerbPersonMarkers finished"
      // );
    },
    [filters, LoadingFilteredForRecountVerbPersonMarkers]
  );

  return [
    checkLoadFilteredForRecountVerbPersonMarkers,
    LoadingFilteredForRecountVerbPersonMarkers,
  ];
}
