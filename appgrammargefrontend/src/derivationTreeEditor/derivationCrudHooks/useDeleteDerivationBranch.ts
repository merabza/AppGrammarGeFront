//useDeleteDerivationBranch.ts

import { useCallback } from "react";

import { useAppSelector } from "../../appcarcass/redux/hooks";
import { useDeleteDerivationBranchMutation } from "../../redux/api/derivationCrudApi";
import { funAfterSaveBranch } from "./derivationCommonFunctionsModule";

export type fnDeleteDerivationBranch = (
  dbrId: number | undefined,
  rootId: number | undefined
) => void;

export function useDeleteDerivationBranch(): [
  fnDeleteDerivationBranch,
  boolean,
  boolean
] {
  const { rootsRepo } = useAppSelector((state) => state.rootsState);

  const [
    DeleteDerivationBranch,
    { isLoading: workingOnDeleteDerivationBranch, isError: DeleteFailure },
  ] = useDeleteDerivationBranchMutation();

  const deleteDerivation = useCallback(
    async (dbrId: number | undefined, rootId: number | undefined) => {
      if (dbrId) {
        DeleteDerivationBranch(dbrId);

        funAfterSaveBranch(dbrId, rootId, rootsRepo, null);
      }
    },
    [rootsRepo, DeleteDerivationBranch]
  );

  return [deleteDerivation, workingOnDeleteDerivationBranch, DeleteFailure];
}
