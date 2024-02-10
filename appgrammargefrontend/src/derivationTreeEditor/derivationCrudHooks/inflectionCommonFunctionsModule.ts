//inflectionCommonFunctionsModule.ts
import { NavigateFunction } from "react-router-dom";
// import { redirect } from "react-router-dom";
import { RootFullModel } from "../../redux/types/rootsTypes";
import {
  funPredRoots,
  getBranchByIdFromStore,
  getInflectionByIdFromStore,
} from "./derivationCommonFunctionsModule";

export async function funAfterSaveInflection(
  rootsRepo: { [key: number]: RootFullModel },
  rootId: number | undefined,
  derivBranchId: number | undefined,
  inflectionId: number | undefined,
  duplicateInflectionId: number | null,
  navigate: NavigateFunction
) {
  //თავიდან ჩაიტვირთოს ფლექსიის იდენტიფიკატორის მიხედვით ყველა საჭირო ძირი
  // if (inflectionId) {
  //   await getRootByInflectionId(dispatch, getState, inflectionId);
  // }

  // console.log(
  //   "funAfterSaveInflection {rootsRepo, rootId, derivBranchId, inflectionId, duplicateInflectionId}",
  //   { rootsRepo, rootId, derivBranchId, inflectionId, duplicateInflectionId }
  // );

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

  // console.log("funAfterSaveInflection dbrId", dbrId);

  //დადგენილი დერივაციისათვის მივიღოთ წინაპარი ძირების სია
  if (!dbrId) navigate("/basesearch");
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

    // console.log(
    //   "funAfterSaveInflection {forOpenRootId, dbrId, duplicateInflectionId, mustBeinflectionId}",
    //   { forOpenRootId, dbrId, duplicateInflectionId, mustBeinflectionId }
    // );

    if (forOpenRootId) {
      if (dbrId) {
        if (duplicateInflectionId) {
          // console.log(
          //   "funAfterSaveInflection redirect",
          //   `/root/${forOpenRootId}/${dbrId}/${duplicateInflectionId}`
          // );
          navigate(`/root/${forOpenRootId}/${dbrId}/${duplicateInflectionId}`);
        } else if (mustBeinflectionId) {
          // console.log(
          //   "funAfterSaveInflection redirect",
          //   `/root/${forOpenRootId}/${dbrId}/${mustBeinflectionId}`
          // );
          navigate(`/root/${forOpenRootId}/${dbrId}/${mustBeinflectionId}`);
        } else {
          // console.log(
          //   "funAfterSaveInflection redirect",
          //   `/root/${forOpenRootId}/${dbrId}`
          // );
          navigate(`/root/${forOpenRootId}/${dbrId}`);
        }
      } else {
        // console.log(
        //   "funAfterSaveInflection redirect",
        //   `/root/${forOpenRootId}`
        // );
        navigate(`/root/${forOpenRootId}`);
      }
    } else {
      // console.log("funAfterSaveInflection redirect", "/basesearch");
      navigate("/basesearch");
    }
  }
}
