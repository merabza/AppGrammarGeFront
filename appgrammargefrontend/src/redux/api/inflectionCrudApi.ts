//inflectionCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import {
  setDeleteFailureInflection,
  setInflectionForEdit,
  setduplicateInflectionId,
} from "../slices/inflectionCrudSlice";
import { InflectionData } from "../../derivationTreeEditor/TypesAndSchemas/InflectionDataTypeAndSchema";

export interface IConfirmRejectInflectionChangeParameters {
  infId: number;
  confirm: boolean;
  withAllDescendants: boolean;
}

export const inflectionCrudApi = createApi({
  reducerPath: "inflectionCrudApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    getOneInflectionById: builder.query<InflectionData, number>({
      query(infId) {
        return {
          url: `/inflectioncrud/${infId}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setInflectionForEdit(data));
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    createInflection: builder.mutation<InflectionData, InflectionData>({
      query(inflectionData) {
        return {
          url: `/inflectioncrud`,
          method: "POST",
          body: inflectionData,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setInflectionForEdit(data));
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updateInflection: builder.mutation<number | null, InflectionData>({
      query(inflectionData) {
        return {
          url: `/inflectioncrud/${inflectionData.inflection.infId}`,
          method: "PUT",
          body: inflectionData,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setduplicateInflectionId(data));
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deleteInflection: builder.mutation<void, number>({
      query(infId) {
        return {
          url: `/inflectioncrud/${infId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(infId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(setDeleteFailureInflection(true));
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    confirmRejectInflectionChange: builder.mutation<
      void,
      IConfirmRejectInflectionChangeParameters
    >({
      query({ infId, confirm, withAllDescendants }) {
        return {
          url: `/inflectioncrud/${infId}/${confirm}/${withAllDescendants}`,
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
  useLazyGetOneInflectionByIdQuery,
  useCreateInflectionMutation,
  useUpdateInflectionMutation,
  useDeleteInflectionMutation,
  useConfirmRejectInflectionChangeMutation,
} = inflectionCrudApi;
