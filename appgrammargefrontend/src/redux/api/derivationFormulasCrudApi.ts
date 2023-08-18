//derivationFormulasCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import { DerivationFormulaFormData } from "../../modelOverview/DerivationFormulaFormData";
import { setDerivationFormulaForEdit } from "../slices/derivationFormulasCrudSlice";
import { redirect } from "react-router-dom";

export const derivationFormulasCrudApi = createApi({
  reducerPath: "derivationFormulasCrudApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    getOneDerivationFormulaById: builder.query<
      DerivationFormulaFormData,
      number
    >({
      query(dfId) {
        return {
          url: `/modeleditor/derivationformula/${dfId}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          // console.log(
          //   "derivationFormulasCrudApi getOneDerivationFormulaById data=",
          //   data
          // );
          dispatch(setDerivationFormulaForEdit(data));
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    ////////////////////////////////////////////////////
    createDerivationFormula: builder.mutation<
      DerivationFormulaFormData,
      DerivationFormulaFormData
    >({
      query(derivationBranchData) {
        return {
          url: `/modeleditor/derivationformula`,
          method: "POST",
          body: derivationBranchData,
        };
      },
      async onQueryStarted(derivationFormula, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setDerivationFormulaForEdit(data));
          redirect(
            `/derivationFormulasOverview/df/${derivationFormula.derivationFormula.dfId}`
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updateDerivationFormula: builder.mutation<void, DerivationFormulaFormData>({
      query(derivationFormula) {
        return {
          url: `/modeleditor/derivationformula/${derivationFormula.derivationFormula.dfId}`,
          method: "PUT",
          body: derivationFormula,
        };
      },
      async onQueryStarted(derivationFormula, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          const dfId = derivationFormula.derivationFormula.dfId;
          redirect(`/derivationFormulasOverview/df/${dfId}`);
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deleteDerivationFormula: builder.mutation<void, number>({
      query(dfId) {
        return {
          url: `/modeleditor/derivationformula/${dfId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(dfId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          redirect("/derivationFormulasOverview");
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
  useLazyGetOneDerivationFormulaByIdQuery,
  useCreateDerivationFormulaMutation,
  useUpdateDerivationFormulaMutation,
  useDeleteDerivationFormulaMutation,
} = derivationFormulasCrudApi;
