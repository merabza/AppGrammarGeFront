//verbParadigmFormulasCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
    setAlertApiLoadError,
    setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
// import { redirect } from "react-router-dom";
// import { redirect } from "react-router-dom";
import type {
    CreateUpdateVerbParadigmFormulaFormData,
    VerbParadigmFormulaFormData,
} from "../../modelOverview/VerbParadigmFormulaData";
import { setVerbParadigmFormulaForEdit } from "../slices/verbParadigmFormulasCrudSlice";
import type { NavigateFunction } from "react-router-dom";

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
            CreateUpdateVerbParadigmFormulaFormData
        >({
            query({ verbParadigmFormulaFormData }) {
                return {
                    url: `/modeleditor/verbParadigmformula`,
                    method: "POST",
                    body: verbParadigmFormulaFormData,
                };
            },
            async onQueryStarted(
                { verbParadigmFormulaFormData, navigate },
                { dispatch, queryFulfilled }
            ) {
                try {
                    const queryResult = await queryFulfilled;
                    const { data } = queryResult;
                    dispatch(setVerbParadigmFormulaForEdit(data));
                    navigate(
                        `/verbParadigmFormulasOverview/df/${verbParadigmFormulaFormData.verbParadigmFormula.vprId}`
                    );
                } catch (error) {
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
                }
            },
        }),
        //////////////////////////////////////////////////////
        updateVerbParadigmFormula: builder.mutation<
            void,
            CreateUpdateVerbParadigmFormulaFormData
        >({
            query({ verbParadigmFormulaFormData }) {
                return {
                    url: `/modeleditor/verbParadigmformula/${verbParadigmFormulaFormData.verbParadigmFormula.vprId}`,
                    method: "PUT",
                    body: verbParadigmFormulaFormData,
                };
            },
            async onQueryStarted(
                { verbParadigmFormulaFormData, navigate },
                { dispatch, queryFulfilled }
            ) {
                try {
                    await queryFulfilled;
                    const vprId =
                        verbParadigmFormulaFormData.verbParadigmFormula.vprId;
                    navigate(`/verbParadigmFormulasOverview/df/${vprId}`);
                } catch (error) {
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
                }
            },
        }),
        //////////////////////////////////////////////////////
        deleteVerbParadigmFormula: builder.mutation<
            void,
            { vprId: number; navigate: NavigateFunction }
        >({
            query(vprId) {
                return {
                    url: `/modeleditor/verbParadigmformula/${vprId}`,
                    method: "DELETE",
                };
            },
            async onQueryStarted(
                { vprId, navigate },
                { dispatch, queryFulfilled }
            ) {
                try {
                    await queryFulfilled;
                    navigate("/verbParadigmFormulasOverview");
                } catch (error) {
                    // dispatch(setDeleteFailureVerbParadigm(true));
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
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
