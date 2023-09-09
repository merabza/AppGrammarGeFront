//modelEditorPhoneticsTypesCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
// import { redirect } from "react-router-dom";
import {
  CreateUpdatePhoneticsTypeEditFormData,
  PhoneticsTypeEditFormData,
} from "../../modelOverview/PhoneticsTypeEditFormData";
import { setPhoneticsTypeForEdit } from "../slices/modelEditorPhoneticsTypesCrudSlice";
import { NavigateFunction } from "react-router-dom";

export const modelEditorPhoneticsTypesCrudApi = createApi({
  reducerPath: "modelEditorPhoneticsTypesCrudApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    getOnePhoneticsTypeById: builder.query<PhoneticsTypeEditFormData, number>({
      query(phtId) {
        return {
          url: `/modeleditor/phoneticstype/${phtId}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          // console.log(
          //   "modelEditorPhoneticsTypesCrudApi getOnePhoneticsTypeById data=",
          //   data
          // );
          dispatch(setPhoneticsTypeForEdit(data));
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    ////////////////////////////////////////////////////
    createPhoneticsType: builder.mutation<
      PhoneticsTypeEditFormData,
      CreateUpdatePhoneticsTypeEditFormData
    >({
      query({ phoneticsTypeEditFormData }) {
        return {
          url: `/modeleditor/phoneticstype`,
          method: "POST",
          body: phoneticsTypeEditFormData,
        };
      },
      async onQueryStarted(
        { phoneticsTypeEditFormData, navigate },
        { dispatch, queryFulfilled }
      ) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setPhoneticsTypeForEdit(data));
          navigate(
            `/phoneticsTypesOverview/mrp/${phoneticsTypeEditFormData.phoneticsType.phtId}`
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updatePhoneticsType: builder.mutation<
      void,
      CreateUpdatePhoneticsTypeEditFormData
    >({
      query({ phoneticsTypeEditFormData }) {
        return {
          url: `/modeleditor/phoneticsType/${phoneticsTypeEditFormData.phoneticsType.phtId}`,
          method: "PUT",
          body: phoneticsTypeEditFormData,
        };
      },
      async onQueryStarted(
        { phoneticsTypeEditFormData, navigate },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          const phtId = phoneticsTypeEditFormData.phoneticsType.phtId;
          navigate(`/phoneticsTypesOverview/mrp/${phtId}`);
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deletePhoneticsType: builder.mutation<
      void,
      { phtId: number; navigate: NavigateFunction }
    >({
      query({ phtId }) {
        return {
          url: `/modeleditor/phoneticstype/${phtId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted({ navigate }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          navigate("/PhoneticsTypesOverview");
        } catch (error) {
          // dispatch(setDeleteFailureDerivation(true));
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
  }),
});

export const {
  useLazyGetOnePhoneticsTypeByIdQuery,
  useCreatePhoneticsTypeMutation,
  useUpdatePhoneticsTypeMutation,
  useDeletePhoneticsTypeMutation,
} = modelEditorPhoneticsTypesCrudApi;
