//NounParadigmFormulaData.ts

import { NavigateFunction } from "react-router-dom";
import * as yup from "yup";

export interface NounParadigmFormulaFormData
  extends yup.InferType<typeof NounParadigmFormulaFormDataSchema> {
  nounParadigmFormula: NounParadigmFormulaModel;
  morphemeIds: number[];
}

export interface CreateUpdateNounParadigmFormulaFormData {
  nounParadigmFormulaFormData: NounParadigmFormulaFormData;
  navigate: NavigateFunction;
}

export interface NounParadigmFormulaModel {
  nprId: number;
  nounParadigmId: number;
  nprOrderInParadigm: number;
  grammarCaseId: number;
  nounNumberId: number;
  nprSample: string;
}

//5. სარედაქტირებელი ობიექტის სქემა
export const NounParadigmFormulaFormDataSchema = yup.object().shape({
  nounParadigmFormula: yup.object().shape({
    nprId: yup.number().integer().default(0).required(),
    nounParadigmId: yup
      .number()
      .integer()
      .positive("პარადიგმა არჩეული უნდა იყოს")
      .required("პარადიგმა არჩეული უნდა იყოს")
      .default(0),
    nprOrderInParadigm: yup
      .number()
      .integer()
      .default(0)
      .min(0, "რიგითი ნომერი 0-ზე მეტი უნდა იყოს"),
    grammarCaseId: yup
      .number()
      .integer()
      .positive("ბრუნვა არჩეული უნდა იყოს")
      .required("ბრუნვა არჩეული უნდა იყოს")
      .default(0),
    nounNumberId: yup
      .number()
      .integer()
      .positive("რიცხვი არჩეული უნდა იყოს")
      .required("რიცხვი არჩეული უნდა იყოს")
      .default(0),
    nprSample: yup.string().required("ნიმუში შევსებული უნდა იყოს").default("-"),
  }),
  morphemeIds: yup
    .array()
    .ensure()
    .min(1, "ფორმულაში უნდა იყოს ერთი მაინც არანულოვანი მორფემა")
    .of(yup.number().integer().positive().default(0).required()),
});
