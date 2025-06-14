//modelEditorPhoneticsOptionsCrudApi.ts

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
    CreateUpdatePhoneticsOptionEditFormData,
    PhoneticsOptionEditFormData,
} from "../../modelOverview/PhoneticsOptionEditFormData";
import { setPhoneticsOptionForEdit } from "../slices/modelEditorPhoneticsOptionsCrudSlice";
import type { NavigateFunction } from "react-router-dom";

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
            CreateUpdatePhoneticsOptionEditFormData
        >({
            query(derivationBranchData) {
                return {
                    url: `/modeleditor/phoneticsoption`,
                    method: "POST",
                    body: derivationBranchData,
                };
            },
            async onQueryStarted(
                { phoneticsOptionEditFormData, navigate },
                { dispatch, queryFulfilled }
            ) {
                try {
                    const queryResult = await queryFulfilled;
                    const { data } = queryResult;
                    dispatch(setPhoneticsOptionForEdit(data));
                    navigate(
                        `/phoneticsTypesOverview/phoneticsoption/${phoneticsOptionEditFormData.phoneticsOption.phoId}`
                    );
                } catch (error) {
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
                }
            },
        }),
        //////////////////////////////////////////////////////
        updatePhoneticsOption: builder.mutation<
            void,
            CreateUpdatePhoneticsOptionEditFormData
        >({
            query({ phoneticsOptionEditFormData }) {
                return {
                    url: `/modeleditor/phoneticsoption/${phoneticsOptionEditFormData.phoneticsOption.phoId}`,
                    method: "PUT",
                    body: phoneticsOptionEditFormData,
                };
            },
            async onQueryStarted(
                { phoneticsOptionEditFormData, navigate },
                { dispatch, queryFulfilled }
            ) {
                try {
                    await queryFulfilled;
                    const phoId =
                        phoneticsOptionEditFormData.phoneticsOption.phoId;
                    navigate(
                        `/phoneticsTypesOverview/phoneticsoption/${phoId}`
                    );
                } catch (error) {
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
                }
            },
        }),
        //////////////////////////////////////////////////////
        deletePhoneticsOption: builder.mutation<
            void,
            { phoId: number; navigate: NavigateFunction }
        >({
            query(phoId) {
                return {
                    url: `/modeleditor/phoneticsoption/${phoId}`,
                    method: "DELETE",
                };
            },
            async onQueryStarted({ navigate }, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    navigate("/phoneticsTypesOverview");
                } catch (error) {
                    // dispatch(setDeleteFailureDerivation(true));
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
    useLazyGetOnePhoneticsOptionByIdQuery,
    useCreatePhoneticsOptionMutation,
    useUpdatePhoneticsOptionMutation,
    useDeletePhoneticsOptionMutation,
} = modelEditorPhoneticsOptionsCrudApi;
