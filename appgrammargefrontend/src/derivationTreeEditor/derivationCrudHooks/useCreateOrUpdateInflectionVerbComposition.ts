//useCreateOrUpdateInflectionVerbComposition.ts

import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../appcarcass/redux/hooks";
import {
  useCreateInflectionVerbCompositionMutation,
  useUpdateInflectionVerbCompositionMutation,
} from "../../redux/api/inflectionVerbCompositionCrudApi";
import { useLazyGetRootByInflectionVerbCompositionIdQuery } from "../../redux/api/rootsApi";
import { setduplicateInflectionVerbCompositionId } from "../../redux/slices/inflectionVerbCompositionCrudSlice";
import { InflectionVerbCompositionData } from "../TypesAndSchemas/InflectionVerbCompositionDataTypeAndSchema";
import { funAfterSaveInflectionVerbComposition } from "./inflectionVerbCompositionCommonFunctionsModule";

export type fnCreateOrUpdateInflectionVerbComposition = (
  infId: number | undefined,
  dbrId: number | undefined,
  rootId: number | undefined,
  InflectionVerbComposition: InflectionVerbCompositionData
) => void;

export function useCreateOrUpdateInflectionVerbComposition(): [
  fnCreateOrUpdateInflectionVerbComposition,
  boolean
] {
  const dispatch = useAppDispatch();
  const { rootsRepo } = useAppSelector((state) => state.rootsState);

  const [
    createInflectionVerbComposition,
    { isLoading: creatingInflectionVerbComposition },
  ] = useCreateInflectionVerbCompositionMutation();
  const [
    updateInflectionVerbComposition,
    { isLoading: updatingInflectionVerbComposition },
  ] = useUpdateInflectionVerbCompositionMutation();
  const {
    inflectionVerbCompositionForEdit,
    duplicateInflectionVerbCompositionId,
  } = useAppSelector((state) => state.inflectionVerbCompositionCrudState);

  const [getRootByInflectionVerbCompositionId] =
    useLazyGetRootByInflectionVerbCompositionIdQuery();

  const createOrUpdateInflectionVerbComposition = useCallback(
    async (
      infId: number | undefined,
      dbrId: number | undefined,
      rootId: number | undefined,
      InflectionVerbComposition: InflectionVerbCompositionData
    ) => {
      let ivcId: number | undefined;
      dispatch(setduplicateInflectionVerbCompositionId(null));
      if (dbrId) {
        updateInflectionVerbComposition(InflectionVerbComposition);
        ivcId = InflectionVerbComposition.inflectionVerbComposition.ivcId;
      } else {
        createInflectionVerbComposition(InflectionVerbComposition);
        ivcId =
          inflectionVerbCompositionForEdit?.inflectionVerbComposition.ivcId;
      }

      //თავიდან ჩაიტვირთოს დერივაციის იდენტიფიკატორის მიხედვით ყველა საჭირო ძირი
      if (ivcId) await getRootByInflectionVerbCompositionId(ivcId).unwrap();

      funAfterSaveInflectionVerbComposition(
        rootsRepo,
        rootId,
        dbrId,
        infId,
        ivcId,
        duplicateInflectionVerbCompositionId
      );

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
      // createInflectionVerbComposition,
      inflectionVerbCompositionForEdit?.inflectionVerbComposition.ivcId,
      duplicateInflectionVerbCompositionId,
      // getRootByInflectionVerbCompositionId,
      // updateInflectionVerbComposition,
    ]
  );

  return [
    createOrUpdateInflectionVerbComposition,
    creatingInflectionVerbComposition || updatingInflectionVerbComposition,
  ];
}
