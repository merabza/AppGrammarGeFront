//RootDataTypeAndSchema.ts

import { NavigateFunction } from "react-router-dom";
import * as yup from "yup";

export interface RootData extends yup.InferType<typeof rootDataSchema> {
  root: RootCrudModel;
  basePhoneticsCombDetails: number[];
}

export interface CreateUpdateRootData {
  rootData: RootData;
  navigate: NavigateFunction;
}

export interface RootCrudModel {
  rootId: number;
  rootName: string;
  rootHomonymIndex: number;
  rootNote: string | null;
  recordStatusId: number;
  classifierId: number;
  creator: string;
}

export const rootDataSchema = yup.object().shape({
  root: yup.object().shape({
    rootId: yup.number().integer().default(0).required(),
    classifierId: yup.number().integer().default(0),
    rootName: yup
      .string()
      .required("ძირის სახელი შევსებული უნდა იყოს")
      .max(50, "ძირის სახელის სიგრძე არ შეიძლება იყოს 50 სიმბოლოზე მეტი")
      .default(""),
    rootHomonymIndex: yup
      .number()
      .integer()
      .min(0, "ომონიმიის ინდექსი შეიძლება იყოს დადებითი, ან 0")
      .required("ომონიმიის ინდექსი შევსებული უნდა იყოს")
      .default(0),
    rootNote: yup
      .string()
      .max(255, "შენიშვნის სიგრძე არ შეიძლება იყოს 255 სიმბოლოზე მეტი")
      .default("")
      .nullable(),
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
        .positive("გამოყოფილ უჯრაში ფონეტიკური ცვლილება არჩეული უნდა იყოს")
        .default(0)
        .required()
    ),
});
