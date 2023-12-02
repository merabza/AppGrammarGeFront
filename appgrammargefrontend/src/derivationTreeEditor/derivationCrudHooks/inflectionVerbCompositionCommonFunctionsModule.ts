//inflectionVerbCompositionCommonFunctionsModule.ts

// import { redirect } from "react-router-dom";
import { NavigateFunction } from "react-router-dom";
import { RootFullModel } from "../../redux/types/rootsTypes";
import {
  funPredRoots,
  getBranchByIdFromStore,
  getInflectionByIdFromStore,
  getInflectionVerbCompositionByIdFromStore,
} from "./derivationCommonFunctionsModule";

// export async function funAfterSaveInflectionVerbComposition(
//   rootsRepo: { [key: number]: RootFullModel },
//   rootId: number | undefined,
//   derivBranchId: number | undefined,
//   inflectionId: number | undefined,
//   duplicateInflectionVerbCompositionId: number | null,
// ) {
//   //თავიდან ჩაიტვირთოს ფლექსიის იდენტიფიკატორის მიხედვით ყველა საჭირო ძირი
//   // if (inflectionId) {
//   //   await getRootByInflectionVerbCompositionId(dispatch, getState, inflectionId);
//   // }

//   //მივიღოთ ფლექსია იდენტიფიკატორის მიხედვით
//   const inflection = !!inflectionId
//     ? getInflectionVerbCompositionByIdFromStore(rootsRepo, inflectionId)
//     : null;

//   let mustBeinflectionId = inflectionId;

//   // if (inflection) dispatch(actionCreators.GetParadigm(inflectionId));
//   // else mustBeinflectionId = null;

//   if (!inflection) mustBeinflectionId = undefined;

//   //მივიღოთ წინაპარი დერივაციების სია
//   const preBranches =
//     inflection === null
//       ? null
//       : inflection.inflectionPredecessors.map((ip) => ip.parentBranchId);

//   //თუ derivBranchId შედის წინაპარი დერივაციების სიაში, მაშინ გამოვიყენოთ derivBranchId, თუ არა გამოვიყენოთ პირველივე სიიდან
//   const dbrId =
//     !preBranches ||
//     preBranches.length === 0 ||
//     (derivBranchId && preBranches.includes(derivBranchId))
//       ? derivBranchId
//       : preBranches[0];

//   //დადგენილი დერივაციისათვის მივიღოთ წინაპარი ძირების სია
//   if (!dbrId) navigate("/basesearch");
//   else {
//     const branch = getBranchByIdFromStore(rootsRepo, dbrId);
//     const predRootIds = funPredRoots(branch, rootsRepo);
//     // const duplicateInflectionVerbCompositionId =
//     //   getState().rootEditorStore.duplicateInflectionVerbCompositionId;

//     //თუ rootId შედის წინაპარი ძირების სიაში, მაშინ გამოვიყენოთ rootId, თუ არა გამოვიყენოთ პირველივე სიიდან
//     const forOpenRootId =
//       (!!rootId && predRootIds.includes(rootId)) || predRootIds.length === 0
//         ? rootId
//         : predRootIds[0];

//     if (forOpenRootId) {
//       if (dbrId) {
//         if (duplicateInflectionVerbCompositionId)
//           navigate(`/root/${forOpenRootId}/${dbrId}/${duplicateInflectionVerbCompositionId}`);
//         else if (mustBeinflectionId)
//           navigate(`/root/${forOpenRootId}/${dbrId}/${mustBeinflectionId}`);
//         else navigate(`/root/${forOpenRootId}/${dbrId}`);
//       } else navigate(`/root/${forOpenRootId}`);
//     } else navigate("/basesearch");
//   }
// }

