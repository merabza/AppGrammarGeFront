//modelEditorPhoneticsOptionsCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import { redirect } from "react-router-dom";
import { PhoneticsOptionEditFormData } from "../../modelOverview/PhoneticsOptionEditFormData";
import { setPhoneticsOptionForEdit } from "../slices/modelEditorPhoneticsOptionsCrudSlice";

export const modelEditorPhoneticsOptionsCrudApi = createApi({
  reducerPath: "modelEditorPhoneticsOptionsCrudApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    getOnePhoneticsOptionById: builder.query<
      PhoneticsOptionEditFormData,
      number
    >({
      query(phoId) {
        return {
          url: `/modeleditor/phoneticsoption/${phoId}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          // console.log(
          //   "modelEditorPhoneticsOptionsCrudApi getOnePhoneticsOptionById data=",
          //   data
          // );
          dispatch(setPhoneticsOptionForEdit(data));
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    ////////////////////////////////////////////////////
    createPhoneticsOption: builder.mutation<
      PhoneticsOptionEditFormData,
      PhoneticsOptionEditFormData
    >({
      query(derivationBranchData) {
        return {
          url: `/modeleditor/phoneticsoption`,
          method: "POST",
          body: derivationBranchData,
        };
      },
      async onQueryStarted(PhoneticsOption, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setPhoneticsOptionForEdit(data));
          redirect(
            `/phoneticsTypesOverview/phoneticsoption/${PhoneticsOption.phoneticsOption.phoId}`
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updatePhoneticsOption: builder.mutation<void, PhoneticsOptionEditFormData>({
      query(PhoneticsOption) {
        return {
          url: `/modeleditor/phoneticsoption/${PhoneticsOption.phoneticsOption.phoId}`,
          method: "PUT",
          body: PhoneticsOption,
        };
      },
      async onQueryStarted(PhoneticsOption, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          const phoId = PhoneticsOption.phoneticsOption.phoId;
          redirect(`/phoneticsTypesOverview/phoneticsoption/${phoId}`);
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deletePhoneticsOption: builder.mutation<void, number>({
      query(phoId) {
        return {
          url: `/modeleditor/phoneticsoption/${phoId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(phoId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          redirect("/phoneticsTypesOverview");
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
  useLazyGetOnePhoneticsOptionByIdQuery,
  useCreatePhoneticsOptionMutation,
  useUpdatePhoneticsOptionMutation,
  useDeletePhoneticsOptionMutation,
} = modelEditorPhoneticsOptionsCrudApi;
