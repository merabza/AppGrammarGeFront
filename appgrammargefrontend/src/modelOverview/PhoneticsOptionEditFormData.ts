//PhoneticsOptionEditFormData.ts

import * as yup from "yup";
import type {
    PhoneticsOption,
    PhoneticsOptionDetail,
} from "../masterData/mdTypes";
import type { NavigateFunction } from "react-router-dom";

export interface PhoneticsOptionEditFormData
    extends yup.InferType<typeof phoneticsOptionEditFormDataSchema> {
    phoneticsOption: PhoneticsOption;
    phoneticsOptionDetails: PhoneticsOptionDetail[];
}

export interface CreateUpdatePhoneticsOptionEditFormData {
    phoneticsOptionEditFormData: PhoneticsOptionEditFormData;
    navigate: NavigateFunction;
}

//5. სარედაქტირებელი ობიექტის სქემა
export const phoneticsOptionEditFormDataSchema = yup.object().shape({
    phoneticsOption: yup.object().shape({
        phoId: yup.number().default(0),
        phoName: yup
            .string()
            .required("ფონეტიკური ვარიანტის სახელი შევსებული უნდა იყოს")
            .default(""),
    }),
    //ფონეტიკური შეზღუდვები
    phoneticsOptionDetails: yup
        .array()
        .required("ფონეტიკური ვარიანტის ერთი მაინც დეტალი უნდა არსებობდეს")
        .ensure()
        .min(1, "უნდა არსებობდეს ერთი მაინც ფონეტიკური მოქმდების დეტალი")
        .of(
            yup.object().shape({
                phodId: yup.number().default(0),
                phodActOrd: yup.number().default(0), //მოქმედების რიგითი ნომერი
                phodActId: yup.number().default(0), //მოქმედების ტიპი 0-იკარგება/ჩაენაცვლება; 1-ჩნდება
                phodOrient: yup.number().default(0), //ორიენტაცია 0-ბოლოდან; 1-თავიდან
                phodStart: yup.number().default(0), //აღნიშნავს იმ სიმბოლოს ნომერს, რომლიდანაც განვიხილავთ სიმბოლოებს
                phodCount: yup.number().default(1), //აღნიშნავს ჩვენთვის საინტერესო სომბოლოების რაოდენობას.
                phodObject: yup.number().default(0), //ობიექტის ტიპი: 0-ბგერა; 1-ხმოვანი; 2-თანხმოვანი
                //ჩანმაცვლებელი, ან ახალი სიმბოლოების თანმიმდევრობა
                phodNew: yup
                    .string()
                    .nullable()
                    .default("")
                    .when(
                        ["phodActId", "phodObject"],
                        ([phodActId, phodObject], schema) => {
                            if (phodActId === 1 || !phodObject)
                                return schema.required(
                                    'როცა მოქმედების ტიპი არჩეულია "ჩნდება", ან ობიექტი არჩეულია "ბგერა", სიმბოლო(ები) შევსებული უნდა იყოს'
                                );
                            return schema;
                        }
                    ),
            })
        ),
});
