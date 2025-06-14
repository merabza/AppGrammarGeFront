//VerbParadigmFormulaData.ts

import type { NavigateFunction } from "react-router-dom";
import * as yup from "yup";

export interface VerbParadigmFormulaFormData
    extends yup.InferType<typeof VerbParadigmFormulaFormDataSchema> {
    verbParadigmFormula: VerbParadigmFormulaModel;
    morphemeIds: number[];
}

export interface CreateUpdateVerbParadigmFormulaFormData {
    verbParadigmFormulaFormData: VerbParadigmFormulaFormData;
    navigate: NavigateFunction;
}

export interface VerbParadigmFormulaModel {
    vprId: number;
    verbParadigmId: number;
    verbTypeId: number;
    verbRowId: number;
    verbPersonMarkerParadigmId: number;
    vprSample: string;
}

//5. სარედაქტირებელი ობიექტის სქემა
export const VerbParadigmFormulaFormDataSchema = yup.object().shape({
    verbParadigmFormula: yup.object().shape({
        vprId: yup.number().integer().default(0).required(),
        verbParadigmId: yup
            .number()
            .integer()
            .positive("პარადიგმა არჩეული უნდა იყოს")
            .required("პარადიგმა არჩეული უნდა იყოს")
            .default(0),
        verbTypeId: yup
            .number()
            .integer()
            .default(0)
            .positive("ზმნის ტიპი არჩეული უნდა იყოს")
            .required("ზმნის ტიპი არჩეული უნდა იყოს")
            .default(0),
        verbRowId: yup
            .number()
            .integer()
            .positive("მწკრივი არჩეული უნდა იყოს")
            .required("მწკრივი არჩეული უნდა იყოს")
            .default(0),
        verbPersonMarkerParadigmId: yup
            .number()
            .integer()
            .positive("პირის ნიშნების პარადიგმა არჩეული უნდა იყოს")
            .required("პირის ნიშნების პარადიგმა არჩეული უნდა იყოს")
            .default(0),
        vprSample: yup
            .string()
            .required("ნიმუში შევსებული უნდა იყოს")
            .default("-"),
    }),
    morphemeIds: yup
        .array()
        .ensure()
        .min(1, "ფორმულაში უნდა იყოს ერთი მაინც არანულოვანი მორფემა")
        .of(yup.number().integer().positive().default(0).required()),
});
