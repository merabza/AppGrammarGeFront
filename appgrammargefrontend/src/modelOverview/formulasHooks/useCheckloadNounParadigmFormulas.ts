//useCheckloadNounParadigmFormulas.ts

import { useCallback } from "react";

import { useAppSelector } from "../../appcarcass/redux/hooks";
import { useLazyCheckLoadNounParadigmFormulasQuery } from "../../redux/api/modelDataApi";

export type fnloadCheckLoadNounParadigmFormulas = (paradigmId: number) => void;

export function useCheckLoadNounParadigmFormulas(): [
    fnloadCheckLoadNounParadigmFormulas,
    boolean
] {
    const modelDataState = useAppSelector((state) => state.modelDataState);

    const [
        CheckLoadNounParadigmFormulas,
        { isLoading: nounParadigmFormulasLoading },
    ] = useLazyCheckLoadNounParadigmFormulasQuery();

    const checkLoadNounParadigmFormulas = useCallback(
        async (paradigmId: number) => {
            // console.log(
            //   "useCheckLoadNounParadigmFormulas checkLoadNounParadigmFormulas started nounParadigmFormulasLoading=",
            //   nounParadigmFormulasLoading
            // );

            if (nounParadigmFormulasLoading) return;

            // console.log(
            //   "useCheckLoadNounParadigmFormulas checkLoadNounParadigmFormulas nounParadigmFormulasLoading checked modelDataState.nounParadigmFormulas=",
            //   modelDataState.nounParadigmFormulas
            // );

            if (
                paradigmId in modelDataState.nounParadigmFormulas &&
                modelDataState.nounParadigmFormulas[paradigmId].length
            )
                return;

            // console.log(
            //   "useCheckLoadNounParadigmFormulas checkLoadNounParadigmFormulas modelDataState.nounParadigmFormulas checked"
            // );

            await CheckLoadNounParadigmFormulas(paradigmId);

            // console.log(
            //   "useCheckLoadNounParadigmFormulas checkLoadNounParadigmFormulas finished"
            // );
        },
        [modelDataState, nounParadigmFormulasLoading]
    );

    return [checkLoadNounParadigmFormulas, nounParadigmFormulasLoading];
}
