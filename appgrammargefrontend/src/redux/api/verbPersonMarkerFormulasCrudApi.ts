//verbPersonMarkerFormulasCrudApi.ts

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
    CreateUpdateVerbPersonMarkerFormulaFormData,
    VerbPersonMarkerFormulaFormData,
} from "../../modelOverview/VerbPersonMarkerFormulaData";
import { setVerbPersonMarkerFormulaForEdit } from "../slices/verbPersonMarkerFormulasCrudSlice";
import type { NavigateFunction } from "react-router-dom";

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
            CreateUpdateVerbPersonMarkerFormulaFormData
        >({
            query({ verbPersonMarkerFormulaFormData }) {
                return {
                    url: `/modeleditor/verbpersonmarkerformula`,
                    method: "POST",
                    body: verbPersonMarkerFormulaFormData,
                };
            },
            async onQueryStarted(
                { verbPersonMarkerFormulaFormData, navigate },
                { dispatch, queryFulfilled }
            ) {
                try {
                    const queryResult = await queryFulfilled;
                    const { data } = queryResult;
                    dispatch(setVerbPersonMarkerFormulaForEdit(data));
                    navigate(
                        `/verbPersonMarkerFormulasOverview/df/${verbPersonMarkerFormulaFormData.verbPersonMarkerFormula.vpmprId}`
                    );
                } catch (error) {
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
                }
            },
        }),
        //////////////////////////////////////////////////////
        updateVerbPersonMarkerFormula: builder.mutation<
            void,
            CreateUpdateVerbPersonMarkerFormulaFormData
        >({
            query({ verbPersonMarkerFormulaFormData }) {
                return {
                    url: `/modeleditor/verbpersonmarkerformula/${verbPersonMarkerFormulaFormData.verbPersonMarkerFormula.vpmprId}`,
                    method: "PUT",
                    body: verbPersonMarkerFormulaFormData,
                };
            },
            async onQueryStarted(
                { verbPersonMarkerFormulaFormData, navigate },
                { dispatch, queryFulfilled }
            ) {
                try {
                    await queryFulfilled;
                    const vpmprId =
                        verbPersonMarkerFormulaFormData.verbPersonMarkerFormula
                            .vpmprId;
                    navigate(`/verbPersonMarkerFormulasOverview/df/${vpmprId}`);
                } catch (error) {
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
                }
            },
        }),
        //////////////////////////////////////////////////////
        deleteVerbPersonMarkerFormula: builder.mutation<
            void,
            { vpmprId: number; navigate: NavigateFunction }
        >({
            query({ vpmprId }) {
                return {
                    url: `/modeleditor/verbpersonmarkerformula/${vpmprId}`,
                    method: "DELETE",
                };
            },
            async onQueryStarted({ navigate }, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    navigate("/verbPersonMarkerFormulasOverview");
                } catch (error) {
                    // dispatch(setDeleteFailureVerbPersonMarker(true));
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
    useLazyGetOneVerbPersonMarkerFormulaByIdQuery,
    useCreateVerbPersonMarkerFormulaMutation,
    useUpdateVerbPersonMarkerFormulaMutation,
    useDeleteVerbPersonMarkerFormulaMutation,
} = verbPersonMarkerFormulasCrudApi;
