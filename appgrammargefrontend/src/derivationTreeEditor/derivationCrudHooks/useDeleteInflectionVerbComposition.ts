//useDeleteInflectionVerbComposition.ts

import { useCallback } from "react";

import { useAppSelector } from "../../appcarcass/redux/hooks";
import { useDeleteInflectionVerbCompositionMutation } from "../../redux/api/inflectionVerbCompositionCrudApi";
import { funAfterSaveInflectionVerbComposition } from "./inflectionVerbCompositionCommonFunctionsModule";
import { useNavigate } from "react-router-dom";

export type fnDeleteInflectionVerbComposition = (
  ivcId: number | undefined,
  infId: number | undefined,
  dbrId: number | undefined,
  rootId: number | undefined
) => void;

export function useDeleteInflectionVerbComposition(): [
  fnDeleteInflectionVerbComposition,
  boolean,
  boolean
] {
  const { rootsRepo } = useAppSelector((state) => state.rootsState);
  const navigate = useNavigate();
  const [
    DeleteInflectionVerbComposition,
    {
      isLoading: workingOnDeleteInflectionVerbComposition,
      isError: DeleteFailure,
    },
  ] = useDeleteInflectionVerbCompositionMutation();

  const deleteInflectionVerbComposition = useCallback(
    async (
      ivcId: number | undefined,
      infId: number | undefined,
      dbrId: number | undefined,
      rootId: number | undefined
    ) => {
      if (infId) {
        DeleteInflectionVerbComposition(infId);

        funAfterSaveInflectionVerbComposition(
          rootsRepo,
          rootId,
          dbrId,
          infId,
          ivcId,
          null,
          navigate
        );
      }
    },
    [rootsRepo]
  );

  return [
    deleteInflectionVerbComposition,
    workingOnDeleteInflectionVerbComposition,
    DeleteFailure,
  ];
}
