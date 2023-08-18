//filteredApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import { setAlertApiMutationError } from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import {
  ForRecountVerbPersonMarker,
  VerbPersonMarkerCombinationFormula,
} from "../types/filtersTypes";
import { createFilteredForRecountVerbPersonMarkersUrl } from "../../verbPersonMarkers/useCheckLoadFilteredForRecountVerbPersonMarkers";
import {
  setForRecountVerbPersonMarkers,
  setVerbPersonMarkerCombinationFormulas,
} from "../slices/filteredSlice";
import { createFilteredVerbPersonMarkerCombinationFormulasUrl } from "../../verbPersonMarkers/useCheckLoadFilteredVerbPersonMarkerCombinationFormulas";

export const filteredApi = createApi({
  reducerPath: "filteredApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    getFilteredForRecountVerbPersonMarkers: builder.query<
      ForRecountVerbPersonMarker[],
      {
        verbPersonMarkerCombinationId?: number | null;
        dominantActantId?: number | null;
        morphemeId?: number | null;
      }
    >({
      query({ verbPersonMarkerCombinationId, dominantActantId, morphemeId }) {
        return {
          url: createFilteredForRecountVerbPersonMarkersUrl(
            verbPersonMarkerCombinationId,
            dominantActantId,
            morphemeId
          ),
        };
      },
      async onQueryStarted(
        { verbPersonMarkerCombinationId, dominantActantId, morphemeId },
        { dispatch, queryFulfilled }
      ) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(
            setForRecountVerbPersonMarkers({
              data,
              verbPersonMarkerCombinationId,
              dominantActantId,
              morphemeId,
            })
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    getFilteredVerbPersonMarkerCombinationFormulas: builder.query<
      VerbPersonMarkerCombinationFormula[],
      {
        verbPluralityTypeId?: number | null;
        verbPersonMarkerParadigmId?: number | null;
        verbTypeId?: number | null;
        verbSeriesId?: number | null;
      }
    >({
      query({
        verbPluralityTypeId,
        verbPersonMarkerParadigmId,
        verbTypeId,
        verbSeriesId,
      }) {
        return {
          url: createFilteredVerbPersonMarkerCombinationFormulasUrl(
            verbPluralityTypeId,
            verbPersonMarkerParadigmId,
            verbTypeId,
            verbSeriesId
          ),
        };
      },
      async onQueryStarted(
        {
          verbPluralityTypeId,
          verbPersonMarkerParadigmId,
          verbTypeId,
          verbSeriesId,
        },
        { dispatch, queryFulfilled }
      ) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          // console.log(
          //   "filteredApi getFilteredVerbPersonMarkerCombinationFormulas returned data=",
          //   data
          // );
          dispatch(
            setVerbPersonMarkerCombinationFormulas({
              data,
              verbPluralityTypeId,
              verbPersonMarkerParadigmId,
              verbTypeId,
              verbSeriesId,
            })
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
  }),
});

export const {
  useLazyGetFilteredForRecountVerbPersonMarkersQuery,
  useLazyGetFilteredVerbPersonMarkerCombinationFormulasQuery,
} = filteredApi;
