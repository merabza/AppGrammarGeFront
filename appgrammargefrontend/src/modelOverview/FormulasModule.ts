//FormulasModule.ts

//FormulasModule.ts
import type { Morpheme, MorphemeRange } from "../masterData/mdTypes";

export function getFormulaVisual(
    morphemeGroupId: number,
    morphemeIds: number[],
    morphemeRanges: MorphemeRange[],
    morphemesQuery: Morpheme[]
): string {
    const mranges = morphemeRanges
        .filter((f) => f.morphemeGroupId === morphemeGroupId)
        .sort((a, b) => a.mrPosition - b.mrPosition);
    return getFormulaVisual2(morphemeIds, mranges, morphemesQuery);
}

export function getFormulaVisual2(
    morphemeIds: number[],
    mranges: MorphemeRange[],
    morphemesQuery: Morpheme[]
): string {
    // console.log("getFormulaVisual2 {morphemeIds, mranges, morphemesQuery}=", {
    //   morphemeIds,
    //   mranges,
    //   morphemesQuery,
    // });

    let morphemes = morphemeIds.map((mId) => {
        return morphemesQuery.find((m) => m.mrpId === mId);
    });

    morphemes = morphemes.filter((f) => f !== undefined);

    morphemes = mranges.map((range) => {
        return morphemes.find((f) => f?.morphemeRangeId === range.mrId);
    });

    morphemes = morphemes.filter((f) => f !== undefined);

    const result = morphemes
        .map((morpheme, ind) => {
            return `${morpheme?.mrpName ? morpheme.mrpName.trim() : "(null)"}`;
        })
        .join("-");

    // console.log("FormulasModule getDerivFormulaVisual result=", result);

    return result;
}
