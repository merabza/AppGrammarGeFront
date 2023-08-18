//useConfirmRejectInflectionVerbComposition.ts

import { useCallback } from "react";

import { useAppSelector } from "../../appcarcass/redux/hooks";
import { useConfirmRejectInflectionVerbCompositionChangeMutation } from "../../redux/api/inflectionVerbCompositionCrudApi";
import { funAfterSaveInflectionVerbComposition } from "./inflectionVerbCompositionCommonFunctionsModule";

export type fnConfirmRejectInflectionVerbComposition = (
  ivcId: number | undefined,
  infId: number | undefined,
  dbrId: number | undefined,
  rootId: number | undefined,
  confirm: boolean,
  withAllDescendants: boolean
) => void;

export function useConfirmRejectInflectionVerbComposition(): [
  fnConfirmRejectInflectionVerbComposition,
  boolean,
  boolean,
  () => void
] {
  const { rootsRepo } = useAppSelector((state) => state.rootsState);

  const [
    ConfirmRejectInflectionVerbComposition,
    {
      isLoading: workingOnConfirmRejectInflectionVerbComposition,
      isError: confirmRejectFailure,
      reset,
    },
  ] = useConfirmRejectInflectionVerbCompositionChangeMutation();

  const confirmRejectInflectionVerbComposition = useCallback(
    async (
      ivcId: number | undefined,
      infId: number | undefined,
      dbrId: number | undefined,
      rootId: number | undefined,
      confirm: boolean,
      withAllDescendants: boolean
    ) => {
      if (ivcId) {
        ConfirmRejectInflectionVerbComposition({
          ivcId,
          confirm,
          withAllDescendants,
        });

        funAfterSaveInflectionVerbComposition(
          rootsRepo,
          rootId,
          dbrId,
          infId,
          ivcId,
          null
        );
      }
    },
    [rootsRepo]
  );

  return [
    confirmRejectInflectionVerbComposition,
    workingOnConfirmRejectInflectionVerbComposition,
    confirmRejectFailure,
    reset,
  ];
}
