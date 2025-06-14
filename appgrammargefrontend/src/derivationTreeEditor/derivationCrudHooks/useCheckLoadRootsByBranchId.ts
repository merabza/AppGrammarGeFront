//useCheckLoadRootsByBranchId.ts

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../appcarcass/redux/hooks";
import { useLazyGetRootByDerivBranchIdQuery } from "../../redux/api/rootsApi";
import { setRootLoading } from "../../redux/slices/rootsSlice";
import {
    getBranchByIdFromStore,
    havePredRoots,
} from "./derivationCommonFunctionsModule";

export type fnCheckLoadRootsByBranchId = (dbrId: number | undefined) => void;

export function useCheckLoadRootsByBranchId(): [fnCheckLoadRootsByBranchId] {
    const dispatch = useAppDispatch();

    const { rootsRepo } = useAppSelector((state) => state.rootsState);

    const [getRootByDerivBranchId] = useLazyGetRootByDerivBranchIdQuery();

    const checkLoadRootsByBranchId = useCallback(
        async (dbrId: number | undefined) => {
            if (dbrId) {
                const branch = getBranchByIdFromStore(rootsRepo, dbrId);
                if (!branch || !havePredRoots(rootsRepo, branch)) {
                    dispatch(setRootLoading(true));
                    getRootByDerivBranchId(dbrId);
                    dispatch(setRootLoading(false));
                }
            }
        },
        [dispatch, getRootByDerivBranchId, rootsRepo]
    );

    return [checkLoadRootsByBranchId];
}
