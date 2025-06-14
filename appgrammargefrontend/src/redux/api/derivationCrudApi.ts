//derivationCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
    setAlertApiLoadError,
    setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import {
    setDeleteFailureDerivation,
    setDerivationBranchForEdit,
    setduplicateDerivationBranchId,
} from "../slices/derivationCrudSlice";
import type { DerivationBranchData } from "../../derivationTreeEditor/TypesAndSchemas/DerivationBranchDataTypeAndSchema";

export interface IConfirmRejectDerivationChangeParameters {
    dbrId: number;
    confirm: boolean;
    withAllDescendants: boolean;
}

export const derivationCrudApi = createApi({
    reducerPath: "derivationCrudApi",
    baseQuery: jwtBaseQuery,
    endpoints: (builder) => ({
        //////////////////////////////////////////////////////
        getOneDerivationBranchById: builder.query<DerivationBranchData, number>(
            {
                query(dbrId) {
                    return {
                        url: `/derivationcrud/${dbrId}`,
                    };
                },
                async onQueryStarted(args, { dispatch, queryFulfilled }) {
                    try {
                        const queryResult = await queryFulfilled;
                        const { data } = queryResult;
                        dispatch(setDerivationBranchForEdit(data));
                    } catch (error) {
                        dispatch(
                            setAlertApiLoadError(buildErrorMessage(error))
                        );
                    }
                },
            }
        ),
        //////////////////////////////////////////////////////
        createDerivationBranch: builder.mutation<
            DerivationBranchData,
            DerivationBranchData
        >({
            query(derivationBranchData) {
                return {
                    url: `/derivationcrud`,
                    method: "POST",
                    body: derivationBranchData,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const queryResult = await queryFulfilled;
                    const { data } = queryResult;
                    dispatch(setDerivationBranchForEdit(data));
                } catch (error) {
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
                }
            },
        }),
        //////////////////////////////////////////////////////
        updateDerivationBranch: builder.mutation<
            number | null,
            DerivationBranchData
        >({
            query(derivationBranchData) {
                return {
                    url: `/derivationcrud/${derivationBranchData.derivationBranch.dbrId}`,
                    method: "PUT",
                    body: derivationBranchData,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const queryResult = await queryFulfilled;
                    const { data } = queryResult;
                    dispatch(setduplicateDerivationBranchId(data));
                } catch (error) {
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
                }
            },
        }),
        //////////////////////////////////////////////////////
        deleteDerivationBranch: builder.mutation<void, number>({
            query(dbrId) {
                return {
                    url: `/derivationcrud/${dbrId}`,
                    method: "DELETE",
                };
            },
            async onQueryStarted(dbrId, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(setDeleteFailureDerivation(true));
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
                }
            },
        }),
        //////////////////////////////////////////////////////
        confirmRejectDerivationBranchChange: builder.mutation<
            void,
            IConfirmRejectDerivationChangeParameters
        >({
            query({ dbrId, confirm, withAllDescendants }) {
                return {
                    url: `/derivationcrud/${dbrId}/${confirm}/${withAllDescendants}`,
                    method: "PATCH",
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
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
    useLazyGetOneDerivationBranchByIdQuery,
    useCreateDerivationBranchMutation,
    useUpdateDerivationBranchMutation,
    useDeleteDerivationBranchMutation,
    useConfirmRejectDerivationBranchChangeMutation,
} = derivationCrudApi;
