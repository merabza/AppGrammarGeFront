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
    databaseRecounter: builder.mutation<void, string>({
      query(recountName) {
        return {
          url: `/databaserecounter/${recountName}`,
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
    RecountBases: builder.mutation<void, void>({
      query(args) {
        return {
          url: `/databaserecounter/recountbases`,
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
          url: `/databaserecounter/recountinflectionsamples`,
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
          url: `/databaserecounter/findderivationbrancheswithoutdescendants`,
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
    DatabaseIntegrityCheck: builder.mutation<void, void>({
      query(args) {
        return {
          url: `/databaserecounter/databaseintegritycheck`,
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
    CancelCurrentProcess: builder.mutation<void, void>({
      query(args) {
        return {
          url: `/databaserecounter/cancelcurrentprocess`,
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
  useDatabaseRecounterMutation,
  useRecountBasesMutation,
  useRecountFindDerivationBranchesWithoutDescendantsMutation,
  useRecountInflectionSamplesMutation,
  useDatabaseIntegrityCheckMutation,
  useCancelCurrentProcessMutation,
} = recountApi;
