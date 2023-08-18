//useCheckloadVerbParadigmFormulas.ts

import { useCallback } from "react";

import { useAppSelector } from "../../appcarcass/redux/hooks";
import { useLazyCheckLoadVerbParadigmFormulasQuery } from "../../redux/api/modelDataApi";

export type fnloadCheckLoadVerbParadigmFormulas = (paradigmId: number) => void;

export function useCheckLoadVerbParadigmFormulas(): [
  fnloadCheckLoadVerbParadigmFormulas,
  boolean
] {
  const modelDataState = useAppSelector((state) => state.modelDataState);

  const [
    CheckLoadVerbParadigmFormulas,
    { isLoading: verbParadigmFormulasLoading },
  ] = useLazyCheckLoadVerbParadigmFormulasQuery();

  const checkLoadVerbParadigmFormulas = useCallback(
    async (paradigmId: number) => {
      // console.log(
      //   "useCheckLoadVerbParadigmFormulas checkLoadVerbParadigmFormulas started verbParadigmFormulasLoading=",
      //   verbParadigmFormulasLoading
      // );

      if (verbParadigmFormulasLoading) return;

      // console.log(
      //   "useCheckLoadVerbParadigmFormulas checkLoadVerbParadigmFormulas verbParadigmFormulasLoading checked modelDataState.verbParadigmFormulas=",
      //   modelDataState.verbParadigmFormulas
      // );

      if (
        paradigmId in modelDataState.verbParadigmFormulas &&
        modelDataState.verbParadigmFormulas[paradigmId].length
      )
        return;

      // console.log(
      //   "useCheckLoadVerbParadigmFormulas checkLoadVerbParadigmFormulas modelDataState.verbParadigmFormulas checked"
      // );

      await CheckLoadVerbParadigmFormulas(paradigmId);

      // console.log(
      //   "useCheckLoadVerbParadigmFormulas checkLoadVerbParadigmFormulas finished"
      // );
    },
    [modelDataState, verbParadigmFormulasLoading]
  );

  return [checkLoadVerbParadigmFormulas, verbParadigmFormulasLoading];
}
