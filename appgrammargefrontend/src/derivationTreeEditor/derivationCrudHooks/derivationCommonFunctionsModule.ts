//derivationCommonFunctionsModule.ts

// import { redirect } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";
import type {
    DerivationBranchModel,
    InflectionVerbCompositionRedModel,
    NounInflectionRedModel,
    RootFullModel,
    VerbInflectionRedModel,
} from "../../redux/types/rootsTypes";

export function getBranchByIdFromStore(
    rootsRepo: { [key: number]: RootFullModel },
    branchId: number
): DerivationBranchModel | null {
    for (var rootData of Object.values(rootsRepo)) {
        if (rootData) {
            const branch = rootData.branches.find(
                (item) => item.dbrId === branchId
            );
            if (branch) {
                return branch;
            }
        }
    }
    return null;
}

export function getInflectionByIdFromStore(
    rootsRepo: { [key: number]: RootFullModel },
    infId: number
) {
    for (var rootData of Object.values(rootsRepo)) {
        if (rootData) {
            const verbInflection = rootData.verbInflections.find(
                (item) => item.infId === infId
            );
            if (verbInflection) {
                return verbInflection;
            }
            const nounInflection = rootData.nounInflections.find(
                (item) => item.infId === infId
            );
            if (nounInflection) {
                return nounInflection;
            }
        }
    }
    return null;
}

export function getInflectionVerbCompositionByIdFromStore(
    rootsRepo: { [key: number]: RootFullModel },
    ivcId: number
) {
    for (var rootData of Object.values(rootsRepo)) {
        //console.log("getInflectionVerbCompositionByIdFromStore {rootData, ivcId}=", {rootData, ivcId})
        if (rootData) {
            const inflectionVerbComposition =
                rootData.inflectionVerbCompositions.find(
                    (item) => item.ivcId === ivcId
                );
            if (inflectionVerbComposition) {
                return inflectionVerbComposition;
            }
        }
    }
    return null;
}

export function havePredRoots(
    rootsRepo: { [key: number]: RootFullModel },
    branch: DerivationBranchModel
) {
    if (branch.derivationPredecessors.length === 0) {
        const rootData = Object.values(rootsRepo).find(
            (rtd) => rtd?.root?.rootFirstBranchId === branch.dbrId
        );
        if (rootData) {
            return true;
        }
        return false;
    }
    for (var pre of branch.derivationPredecessors.map((itm) =>
        getBranchByIdFromStore(rootsRepo, itm.parentBranchId)
    )) {
        if (!pre) return false;
        if (!havePredRoots(rootsRepo, pre)) return false;
    }
    return true;
}

export function haveInflectionPredRoots(
    rootsRepo: { [key: number]: RootFullModel },
    inflection: VerbInflectionRedModel | NounInflectionRedModel
) {
    for (var pre of inflection.inflectionPredecessors.map((itm) =>
        getBranchByIdFromStore(rootsRepo, itm.parentBranchId)
    )) {
        if (!pre) return false;
        if (!havePredRoots(rootsRepo, pre)) return false;
    }
    return true;
}

export function haveInflectionVerbCompositionPredRoots(
    rootsRepo: { [key: number]: RootFullModel },
    inflectionVerbComposition: InflectionVerbCompositionRedModel
) {
    for (var pre of inflectionVerbComposition.inflectionVerbCompositionPredecessors.map(
        (itm) =>
            getVerbInflectionByIdFromStore(rootsRepo, itm.parentInflectionId)
    )) {
        if (!pre) return false;
        if (!haveInflectionPredRoots(rootsRepo, pre)) return false;
    }
    return true;
}

export function getVerbInflectionByIdFromStore(
    rootsRepo: { [key: number]: RootFullModel },
    infId: number
) {
    for (var rootData of Object.values(rootsRepo)) {
        if (rootData) {
            const inflection = rootData.verbInflections.find(
                (item) => item.infId === infId
            );
            if (inflection) {
                return inflection;
            }
        }
    }
    return null;
}

export async function funAfterSaveBranch(
    derivBranchId: number | undefined,
    rootId: number | undefined,
    rootsRepo: { [key: number]: RootFullModel },
    duplicateDerivationBranchId: number | null,
    navigate: NavigateFunction
) {
    // history,
    // dispatch,
    // getState,
    // rootId,
    // derivBranchId
    //console.log("DerivTreeStore funAfterSaveBranch {rootId, derivBranchId}=", {rootId, derivBranchId})

    // //თავიდან ჩაიტვირთოს დერივაციის იდენტიფიკატორის მიხედვით ყველა საჭირო ძირი
    // if (derivBranchId)
    //   await getRootByDerivBranchId(derivBranchId).unwrap();

    //დერივაციისათვის მივიღოთ წინაპარი ძირების სია
    const branch = !!derivBranchId
        ? getBranchByIdFromStore(rootsRepo, derivBranchId)
        : null;

    const predRootIds = funPredRoots(branch, rootsRepo);

    //თუ rootId შედის წინაპარი ძირების სიაში, მაშინ გამოვიყენოთ rootId, თუ არა გამოვიყენოთ პირველივე სიიდან
    const forOpenRootId =
        (!!rootId && !!predRootIds && predRootIds.includes(rootId)) ||
        predRootIds.length === 0
            ? rootId
            : predRootIds[0];

    if (forOpenRootId) {
        if (duplicateDerivationBranchId)
            navigate(`/root/${forOpenRootId}/${duplicateDerivationBranchId}`);
        else if (derivBranchId)
            navigate(`/root/${forOpenRootId}/${derivBranchId}`);
        else navigate(`/root/${forOpenRootId}`);
    } else navigate("/basesearch");
}

export function funPredRoots(
    branch: DerivationBranchModel | null,
    rootsRepo: { [key: number]: RootFullModel }
): number[] {
    if (!branch) return [] as number[];
    if (branch.derivationPredecessors.length === 0) {
        const rootData = Object.values(rootsRepo).find(
            (rtd) => rtd?.root?.rootFirstBranchId === branch.dbrId
        );
        if (rootData) {
            return [rootData.root.rootId];
        }
        return [];
    }

    const prebranches = branch.derivationPredecessors.map((itm) =>
        getBranchByIdFromStore(rootsRepo, itm.parentBranchId)
    );
    const r2 = prebranches.map((pre) => funPredRoots(pre, rootsRepo));
    return arrayUnique(([] as number[]).concat(...r2));
}

function arrayUnique(array: number[]): number[] {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }
    return a;
}
