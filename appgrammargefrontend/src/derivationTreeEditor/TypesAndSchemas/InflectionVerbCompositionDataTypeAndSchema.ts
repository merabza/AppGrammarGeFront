//InflectionVerbCompositionDataTypeAndSchema.ts

import * as yup from "yup";

export interface InflectionVerbCompositionData
  extends yup.InferType<typeof inflectionVerbCompositionDataSchema> {
  inflectionVerbComposition: InflectionVerbCompositionCrudModel;
  inflectionVerbCompositionPredecessors: inflectionVerbCompositionPredecessorsModel[];
}

export interface InflectionVerbCompositionCrudModel {
  ivcId: number;
  ivcName: string;
  ivcSamples: string;
  classifierId: number;
  recordStatusId: number;
  creator: string;
}

export interface inflectionVerbCompositionPredecessorsModel {
  parentNom: number;
  parentInflectionId: number;
  lastMorphemeRangeId: number | null | undefined;
}

export const inflectionVerbCompositionDataSchema = yup.object().shape({
  inflectionVerbComposition: yup.object().shape({
    ivcId: yup.number().integer().default(0).required(),
    ivcName: yup.string().default(""),
    ivcSamples: yup.string().default(""),
    classifierId: yup.number().integer().default(0),
    recordStatusId: yup
      .number()
      .integer()
      .min(0, "ჩანაწერის სტატუსი შეიძლება იყოს მხოლოდ 0, 1, 2")
      .max(2, "ჩანაწერის სტატუსი შეიძლება იყოს მხოლოდ 0, 1, 2")
      .required("ჩანაწერის სტატუსი შევსებული უნდა იყოს")
      .default(0),
    creator: yup.string().max(256).default(""),
  }),
  inflectionVerbCompositionPredecessors: yup
    .array()
    .ensure()
    .of(
      yup.object().shape({
        parentNom: yup.number().integer().default(0).required(),
        parentInflectionId: yup
          .number()
          .integer()
          .positive("წინაპარი ზმნა არჩეული უნდა იყოს")
          .required("წინაპარი ზმნა არჩეული უნდა იყოს")
          .default(0),
        lastMorphemeRangeId: yup
          .number()
          .integer()
          .nullable()
          //   .min(0)
          //   .transform((v, o) => (o === null ? 0 : v)) //.transform((v, o) => o === null ? 0 : v).integer().min(0)
          .when("parentNom", {
            is: (val: number) => val === 0,
            then: (schema) =>
              schema
                .transform((v, o) => (o === null ? 0 : v))
                .integer()
                .min(0)
                .default(3),
            otherwise: (schema) =>
              schema
                .transform((v, o) => (o === null ? 0 : v))
                .integer()
                .min(0)
                .default(0),
          }),
      })
    ),
});
