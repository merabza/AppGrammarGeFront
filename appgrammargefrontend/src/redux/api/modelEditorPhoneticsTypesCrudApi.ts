//modelEditorPhoneticsTypesCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import { redirect } from "react-router-dom";
import { PhoneticsTypeEditFormData } from "../../modelOverview/PhoneticsTypeEditFormData";
import { setPhoneticsTypeForEdit } from "../slices/modelEditorPhoneticsTypesCrudSlice";

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
      PhoneticsTypeEditFormData
    >({
      query(derivationBranchData) {
        return {
          url: `/modeleditor/phoneticstype`,
          method: "POST",
          body: derivationBranchData,
        };
      },
      async onQueryStarted(PhoneticsType, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setPhoneticsTypeForEdit(data));
          redirect(
            `/phoneticsTypesOverview/mrp/${PhoneticsType.phoneticsType.phtId}`
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updatePhoneticsType: builder.mutation<void, PhoneticsTypeEditFormData>({
      query(PhoneticsType) {
        return {
          url: `/modeleditor/phoneticsType/${PhoneticsType.phoneticsType.phtId}`,
          method: "PUT",
          body: PhoneticsType,
        };
      },
      async onQueryStarted(PhoneticsType, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          const phtId = PhoneticsType.phoneticsType.phtId;
          redirect(`/phoneticsTypesOverview/mrp/${phtId}`);
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deletePhoneticsType: builder.mutation<void, number>({
      query(phtId) {
        return {
          url: `/modeleditor/phoneticstype/${phtId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(phtId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          redirect("/PhoneticsTypesOverview");
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
