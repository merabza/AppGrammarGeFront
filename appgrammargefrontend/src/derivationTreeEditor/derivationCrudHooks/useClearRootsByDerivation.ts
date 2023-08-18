//useClearRootsByDerivation.ts

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../appcarcass/redux/hooks";
import { removeRootsFromRepo } from "../../redux/slices/rootsSlice";
import {
  funPredRoots,
  getBranchByIdFromStore,
} from "./derivationCommonFunctionsModule";

export type fnClearRootsByDerivation = (dbrId: number) => void;

export function useClearRootsByDerivation(): [fnClearRootsByDerivation] {
  const dispatch = useAppDispatch();

  const { rootsRepo } = useAppSelector((state) => state.rootsState);

  const clearRootsByDerivation = useCallback(
    async (dbrId: number) => {
      const branch = getBranchByIdFromStore(rootsRepo, dbrId);
      const predRootIds = funPredRoots(branch, rootsRepo);
      dispatch(removeRootsFromRepo(predRootIds));
    },
    [dispatch, rootsRepo]
  );

  return [clearRootsByDerivation];
}
