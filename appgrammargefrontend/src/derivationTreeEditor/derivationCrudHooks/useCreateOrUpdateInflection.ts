//useCreateOrUpdateInflection.ts

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../appcarcass/redux/hooks";
import {
    useCreateInflectionMutation,
    useUpdateInflectionMutation,
} from "../../redux/api/inflectionCrudApi";
import { useLazyGetRootByInflectionIdQuery } from "../../redux/api/rootsApi";
import { setduplicateInflectionId } from "../../redux/slices/inflectionCrudSlice";
import type { InflectionData } from "../TypesAndSchemas/InflectionDataTypeAndSchema";
import { funAfterSaveInflection } from "./inflectionCommonFunctionsModule";
// import { funAfterSaveInflection } from "./inflectionCommonFunctionsModule";

export type fnCreateOrUpdateInflection = (
    curDbrIdVal: number | undefined,
    rootId: number | undefined,
    Inflection: InflectionData
) => void;

export function useCreateOrUpdateInflection(): [
    fnCreateOrUpdateInflection,
    boolean
] {
    const dispatch = useAppDispatch();
    const { rootsRepo } = useAppSelector((state) => state.rootsState);
    const navigate = useNavigate();
    const [createInflection, { isLoading: creatingInflection }] =
        useCreateInflectionMutation();
    const [updateInflection, { isLoading: updatingInflection }] =
        useUpdateInflectionMutation();
    const { inflectionForEdit, duplicateInflectionId } = useAppSelector(
        (state) => state.inflectionCrudState
    );

    const [getRootByInflectionId] = useLazyGetRootByInflectionIdQuery();

    const createOrUpdateInflection = useCallback(
        async (
            dbrId: number | undefined,
            rootId: number | undefined,
            Inflection: InflectionData
        ) => {
            let infId: number | undefined;
            dispatch(setduplicateInflectionId(null));
            if (dbrId) {
                updateInflection(Inflection);
                infId = Inflection.inflection.infId;
            } else {
                createInflection(Inflection);
                infId = inflectionForEdit?.inflection.infId;
            }

            //თავიდან ჩაიტვირთოს დერივაციის იდენტიფიკატორის მიხედვით ყველა საჭირო ძირი
            if (infId) await getRootByInflectionId(infId).unwrap();

            funAfterSaveInflection(
                rootsRepo,
                rootId,
                dbrId,
                infId,
                duplicateInflectionId,
                navigate
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
            // createInflection,
            inflectionForEdit?.inflection.infId,
            duplicateInflectionId,
            // getRootByInflectionId,
            // updateInflection,
        ]
    );

    return [createOrUpdateInflection, creatingInflection || updatingInflection];
}
