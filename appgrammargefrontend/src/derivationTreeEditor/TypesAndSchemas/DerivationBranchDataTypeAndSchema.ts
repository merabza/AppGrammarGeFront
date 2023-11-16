//DerivationBranchDataTypeAndSchema.ts

import * as yup from "yup";

export interface DerivationBranchData
  extends yup.InferType<typeof derivationBranchDataSchema> {
  derivationBranch: DerivationCrudModel;
  basePhoneticsCombDetails: number[];
  freeMorphemeIds: number[];
  derivationPredecessors: DerivationPredecessorModel[];
}

export interface DerivationCrudModel {
  dbrId: number;
  derivationFormulaId: number;
  dbrBaseName: string | null;
  classifierId: number;
  recordStatusId: number;
  creator: string;
  applier: string | null;
}

export interface DerivationPredecessorModel {
  baseNom: number;
  parentBranchId: number;
  phoneticsChangeId: number | null;
  phoneticsTypeId: number;
}

//5. სარედაქტირებელი ობიექტის სქემა
export const derivationBranchDataSchema = yup.object().shape({
  // derivationBranchData: yup.object().shape({
  derivationBranch: yup.object().shape({
    dbrId: yup.number().integer().default(0).required(),
    classifierId: yup.number().integer().default(0),
    derivationFormulaId: yup
      .number()
      .integer()
      .positive("დერივაციის მოდელი არჩეული უნდა იყოს")
      .required("დერივაციის მოდელი არჩეული უნდა იყოს")
      .default(0),
    dbrBaseName: yup.string().nullable().default(""),
    recordStatusId: yup
      .number()
      .integer()
      .min(0, "ჩანაწერის სტატუსი შეიძლება იყოს მხოლოდ 0, 1, 2")
      .max(2, "ჩანაწერის სტატუსი შეიძლება იყოს მხოლოდ 0, 1, 2")
      .required("ჩანაწერის სტატუსი შევსებული უნდა იყოს")
      .default(0),
    creator: yup.string().max(256).default(""),
  }),
  basePhoneticsCombDetails: yup
    .array()
    .ensure()
    .of(
      yup
        .number()
        .integer()
        .positive(
          "გამოყოფილ უჯრაში ფონეტიკderivationBranchForEditური ცვლილება არჩეული უნდა იყოს"
        )
        .default(0)
        .required()
    ),
  freeMorphemeIds: yup
    .array()
    .ensure()
    .of(yup.number().integer().positive().default(0).required()),
  derivationPredecessors: yup
    .array()
    .ensure()
    .of(
      yup.object().shape({
        baseNom: yup.number().integer().default(0).required(),
        parentBranchId: yup
          .number()
          .integer()
          .positive("წინაპარი არჩეული უნდა იყოს")
          .required("წინაპარი არჩეული უნდა იყოს")
          .default(0),
        phoneticsChangeId: yup
          .number()
          .transform((v, o) => (o === null ? 0 : v))
          .integer()
          .min(0)
          .default(0)
          .nullable(),
        phoneticsTypeId: yup
          .number()
          .transform((v, o) => (o === null ? 0 : v))
          .integer()
          .min(0)
          .default(0),
      })
    ),
});
