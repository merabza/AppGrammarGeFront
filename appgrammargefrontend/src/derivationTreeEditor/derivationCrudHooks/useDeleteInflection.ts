//useDeleteInflection.ts

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../appcarcass/redux/hooks";
import { useDeleteInflectionMutation } from "../../redux/api/inflectionCrudApi";
import { funAfterSaveInflection } from "./inflectionCommonFunctionsModule";

export type fnDeleteInflection = (
  infId: number | undefined,
  dbrId: number | undefined,
  rootId: number | undefined
) => void;

export function useDeleteInflection(): [fnDeleteInflection, boolean, boolean] {
  const { rootsRepo } = useAppSelector((state) => state.rootsState);
  const navigate = useNavigate();
  const [
    DeleteInflection,
    { isLoading: workingOnDeleteInflection, isError: DeleteFailure },
  ] = useDeleteInflectionMutation();

  const deleteInflection = useCallback(
    async (
      infId: number | undefined,
      dbrId: number | undefined,
      rootId: number | undefined
    ) => {
      if (infId) {
        DeleteInflection(infId);

        funAfterSaveInflection(rootsRepo, rootId, dbrId, infId, null, navigate);
      }
    },
    [rootsRepo]
  );

  return [deleteInflection, workingOnDeleteInflection, DeleteFailure];
}
