//DerivationFormulaFormData.ts

import * as yup from "yup";

export interface DerivationFormulaFormData
  extends yup.InferType<typeof DerivationFormulaFormDataSchema> {
  derivationFormula: DerivationFormulaModel;
  morphemeIds: number[];
}

export interface DerivationFormulaModel {
  dfId: number;
  derivationTypeId: number;
  dfAutoNounInflection: boolean;
  dfAutoPhoneticsType: number | null;
  formulaName: string;
}

//5. სარედაქტირებელი ობიექტის სქემა
export const DerivationFormulaFormDataSchema = yup.object().shape({
  derivationFormula: yup.object().shape({
    dfId: yup.number().integer().default(0).required(),
    derivationTypeId: yup
      .number()
      .integer()
      .positive("დერივაციის ტიპი არჩეული უნდა იყოს")
      .required("დერივაციის ტიპი არჩეული უნდა იყოს")
      .default(0),
    dfAutoNounInflection: yup.boolean().default(false),
    dfAutoPhoneticsType: yup
      .number()
      .nullable()
      .transform((v, o) => (o === null ? 0 : v))
      .integer()
      .min(0)
      .default(0),
    formulaName: yup
      .string()
      .required("ფორმულის სახელი შევსებული უნდა იყოს")
      .default(""),
  }),
  morphemeIds: yup
    .array()
    .ensure()
    .min(1, "ფორმულაში უნდა იყოს ერთი მაინც არანულოვანი მორფემა")
    .of(yup.number().integer().positive().default(0).required()),
});
