//derivationFormulasCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import {
  DerivationFormulaFormData,
  CreateUpdateDerivationFormulaData,
} from "../../modelOverview/DerivationFormulaFormData";
import { setDerivationFormulaForEdit } from "../slices/derivationFormulasCrudSlice";
import { NavigateFunction } from "react-router-dom";
// import { redirect } from "react-router-dom";

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
      CreateUpdateDerivationFormulaData
    >({
      query({ derivationFormulaFormData }) {
        return {
          url: `/modeleditor/derivationformula`,
          method: "POST",
          body: derivationFormulaFormData,
        };
      },
      async onQueryStarted(
        { derivationFormulaFormData, navigate },
        { dispatch, queryFulfilled }
      ) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setDerivationFormulaForEdit(data));
          navigate(
            `/derivationFormulasOverview/df/${derivationFormulaFormData.derivationFormula.dfId}`
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updateDerivationFormula: builder.mutation<
      void,
      CreateUpdateDerivationFormulaData
    >({
      query({ derivationFormulaFormData }) {
        return {
          url: `/modeleditor/derivationformula/${derivationFormulaFormData.derivationFormula.dfId}`,
          method: "PUT",
          body: derivationFormulaFormData,
        };
      },
      async onQueryStarted(
        { derivationFormulaFormData, navigate },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          const dfId = derivationFormulaFormData.derivationFormula.dfId;
          navigate(`/derivationFormulasOverview/df/${dfId}`);
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deleteDerivationFormula: builder.mutation<
      void,
      { dfId: number; navigate: NavigateFunction }
    >({
      query({ dfId }) {
        return {
          url: `/modeleditor/derivationformula/${dfId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted({ navigate }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          navigate("/derivationFormulasOverview");
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
