//verbParadigmFormulasCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import { redirect } from "react-router-dom";
import { VerbParadigmFormulaFormData } from "../../modelOverview/VerbParadigmFormulaData";
import { setVerbParadigmFormulaForEdit } from "../slices/verbParadigmFormulasCrudSlice";

export const verbParadigmFormulasCrudApi = createApi({
  reducerPath: "verbParadigmFormulasCrudApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    getOneVerbParadigmFormulaById: builder.query<
      VerbParadigmFormulaFormData,
      number
    >({
      query(vprId) {
        return {
          url: `/modeleditor/verbParadigmformula/${vprId}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          // console.log(
          //   "verbParadigmFormulasCrudApi getOneVerbParadigmFormulaById data=",
          //   data
          // );
          dispatch(setVerbParadigmFormulaForEdit(data));
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    ////////////////////////////////////////////////////
    createVerbParadigmFormula: builder.mutation<
      VerbParadigmFormulaFormData,
      VerbParadigmFormulaFormData
    >({
      query(verbParadigmBranchData) {
        return {
          url: `/modeleditor/verbParadigmformula`,
          method: "POST",
          body: verbParadigmBranchData,
        };
      },
      async onQueryStarted(verbParadigmFormula, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setVerbParadigmFormulaForEdit(data));
          redirect(
            `/verbParadigmFormulasOverview/df/${verbParadigmFormula.verbParadigmFormula.vprId}`
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updateVerbParadigmFormula: builder.mutation<
      void,
      VerbParadigmFormulaFormData
    >({
      query(verbParadigmFormula) {
        return {
          url: `/modeleditor/verbParadigmformula/${verbParadigmFormula.verbParadigmFormula.vprId}`,
          method: "PUT",
          body: verbParadigmFormula,
        };
      },
      async onQueryStarted(verbParadigmFormula, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          const vprId = verbParadigmFormula.verbParadigmFormula.vprId;
          redirect(`/verbParadigmFormulasOverview/df/${vprId}`);
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deleteVerbParadigmFormula: builder.mutation<void, number>({
      query(vprId) {
        return {
          url: `/modeleditor/verbParadigmformula/${vprId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(vprId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          redirect("/verbParadigmFormulasOverview");
        } catch (error) {
          // dispatch(setDeleteFailureVerbParadigm(true));
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
  }),
});

export const {
  useLazyGetOneVerbParadigmFormulaByIdQuery,
  useCreateVerbParadigmFormulaMutation,
  useUpdateVerbParadigmFormulaMutation,
  useDeleteVerbParadigmFormulaMutation,
} = verbParadigmFormulasCrudApi;
