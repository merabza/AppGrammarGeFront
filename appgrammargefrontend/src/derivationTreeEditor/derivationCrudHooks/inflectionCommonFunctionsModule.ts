//inflectionCommonFunctionsModule.ts

import { redirect } from "react-router-dom";
import { RootFullModel } from "../../redux/types/rootsTypes";
import {
  funPredRoots,
  getBranchByIdFromStore,
  getInflectionByIdFromStore,
} from "./derivationCommonFunctionsModule";

export async function funAfterSaveInflection(
  rootsRepo: RootFullModel[],
  rootId: number | undefined,
  derivBranchId: number | undefined,
  inflectionId: number | undefined,
  duplicateInflectionId: number | null
) {
  //თავიდან ჩაიტვირთოს ფლექსიის იდენტიფიკატორის მიხედვით ყველა საჭირო ძირი
  // if (inflectionId) {
  //   await getRootByInflectionId(dispatch, getState, inflectionId);
  // }

  //მივიღოთ ფლექსია იდენტიფიკატორის მიხედვით
  const inflection = !!inflectionId
    ? getInflectionByIdFromStore(rootsRepo, inflectionId)
    : null;

  let mustBeinflectionId = inflectionId;

  // if (inflection) dispatch(actionCreators.GetParadigm(inflectionId));
  // else mustBeinflectionId = null;

  if (!inflection) mustBeinflectionId = undefined;

  //მივიღოთ წინაპარი დერივაციების სია
  const preBranches =
    inflection === null
      ? null
      : inflection.inflectionPredecessors.map((ip) => ip.parentBranchId);

  //თუ derivBranchId შედის წინაპარი დერივაციების სიაში, მაშინ გამოვიყენოთ derivBranchId, თუ არა გამოვიყენოთ პირველივე სიიდან
  const dbrId =
    !preBranches ||
    preBranches.length === 0 ||
    (derivBranchId && preBranches.includes(derivBranchId))
      ? derivBranchId
      : preBranches[0];

  //დადგენილი დერივაციისათვის მივიღოთ წინაპარი ძირების სია
  if (!dbrId) redirect("/basesearch");
  else {
    const branch = getBranchByIdFromStore(rootsRepo, dbrId);
    const predRootIds = funPredRoots(branch, rootsRepo);
    // const duplicateInflectionId =
    //   getState().rootEditorStore.duplicateInflectionId;

    //თუ rootId შედის წინაპარი ძირების სიაში, მაშინ გამოვიყენოთ rootId, თუ არა გამოვიყენოთ პირველივე სიიდან
    const forOpenRootId =
      (!!rootId && predRootIds.includes(rootId)) || predRootIds.length === 0
        ? rootId
        : predRootIds[0];

    if (forOpenRootId) {
      if (dbrId) {
        if (duplicateInflectionId)
          redirect(`/root/${forOpenRootId}/${dbrId}/${duplicateInflectionId}`);
        else if (mustBeinflectionId)
          redirect(`/root/${forOpenRootId}/${dbrId}/${mustBeinflectionId}`);
        else redirect(`/root/${forOpenRootId}/${dbrId}`);
      } else redirect(`/root/${forOpenRootId}`);
    } else redirect("/basesearch");
  }
}
