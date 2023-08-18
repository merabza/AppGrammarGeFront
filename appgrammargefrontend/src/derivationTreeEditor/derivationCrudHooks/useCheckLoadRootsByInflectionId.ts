//useCheckLoadRootsByInflectionId.ts

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../appcarcass/redux/hooks";
import { useLazyGetRootByInflectionIdQuery } from "../../redux/api/rootsApi";
import { setRootLoading } from "../../redux/slices/rootsSlice";
import {
  getInflectionByIdFromStore,
  haveInflectionPredRoots,
} from "./derivationCommonFunctionsModule";

export type fnCheckLoadRootsByInflectionId = (
  dbrId: number | undefined
) => void;

export function useCheckLoadRootsByInflectionId(): [
  fnCheckLoadRootsByInflectionId
] {
  const dispatch = useAppDispatch();

  const { rootsRepo } = useAppSelector((state) => state.rootsState);

  const [getRootByInflectionId] = useLazyGetRootByInflectionIdQuery();

  const checkLoadRootsByInflectionId = useCallback(
    async (dbrId: number | undefined) => {
      if (dbrId) {
        const inflection = getInflectionByIdFromStore(rootsRepo, dbrId);
        if (!inflection || !haveInflectionPredRoots(rootsRepo, inflection)) {
          dispatch(setRootLoading(true));
          getRootByInflectionId(dbrId);
          dispatch(setRootLoading(false));
        }
      }
    },
    [dispatch, getRootByInflectionId, rootsRepo]
  );

  return [checkLoadRootsByInflectionId];
}
