//useCheckLoadDerivationFormulas.ts

import { useCallback } from "react";

import { useAppSelector } from "../../appcarcass/redux/hooks";
import { useLazyCheckLoadDerivationFormulasQuery } from "../../redux/api/modelDataApi";

export type fnloadCheckLoadDerivationFormulas = () => void;

export function useCheckLoadDerivationFormulas(): [
    fnloadCheckLoadDerivationFormulas,
    boolean
] {
    const modelDataState = useAppSelector((state) => state.modelDataState);

    const [CheckLoadDerivationFormulas, { isLoading: derivFormulasLoading }] =
        useLazyCheckLoadDerivationFormulasQuery();

    const checkLoadDerivationFormulas = useCallback(async () => {
        // console.log(
        //   "useCheckLoadDerivationFormulas checkLoadDerivationFormulas started derivFormulasLoading=",
        //   derivFormulasLoading
        // );

        if (derivFormulasLoading) return;

        // console.log(
        //   "useCheckLoadDerivationFormulas checkLoadDerivationFormulas derivFormulasLoading checked modelDataState.derivationFormulas=",
        //   modelDataState.derivationFormulas
        // );

        if (modelDataState.derivationFormulas.length) return;

        // console.log(
        //   "useCheckLoadDerivationFormulas checkLoadDerivationFormulas modelDataState.derivationFormulas checked"
        // );

        await CheckLoadDerivationFormulas();

        // console.log(
        //   "useCheckLoadDerivationFormulas checkLoadDerivationFormulas finished"
        // );
    }, [modelDataState, derivFormulasLoading]);

    return [checkLoadDerivationFormulas, derivFormulasLoading];
}
