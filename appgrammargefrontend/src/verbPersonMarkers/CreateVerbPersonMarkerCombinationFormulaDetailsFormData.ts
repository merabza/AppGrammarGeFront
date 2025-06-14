//CreateVerbPersonMarkerCombinationFormulaDetailsFormData.ts

import * as yup from "yup";

export interface CreateVerbPersonMarkerCombinationFormulaDetailsFormData
    extends yup.InferType<
        typeof createVerbPersonMarkerCombinationFormulaDetailsFormDataSchema
    > {
    verbPluralityTypeId: number;
    verbPersonMarkerParadigmId: number;
    verbTypeId: number;
    verbSeriesId: number;
}

//5. სარედაქტირებელი ობიექტის სქემა
export const createVerbPersonMarkerCombinationFormulaDetailsFormDataSchema = yup
    .object()
    .shape({
        verbPluralityTypeId: yup.number().integer().default(1),
        verbPersonMarkerParadigmId: yup.number().integer().default(1),
        verbTypeId: yup.number().integer().default(1),
        verbSeriesId: yup.number().integer().default(1),
    });
