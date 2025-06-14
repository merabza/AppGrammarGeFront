//VerbPersonMarkerFormulaData.ts

import type { NavigateFunction } from "react-router-dom";
import * as yup from "yup";

export interface VerbPersonMarkerFormulaFormData
    extends yup.InferType<typeof VerbPersonMarkerFormulaFormDataSchema> {
    verbPersonMarkerFormula: VerbPersonMarkerFormulaModel;
    morphemeIds: number[];
}

export interface CreateUpdateVerbPersonMarkerFormulaFormData {
    verbPersonMarkerFormulaFormData: VerbPersonMarkerFormulaFormData;
    navigate: NavigateFunction;
}

export interface VerbPersonMarkerFormulaModel {
    vpmprId: number;
    verbPluralityTypeId: number;
    verbPersonMarkerParadigmId: number;
    verbPersonId: number;
    verbNumberId: number;
    formulaName: string;
}

//5. სარედაქტირებელი ობიექტის სქემა
export const VerbPersonMarkerFormulaFormDataSchema = yup.object().shape({
    verbPersonMarkerFormula: yup.object().shape({
        vpmprId: yup.number().integer().default(0).required(),
        verbPluralityTypeId: yup
            .number()
            .integer()
            .default(0)
            .positive("მრავლობითობა არჩეული უნდა იყოს")
            .required("მრავლობითობა არჩეული უნდა იყოს")
            .default(0),
        verbPersonMarkerParadigmId: yup
            .number()
            .integer()
            .positive("პირის ნიშნების პარადიგმა არჩეული უნდა იყოს")
            .required("პირის ნიშნების პარადიგმა არჩეული უნდა იყოს")
            .default(0),
        verbPersonId: yup
            .number()
            .integer()
            .positive("ზმნის პირი არჩეული უნდა იყოს")
            .required("ზმნის პირი არჩეული უნდა იყოს")
            .default(0),
        verbNumberId: yup
            .number()
            .integer()
            .positive("ზმნის რიცხვი არჩეული უნდა იყოს")
            .required("ზმნის რიცხვი არჩეული უნდა იყოს")
            .default(0),
    }),
    morphemeIds: yup
        .array()
        .ensure()
        .min(1, "ფორმულაში უნდა იყოს ერთი მაინც არანულოვანი მორფემა")
        .of(yup.number().integer().positive().default(0).required()),
});
