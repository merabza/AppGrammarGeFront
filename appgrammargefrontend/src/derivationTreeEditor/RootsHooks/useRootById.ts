//useRootById.ts

import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../appcarcass/redux/hooks";
import { useLazyGetFullRootByIdQuery } from "../../redux/api/rootsApi";
import {
    setRootById,
    type setRootByIdPayloadType,
    setRootLoading,
} from "../../redux/slices/rootsSlice";
import type { RootFullModel } from "../../redux/types/rootsTypes";

export type fnLoadRootById = (rootId: number) => void;

export function useRootById(): [fnLoadRootById, boolean] {
    const dispatch = useAppDispatch();
    const { rootsRepo } = useAppSelector((state) => state.rootsState);
    const [getRootById, { isLoading: loadingRoot }] =
        useLazyGetFullRootByIdQuery();

    const LoadRootById = useCallback(
        async (rootId: number) => {
            if (rootId in rootsRepo && rootsRepo[rootId]) return;
            dispatch(setRootLoading(true));

            const result = await getRootById(rootId);
            const data = result.data as RootFullModel;

            const payload = { rootId, data } as setRootByIdPayloadType;

            dispatch(setRootById(payload));

            dispatch(setRootLoading(false));
        },
        [dispatch, getRootById, rootsRepo]
    );

    return [LoadRootById, loadingRoot];
}
