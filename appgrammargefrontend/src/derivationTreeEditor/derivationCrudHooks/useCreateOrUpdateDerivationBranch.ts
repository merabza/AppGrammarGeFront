//useCreateOrUpdateDerivationBranch.ts

import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../appcarcass/redux/hooks";
import {
  useCreateDerivationBranchMutation,
  useUpdateDerivationBranchMutation,
} from "../../redux/api/derivationCrudApi";
import { useLazyGetRootByDerivBranchIdQuery } from "../../redux/api/rootsApi";
import { setduplicateDerivationBranchId } from "../../redux/slices/derivationCrudSlice";
import { DerivationBranchData } from "../TypesAndSchemas/DerivationBranchDataTypeAndSchema";
import { funAfterSaveBranch } from "./derivationCommonFunctionsModule";

export type fnCreateOrUpdateDerivationBranch = (
  curDbrIdVal: number | undefined,
  rootId: number | undefined,
  DerivationBranch: DerivationBranchData
) => void;

export function useCreateOrUpdateDerivationBranch(): [
  fnCreateOrUpdateDerivationBranch,
  boolean
] {
  const dispatch = useAppDispatch();
  const { rootsRepo } = useAppSelector((state) => state.rootsState);

  const [createDerivationBranch, { isLoading: creatingDerivationBranch }] =
    useCreateDerivationBranchMutation();
  const [updateDerivationBranch, { isLoading: updatingDerivationBranch }] =
    useUpdateDerivationBranchMutation();
  const { derivationBranchForEdit, duplicateDerivationBranchId } =
    useAppSelector((state) => state.derivationCrudState);

  const [getRootByDerivBranchId] = useLazyGetRootByDerivBranchIdQuery();

  const createOrUpdateDerivationBranch = useCallback(
    async (
      curDbrIdVal: number | undefined,
      rootId: number | undefined,
      DerivationBranch: DerivationBranchData
    ) => {
      let dbrId: number | undefined;
      dispatch(setduplicateDerivationBranchId(null));
      if (curDbrIdVal) {
        updateDerivationBranch(DerivationBranch);
        dbrId = DerivationBranch.derivationBranch.dbrId;
      } else {
        createDerivationBranch(DerivationBranch);
        dbrId = derivationBranchForEdit?.derivationBranch.dbrId;
      }

      //თავიდან ჩაიტვირთოს დერივაციის იდენტიფიკატორის მიხედვით ყველა საჭირო ძირი
      if (dbrId) await getRootByDerivBranchId(dbrId).unwrap();

      funAfterSaveBranch(dbrId, rootId, rootsRepo, duplicateDerivationBranchId);

      // if (rootId in rootsRepo && rootsRepo[rootId]) return;
      // dispatch(setRootLoading(true));

      // const result = await getRootById(rootId);
      // const data = result.data as RootFullModel;

      // const payload = { rootId, data } as setRootByIdPayloadType;

      // dispatch(setRootById(payload));

      // dispatch(setRootLoading(false));
    },
    [
      // dispatch,
      rootsRepo,
      // createDerivationBranch,
      derivationBranchForEdit?.derivationBranch.dbrId,
      duplicateDerivationBranchId,
      // getRootByDerivBranchId,
      // updateDerivationBranch,
    ]
  );

  return [
    createOrUpdateDerivationBranch,
    creatingDerivationBranch || updatingDerivationBranch,
  ];
}
