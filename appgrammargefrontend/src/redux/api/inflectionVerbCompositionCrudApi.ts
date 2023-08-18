//inflectionVerbCompositionCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import {
  setDeleteFailureInflectionVerbComposition,
  setInflectionVerbCompositionForEdit,
  setduplicateInflectionVerbCompositionId,
} from "../slices/inflectionVerbCompositionCrudSlice";
import { InflectionVerbCompositionData } from "../../derivationTreeEditor/TypesAndSchemas/InflectionVerbCompositionDataTypeAndSchema";

export interface IConfirmRejectInflectionVerbCompositionChangeParameters {
  ivcId: number;
  confirm: boolean;
  withAllDescendants: boolean;
}

export const inflectionVerbCompositionCrudApi = createApi({
  reducerPath: "inflectionVerbCompositionCrudApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    getOneInflectionVerbCompositionById: builder.query<
      InflectionVerbCompositionData,
      number
    >({
      query(ivcId) {
        return {
          url: `/inflectionverbcompositioncrud/${ivcId}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setInflectionVerbCompositionForEdit(data));
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    createInflectionVerbComposition: builder.mutation<
      InflectionVerbCompositionData,
      InflectionVerbCompositionData
    >({
      query(inflectionVerbCompositionData) {
        return {
          url: `/inflectionverbcompositioncrud`,
          method: "POST",
          body: inflectionVerbCompositionData,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setInflectionVerbCompositionForEdit(data));
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updateInflectionVerbComposition: builder.mutation<
      number | null,
      InflectionVerbCompositionData
    >({
      query(inflectionVerbCompositionData) {
        return {
          url: `/inflectionverbcompositioncrud/${inflectionVerbCompositionData.inflectionVerbComposition.ivcId}`,
          method: "PUT",
          body: inflectionVerbCompositionData,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setduplicateInflectionVerbCompositionId(data));
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deleteInflectionVerbComposition: builder.mutation<void, number>({
      query(ivcId) {
        return {
          url: `/inflectionverbcompositioncrud/${ivcId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(ivcId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(setDeleteFailureInflectionVerbComposition(true));
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    confirmRejectInflectionVerbCompositionChange: builder.mutation<
      void,
      IConfirmRejectInflectionVerbCompositionChangeParameters
    >({
      query({ ivcId, confirm, withAllDescendants }) {
        return {
          url: `/inflectionverbcompositioncrud/${ivcId}/${confirm}/${withAllDescendants}`,
          method: "PATCH",
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
  useLazyGetOneInflectionVerbCompositionByIdQuery,
  useCreateInflectionVerbCompositionMutation,
  useUpdateInflectionVerbCompositionMutation,
  useDeleteInflectionVerbCompositionMutation,
  useConfirmRejectInflectionVerbCompositionChangeMutation,
} = inflectionVerbCompositionCrudApi;
