//useCheckLoadRootsByInflectionVerbCompositionId.ts

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../appcarcass/redux/hooks";
import { useLazyGetRootByInflectionVerbCompositionIdQuery } from "../../redux/api/rootsApi";
import { setRootLoading } from "../../redux/slices/rootsSlice";
import {
  getInflectionVerbCompositionByIdFromStore,
  haveInflectionVerbCompositionPredRoots,
} from "./derivationCommonFunctionsModule";

export type fnCheckLoadRootsByInflectionVerbCompositionId = (
  dbrId: number | undefined
) => void;

export function useCheckLoadRootsByInflectionVerbCompositionId(): [
  fnCheckLoadRootsByInflectionVerbCompositionId
] {
  const dispatch = useAppDispatch();

  const { rootsRepo } = useAppSelector((state) => state.rootsState);

  const [getRootByInflectionVerbCompositionId] =
    useLazyGetRootByInflectionVerbCompositionIdQuery();

  const checkLoadRootsByInflectionVerbCompositionId = useCallback(
    async (dbrId: number | undefined) => {
      if (dbrId) {
        const inflectionVerbComposition =
          getInflectionVerbCompositionByIdFromStore(rootsRepo, dbrId);
        if (
          !inflectionVerbComposition ||
          !haveInflectionVerbCompositionPredRoots(
            rootsRepo,
            inflectionVerbComposition
          )
        ) {
          dispatch(setRootLoading(true));
          getRootByInflectionVerbCompositionId(dbrId);
          dispatch(setRootLoading(false));
        }
      }
    },
    [dispatch, getRootByInflectionVerbCompositionId, rootsRepo]
  );

  return [checkLoadRootsByInflectionVerbCompositionId];
}
