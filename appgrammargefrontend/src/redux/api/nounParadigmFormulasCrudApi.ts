//nounParadigmFormulasCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
// import { redirect } from "react-router-dom";
import {
  CreateUpdateNounParadigmFormulaFormData,
  NounParadigmFormulaFormData,
} from "../../modelOverview/NounParadigmFormulaData";
import { setNounParadigmFormulaForEdit } from "../slices/nounParadigmFormulasCrudSlice";
import { NavigateFunction } from "react-router-dom";

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
      CreateUpdateNounParadigmFormulaFormData
    >({
      query({ nounParadigmFormulaFormData }) {
        return {
          url: `/modeleditor/nounParadigmformula`,
          method: "POST",
          body: nounParadigmFormulaFormData,
        };
      },
      async onQueryStarted(
        { nounParadigmFormulaFormData, navigate },
        { dispatch, queryFulfilled }
      ) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setNounParadigmFormulaForEdit(data));
          navigate(
            `/nounParadigmsOverview/df/${nounParadigmFormulaFormData.nounParadigmFormula.nprId}`
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updateNounParadigmFormula: builder.mutation<
      void,
      CreateUpdateNounParadigmFormulaFormData
    >({
      query({ nounParadigmFormulaFormData }) {
        return {
          url: `/modeleditor/nounParadigmformula/${nounParadigmFormulaFormData.nounParadigmFormula.nprId}`,
          method: "PUT",
          body: nounParadigmFormulaFormData,
        };
      },
      async onQueryStarted(
        { nounParadigmFormulaFormData, navigate },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          const nprId = nounParadigmFormulaFormData.nounParadigmFormula.nprId;
          navigate(`/nounParadigmsOverview/df/${nprId}`);
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deleteNounParadigmFormula: builder.mutation<
      void,
      { nprId: number; navigate: NavigateFunction }
    >({
      query({ nprId }) {
        console.log("deleteNounParadigmFormula query nprId=", nprId);
        return {
          url: `/modeleditor/nounParadigmformula/${nprId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted({ navigate }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          navigate("/nounParadigmsOverview");
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
