//PhoneticsTypeEditFormData.ts

import * as yup from "yup";
import { PhoneticsType, PhoneticsTypeProhibition } from "../masterData/mdTypes";
import { NavigateFunction } from "react-router-dom";

export interface PhoneticsTypeEditFormData
  extends yup.InferType<typeof phoneticsTypeEditFormDataSchema> {
  phoneticsType: PhoneticsType;
  phoneticsOptionIds: number[];
  phoneticsTypeProhibitions: PhoneticsTypeProhibition[];
}

export interface CreateUpdatePhoneticsTypeEditFormData {
  phoneticsTypeEditFormData: PhoneticsTypeEditFormData;
  navigate: NavigateFunction;
}

//5. სარედაქტირებელი ობიექტის სქემა
export const phoneticsTypeEditFormDataSchema = yup.object().shape({
  phoneticsType: yup.object().shape({
    phtId: yup.number().integer().default(0),
    phtName: yup
      .string()
      .required("ფონეტიკური ტიპის სახელი შევსებული უნდა იყოს")
      .default(""),
    phtLastLetter: yup.number().integer().default(2),
    phtDistance: yup
      .number()
      .integer()
      .required("დისტანცია შევსებული უნდა იყოს")
      .default(1),
    phtNote: yup.string().nullable().default(""),
    phtSlab: yup.number().integer().default(0), //.required("მარცვლების რაოდენობის განსაზღვრის წესი არჩეული უნდა იყოს")
    phtSlabCount: yup
      .number()
      .integer()
      .required("მარცვლების რაოდენობა შევსებული უნდა იყოს")
      .default(0),
  }),
  //ფონეტიკური ვარიანტები
  phoneticsOptionIds: yup
    .array()
    .required("ფონეტიკური ვარიანტი ერთი მაინც უნდა იყოს არჩეული")
    .ensure()
    .min(1, "ერთი მაინც ფონეტიკური ვარიანტი არჩეული უნდა იყოს")
    .of(
      yup
        .number()
        .integer()
        .positive("ფონეტიკური ვარიანტი არჩეული უნდა იყოს")
        .required("ფონეტიკური ვარიანტი არჩეული უნდა იყოს")
    ),
  //ფონეტიკური შეზღუდვები
  phoneticsTypeProhibitions: yup
    .array()
    .ensure()
    .of(
      yup.object().shape({
        phtpId: yup.number().integer().default(0),
        phoneticsTypeId: yup.number().integer().default(0),
        phtpProhOrd: yup.number().integer().default(0), //შეზღუდვის რიგითი ნომერი
        phtpProhId: yup.number().integer().default(0), //შეზღუდვის ტიპი 0-იყოს;1-იყოს ერთ-ერთი;2-არ იყოს
        phtpOrient: yup.number().integer().default(0), //ორიენტაცია 0-ბოლოდან; 1-თავიდან
        phtpStart: yup.number().integer().default(0), //აღნიშნავს იმ სიმბოლოს ნომერს, რომლიდანაც განვიხილავთ სიმბოლოებს
        phtpCount: yup.number().integer().default(1), //აღნიშნავს ჩვენთვის საინტერესო სომბოლოების რაოდენობას.
        phtpObject: yup.number().integer().default(0), //ობიექტის ტიპი: 0-ბგერა; 1-ხმოვანი; 2-თანხმოვანი
        phtpNew: yup
          .string()
          .nullable()
          .default("")
          .when(
            ["phtpProhId", "phtpObject"],
            ([phtpProhId, phtpObject], schema) => {
              if (phtpProhId === 1 || !phtpObject)
                return schema.required(
                  'როცა შეზღუდვის ტიპი არჩეულია "იყოს ერთ-ერთი", ან ობიექტი არჩეულია "ბგერა", სიმბოლო(ები) შევსებული უნდა იყოს'
                );
              return schema;
            }
          ),
      })
    ),
});
