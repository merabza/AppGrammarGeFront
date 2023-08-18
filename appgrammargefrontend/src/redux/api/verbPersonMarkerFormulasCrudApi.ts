//verbPersonMarkerFormulasCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import { redirect } from "react-router-dom";
import { VerbPersonMarkerFormulaFormData } from "../../modelOverview/VerbPersonMarkerFormulaData";
import { setVerbPersonMarkerFormulaForEdit } from "../slices/verbPersonMarkerFormulasCrudSlice";

export const verbPersonMarkerFormulasCrudApi = createApi({
  reducerPath: "verbPersonMarkerFormulasCrudApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    getOneVerbPersonMarkerFormulaById: builder.query<
      VerbPersonMarkerFormulaFormData,
      number
    >({
      query(vpmprId) {
        return {
          url: `/modeleditor/verbpersonmarkerformula/${vpmprId}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          // console.log(
          //   "verbPersonMarkerFormulasCrudApi getOneVerbPersonMarkerFormulaById data=",
          //   data
          // );
          dispatch(setVerbPersonMarkerFormulaForEdit(data));
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    ////////////////////////////////////////////////////
    createVerbPersonMarkerFormula: builder.mutation<
      VerbPersonMarkerFormulaFormData,
      VerbPersonMarkerFormulaFormData
    >({
      query(verbPersonMarkerBranchData) {
        return {
          url: `/modeleditor/verbpersonmarkerformula`,
          method: "POST",
          body: verbPersonMarkerBranchData,
        };
      },
      async onQueryStarted(
        verbPersonMarkerFormula,
        { dispatch, queryFulfilled }
      ) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setVerbPersonMarkerFormulaForEdit(data));
          redirect(
            `/verbPersonMarkerFormulasOverview/df/${verbPersonMarkerFormula.verbPersonMarkerFormula.vpmprId}`
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updateVerbPersonMarkerFormula: builder.mutation<
      void,
      VerbPersonMarkerFormulaFormData
    >({
      query(verbPersonMarkerFormula) {
        return {
          url: `/modeleditor/verbpersonmarkerformula/${verbPersonMarkerFormula.verbPersonMarkerFormula.vpmprId}`,
          method: "PUT",
          body: verbPersonMarkerFormula,
        };
      },
      async onQueryStarted(
        verbPersonMarkerFormula,
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          const vpmprId =
            verbPersonMarkerFormula.verbPersonMarkerFormula.vpmprId;
          redirect(`/verbPersonMarkerFormulasOverview/df/${vpmprId}`);
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deleteVerbPersonMarkerFormula: builder.mutation<void, number>({
      query(vpmprId) {
        return {
          url: `/modeleditor/verbpersonmarkerformula/${vpmprId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(vpmprId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          redirect("/verbPersonMarkerFormulasOverview");
        } catch (error) {
          // dispatch(setDeleteFailureVerbPersonMarker(true));
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
  }),
});

export const {
  useLazyGetOneVerbPersonMarkerFormulaByIdQuery,
  useCreateVerbPersonMarkerFormulaMutation,
  useUpdateVerbPersonMarkerFormulaMutation,
  useDeleteVerbPersonMarkerFormulaMutation,
} = verbPersonMarkerFormulasCrudApi;