export async function funAfterSaveInflectionVerbComposition(
  rootsRepo: { [key: number]: RootFullModel },
  rootId: number | undefined,
  derivBranchId: number | undefined,
  inflectionId: number | undefined,
  inflectionVerbCompositionId: number | undefined,
  duplicateInflectionVerbCompositionId: number | null,
  navigate: NavigateFunction
) {
  //console.log("funAfterSaveInflectionVerbComposition {rootId, derivBranchId, inflectionId, inflectionVerbCompositionId}=", {rootId, derivBranchId, inflectionId, inflectionVerbCompositionId})
  // //თავიდან ჩაიტვირთოს ფლექსიის იდენტიფიკატორის მიხედვით ყველა საჭირო ძირი
  // if (inflectionVerbCompositionId) {
  //   await getRootByInflectionVerbCompositionId(
  //     dispatch,
  //     getState,
  //     inflectionVerbCompositionId
  //   );
  // }

  //მივიღოთ ზმნური კომპოზიცია იდენტიფიკატორის მიხედვით
  const inflectionVerbComposition = !!inflectionVerbCompositionId
    ? getInflectionVerbCompositionByIdFromStore(
        rootsRepo,
        inflectionVerbCompositionId
      )
    : null;
  //console.log("funAfterSaveInflectionVerbComposition inflectionVerbComposition=", inflectionVerbComposition)

  let mustBeinflectionVerbCompositionId = inflectionVerbCompositionId;
  // if (inflectionVerbComposition)
  //   dispatch(
  //     actionCreators.GetVerbCompositionParadigm(inflectionVerbCompositionId)
  //   );
  // else mustBeinflectionVerbCompositionId = null;

  if (!inflectionVerbComposition) mustBeinflectionVerbCompositionId = undefined;

  //მივიღოთ წინაპარი ზმნური ფლექსიების სია
  const preinflections =
    inflectionVerbComposition === null
      ? null
      : inflectionVerbComposition.inflectionVerbCompositionPredecessors.map(
          (ip) => ip.parentInflectionId
        );

  //თუ inflectionId შედის წინაპარი ზმნური ფლექსიების სიაში, მაშინ გამოვიყენოთ inflectionId, თუ არა გამოვიყენოთ პირველივე სიიდან
  const infId =
    !preinflections ||
    preinflections.length === 0 ||
    (inflectionId && preinflections.includes(inflectionId))
      ? inflectionId
      : preinflections[0];

  //მივიღოთ ფლექსია იდენტიფიკატორის მიხედვით
  if (!infId) navigate("/basesearch");
  else {
    const inflection =
      inflectionId === null
        ? null
        : getInflectionByIdFromStore(rootsRepo, infId);

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

    if (!dbrId) navigate("/basesearch");
    else {
      //დადგენილი დერივაციისათვის მივიღოთ წინაპარი ძირების სია
      const branch = getBranchByIdFromStore(rootsRepo, dbrId);
      const predRootIds = funPredRoots(branch, rootsRepo);
      // const duplicateInflectionVerbCompositionId =
      //   getState().rootEditorStore.duplicateInflectionVerbCompositionId;

      //თუ rootId შედის წინაპარი ძირების სიაში, მაშინ გამოვიყენოთ rootId, თუ არა გამოვიყენოთ პირველივე სიიდან
      const forOpenRootId =
        (!!rootId && predRootIds.includes(rootId)) || predRootIds.length === 0
          ? rootId
          : predRootIds[0];

      //console.log("funAfterSaveInflectionVerbComposition {forOpenRootId, dbrId, infId, duplicateInflectionVerbCompositionId, mustBeinflectionVerbCompositionId}=", {forOpenRootId, dbrId, infId, duplicateInflectionVerbCompositionId, mustBeinflectionVerbCompositionId});

      if (forOpenRootId) {
        if (dbrId) {
          if (infId) {
            if (duplicateInflectionVerbCompositionId)
              navigate(
                `/root/${forOpenRootId}/${dbrId}/${infId}/${duplicateInflectionVerbCompositionId}`
              );
            else if (mustBeinflectionVerbCompositionId)
              navigate(
                `/root/${forOpenRootId}/${dbrId}/${infId}/${mustBeinflectionVerbCompositionId}`
              );
            else navigate(`/root/${forOpenRootId}/${dbrId}/${infId}`);
          } else navigate(`/root/${forOpenRootId}/${dbrId}`);
        } else navigate(`/root/${forOpenRootId}`);
      } else navigate("/basesearch");
    }
  }
}
