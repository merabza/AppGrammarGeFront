//useConfirmRejectInflection.ts

import { useCallback } from "react";

import { useAppSelector } from "../../appcarcass/redux/hooks";
import { useConfirmRejectInflectionChangeMutation } from "../../redux/api/inflectionCrudApi";
import { funAfterSaveInflection } from "./inflectionCommonFunctionsModule";

export type fnConfirmRejectInflection = (
  infId: number | undefined,
  dbrId: number | undefined,
  rootId: number | undefined,
  confirm: boolean,
  withAllDescendants: boolean
) => void;

export function useConfirmRejectInflection(): [
  fnConfirmRejectInflection,
  boolean,
  boolean,
  () => void
] {
  const { rootsRepo } = useAppSelector((state) => state.rootsState);

  const [
    ConfirmRejectInflection,
    {
      isLoading: workingOnConfirmRejectInflection,
      isError: confirmRejectFailure,
      reset,
    },
  ] = useConfirmRejectInflectionChangeMutation();

  const confirmRejectInflection = useCallback(
    async (
      infId: number | undefined,
      dbrId: number | undefined,
      rootId: number | undefined,
      confirm: boolean,
      withAllDescendants: boolean
    ) => {
      if (infId) {
        ConfirmRejectInflection({ infId, confirm, withAllDescendants });

        funAfterSaveInflection(rootsRepo, rootId, dbrId, infId, null);
      }
    },
    [rootsRepo]
  );

  return [
    confirmRejectInflection,
    workingOnConfirmRejectInflection,
    confirmRejectFailure,
    reset,
  ];
}
