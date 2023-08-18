//InflectionDataTypeAndSchema.ts

import * as yup from "yup";

export interface InflectionData
  extends yup.InferType<typeof inflectionDataSchema> {
  inflection: InflectionCrudModel;
  personVariabilityTypeIds: number[];
  freeMorphemeIds: number[];
  inflectionPredecessors: InflectionPredecessorRedModel[];
  verb: VerbInflectionModel | null;
  noun: NounInflectionModel | null;
}

export interface InflectionPredecessorRedModel {
  baseNom: number;
  parentBranchId: number;
  phoneticsTypeId: number | null;
  phoneticsChangeId: number | null;
}

export interface InflectionCrudModel {
  infId: number;
  inflectionTypeId: number;
  classifierId: number;
  infName: string;
  lemma: string;
  infSamples: string;
  infHomonymIndex: number;
  recordStatusId: number;
  infNote: string | null;
  creator: string;
}

export interface VerbInflectionModel {
  infId: number;
  infName: string;
  verbTypeId: number;
  verbParadigmId: number;
  verbPluralityTypeId: number;
  verbRowFilterId: number;
}
export interface NounInflectionModel {
  nounParadigmId: number;
}

export interface RootLinkQueryModel {
  rootId: number;
  rootName: string;
  rootHomonymIndex: number;
  rootNote: string | null;
}

export const inflectionDataSchema = yup.object().shape({
  inflection: yup.object().shape({
    infId: yup.number().integer().default(0).required(),
    inflectionTypeId: yup
      .number()
      .integer()
      .positive("ფლექსიის ტიპი არჩეული უნდა იყოს")
      .required("ფლექსიის ტიპი არჩეული უნდა იყოს")
      .default(0),
    classifierId: yup.number().integer().default(0),
    infName: yup.string().default(""),
    lemma: yup.string().default(""),
    infSamples: yup.string().default(""),
    infHomonymIndex: yup
      .number()
      .integer()
      .min(0, "ომონიმიის ინდექსი შეიძლება იყოს დადებითი, ან 0")
      .required("ომონიმიის ინდექსი შევსებული უნდა იყოს")
      .default(0),
    recordStatusId: yup
      .number()
      .integer()
      .min(0, "ჩანაწერის სტატუსი შეიძლება იყოს მხოლოდ 0, 1, 2")
      .max(2, "ჩანაწერის სტატუსი შეიძლება იყოს მხოლოდ 0, 1, 2")
      .required("ჩანაწერის სტატუსი შევსებული უნდა იყოს")
      .default(0),
    infNote: yup
      .string()
      .max(255, "შენიშვნის სიგრძე არ შეიძლება იყოს 255 სიმბოლოზე მეტი")
      .default("")
      .nullable(),
    creator: yup.string().max(256).default(""),
  }),
  personVariabilityTypeIds: yup
    .array()
    .ensure()
    .of(
      yup
        .number()
        .integer()
        .positive("გამოყოფილ უჯრაში პირცვალებადობა არჩეული უნდა იყოს")
        .default(0)
        .required()
    ),
  freeMorphemeIds: yup
    .array()
    .ensure()
    .of(yup.number().integer().positive().default(0).required()),
  inflectionPredecessors: yup
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
        phoneticsTypeId: yup
          .number()
          .transform((v, o) => (o === null ? 0 : v))
          .integer()
          .min(0)
          .default(0)
          .nullable(),
        phoneticsChangeId: yup
          .number()
          .transform((v, o) => (o === null ? 0 : v))
          .integer()
          .min(0)
          .default(0)
          .nullable(),
      })
    ),
  verb: yup
    .object()
    .nullable()
    .shape({
      verbTypeId: yup
        .number()
        .integer()
        .positive("ზმნის ტიპი არჩეული უნდა იყოს")
        .required("ზმნის ტიპი არჩეული უნდა იყოს")
        .default(0),
      verbParadigmId: yup
        .number()
        .integer()
        .positive("ზმნის პარადიგმა არჩეული უნდა იყოს")
        .required("ზმნის პარადიგმა არჩეული უნდა იყოს")
        .default(0),
      verbPluralityTypeId: yup
        .number()
        .integer()
        .positive("ზმნის მრავლობითობის ტიპი არჩეული უნდა იყოს")
        .required("ზმნის მრავლობითობის ტიპი არჩეული უნდა იყოს")
        .default(0),
      verbRowFilterId: yup
        .number()
        .integer()
        .positive("ზმნის მწკრივების ფილტრი არჩეული უნდა იყოს")
        .required("ზმნის მწკრივების ფილტრი არჩეული უნდა იყოს")
        .default(0),
    })
    .default(null),
  noun: yup
    .object()
    .nullable()
    .shape({
      nounParadigmId: yup
        .number()
        .integer()
        .positive("სახელის პარადიგმა არჩეული უნდა იყოს")
        .required("სახელის პარადიგმა არჩეული უნდა იყოს")
        .default(0),
    })
    .default(null),
});
