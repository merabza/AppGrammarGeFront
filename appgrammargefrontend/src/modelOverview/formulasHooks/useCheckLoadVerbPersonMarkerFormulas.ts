//useCheckLoadVerbPersonMarkerFormulas.ts

import { useCallback } from "react";

import { useAppSelector } from "../../appcarcass/redux/hooks";
import { useLazyCheckLoadVerbPersonMarkerFormulasQuery } from "../../redux/api/modelDataApi";

export type fnloadCheckLoadVerbPersonMarkerFormulas = (
    paradigmId: number
) => void;

export function useCheckLoadVerbPersonMarkerFormulas(): [
    fnloadCheckLoadVerbPersonMarkerFormulas,
    boolean
] {
    const modelDataState = useAppSelector((state) => state.modelDataState);

    const [
        CheckLoadVerbPersonMarkerFormulas,
        { isLoading: VerbPersonMarkerFormulasLoading },
    ] = useLazyCheckLoadVerbPersonMarkerFormulasQuery();

    const checkLoadVerbPersonMarkerFormulas = useCallback(
        async (paradigmId: number) => {
            // console.log(
            //   "useCheckLoadVerbPersonMarkerFormulas checkLoadVerbPersonMarkerFormulas started VerbPersonMarkerFormulasLoading=",
            //   VerbPersonMarkerFormulasLoading
            // );

            if (VerbPersonMarkerFormulasLoading) return;

            // console.log(
            //   "useCheckLoadVerbPersonMarkerFormulas checkLoadVerbPersonMarkerFormulas VerbPersonMarkerFormulasLoading checked modelDataState.VerbPersonMarkerFormulas=",
            //   modelDataState.VerbPersonMarkerFormulas
            // );

            if (
                paradigmId in modelDataState.verbPersonMarkerFormulas &&
                modelDataState.verbPersonMarkerFormulas[paradigmId].length
            )
                return;

            // console.log(
            //   "useCheckLoadVerbPersonMarkerFormulas checkLoadVerbPersonMarkerFormulas modelDataState.VerbPersonMarkerFormulas checked"
            // );

            await CheckLoadVerbPersonMarkerFormulas(paradigmId);

            // console.log(
            //   "useCheckLoadVerbPersonMarkerFormulas checkLoadVerbPersonMarkerFormulas finished"
            // );
        },
        [modelDataState, VerbPersonMarkerFormulasLoading]
    );

    return [checkLoadVerbPersonMarkerFormulas, VerbPersonMarkerFormulasLoading];
}
