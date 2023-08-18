//recountApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import { setAlertApiMutationError } from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";

export const recountApi = createApi({
  reducerPath: "recountApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    RecountBases: builder.mutation<void, void>({
      query(args) {
        return {
          url: `/recount/bases`,
          method: "POST",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    RecountInflectionSamples: builder.mutation<void, void>({
      query(args) {
        return {
          url: `/recount/inflectionsamples`,
          method: "POST",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    RecountFindDerivationBranchesWithoutDescendants: builder.mutation<
      void,
      void
    >({
      query(args) {
        return {
          url: `/recount/findderivationbrancheswithoutdescendants`,
          method: "POST",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
  }),
});

export const {
  useRecountBasesMutation,
  useRecountFindDerivationBranchesWithoutDescendantsMutation,
  useRecountInflectionSamplesMutation,
} = recountApi;
