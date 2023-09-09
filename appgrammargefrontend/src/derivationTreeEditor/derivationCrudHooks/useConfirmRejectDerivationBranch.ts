//useConfirmRejectDerivationBranch.ts

import { useCallback } from "react";

import { useAppSelector } from "../../appcarcass/redux/hooks";
import { useConfirmRejectDerivationBranchChangeMutation } from "../../redux/api/derivationCrudApi";
import { funAfterSaveBranch } from "./derivationCommonFunctionsModule";
import { useNavigate } from "react-router-dom";

export type fnConfirmRejectDerivationBranch = (
  curDbrIdVal: number | undefined,
  rootId: number | undefined,
  confirm: boolean,
  withAllDescendants: boolean
) => void;

export function useConfirmRejectDerivationBranch(): [
  fnConfirmRejectDerivationBranch,
  boolean,
  boolean,
  () => void
] {
  const { rootsRepo } = useAppSelector((state) => state.rootsState);
  const navigate = useNavigate();
  const [
    ConfirmRejectDerivationBranch,
    {
      isLoading: workingOnConfirmRejectDerivationBranch,
      isError: confirmRejectFailure,
      reset,
    },
  ] = useConfirmRejectDerivationBranchChangeMutation();

  const confirmRejectDerivation = useCallback(
    async (
      dbrId: number | undefined,
      rootId: number | undefined,
      confirm: boolean,
      withAllDescendants: boolean
    ) => {
      if (dbrId) {
        ConfirmRejectDerivationBranch({ dbrId, confirm, withAllDescendants });

        funAfterSaveBranch(dbrId, rootId, rootsRepo, null, navigate);
      }
    },
    [rootsRepo]
  );

  return [
    confirmRejectDerivation,
    workingOnConfirmRejectDerivationBranch,
    confirmRejectFailure,
    reset,
  ];
}
