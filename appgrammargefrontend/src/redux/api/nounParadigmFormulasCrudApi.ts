//nounParadigmFormulasCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import { redirect } from "react-router-dom";
import { NounParadigmFormulaFormData } from "../../modelOverview/NounParadigmFormulaData";
import { setNounParadigmFormulaForEdit } from "../slices/nounParadigmFormulasCrudSlice";

export const nounParadigmFormulasCrudApi = createApi({
  reducerPath: "nounParadigmFormulasCrudApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    getOneNounParadigmFormulaById: builder.query<
      NounParadigmFormulaFormData,
      number
    >({
      query(nprId) {
        return {
          url: `/modeleditor/nounParadigmformula/${nprId}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          // console.log(
          //   "nounParadigmFormulasCrudApi getOneNounParadigmFormulaById data=",
          //   data
          // );
          dispatch(setNounParadigmFormulaForEdit(data));
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    ////////////////////////////////////////////////////
    createNounParadigmFormula: builder.mutation<
      NounParadigmFormulaFormData,
      NounParadigmFormulaFormData
    >({
      query(nounParadigmBranchData) {
        return {
          url: `/modeleditor/nounParadigmformula`,
          method: "POST",
          body: nounParadigmBranchData,
        };
      },
      async onQueryStarted(nounParadigmFormula, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setNounParadigmFormulaForEdit(data));
          redirect(
            `/nounParadigmFormulasOverview/df/${nounParadigmFormula.nounParadigmFormula.nprId}`
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updateNounParadigmFormula: builder.mutation<
      void,
      NounParadigmFormulaFormData
    >({
      query(nounParadigmFormula) {
        return {
          url: `/modeleditor/nounParadigmformula/${nounParadigmFormula.nounParadigmFormula.nprId}`,
          method: "PUT",
          body: nounParadigmFormula,
        };
      },
      async onQueryStarted(nounParadigmFormula, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          const nprId = nounParadigmFormula.nounParadigmFormula.nprId;
          redirect(`/nounParadigmFormulasOverview/df/${nprId}`);
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deleteNounParadigmFormula: builder.mutation<void, number>({
      query(nprId) {
        return {
          url: `/modeleditor/nounParadigmformula/${nprId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(nprId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          redirect("/nounParadigmFormulasOverview");
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
  }),
});

export const {
  useLazyGetOneNounParadigmFormulaByIdQuery,
  useCreateNounParadigmFormulaMutation,
  useUpdateNounParadigmFormulaMutation,
  useDeleteNounParadigmFormulaMutation,
} = nounParadigmFormulasCrudApi;
