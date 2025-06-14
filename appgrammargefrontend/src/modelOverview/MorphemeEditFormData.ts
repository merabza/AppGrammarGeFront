//MorphemeEditFormData.ts

import * as yup from "yup";
import type { Morpheme } from "../masterData/mdTypes";
import type { NavigateFunction } from "react-router-dom";

export interface MorphemeEditFormData
    extends yup.InferType<typeof morphemeEditFormDataSchema> {
    morpheme: Morpheme;
    phoneticsChangesLength: number;
    phoneticsOptionMorphemeIds: number[];
    morphemeOccasionPhoneticsChangeIds: number[];
}

export interface CreateUpdateMorphemeEditFormData {
    morphemeEditFormData: MorphemeEditFormData;
    navigate: NavigateFunction;
}

//5. სარედაქტირებელი ობიექტის სქემა
export const morphemeEditFormDataSchema = yup.object().shape({
    morpheme: yup.object().shape({
        mrpId: yup.number().default(0),
        morphemeRangeId: yup
            .number()
            .integer()
            .positive("რანგი არჩეული უნდა იყოს")
            .required("რანგი არჩეული უნდა იყოს")
            .default(0),
        mrpNom: yup
            .number()
            .integer()
            .required("მორფემის ნომერი შევსებული უნდა იყოს")
            .default(0),
        mrpMorpheme: yup
            .string()
            .required("მორფემა შევსებული უნდა იყოს")
            .default(""),
        phoneticsTypeId: yup
            .number()
            .nullable()
            .transform((v, o) => (o === null ? 0 : v))
            .integer()
            .min(0)
            .default(0),
    }),
    phoneticsChangesLength: yup.number().default(0),
    phoneticsOptionMorphemeIds: yup
        .array()
        .ensure()
        .when("phoneticsChangesLength", ([phoneticsChangesLength], schema) => {
            const lengt = phoneticsChangesLength ? phoneticsChangesLength : 0;
            return schema
                .min(
                    lengt,
                    `მორფემების ფონეტიკური ვარიანტები შევსებული უნდა იყოს`
                )
                .max(
                    lengt,
                    `მორფემების ფონეტიკური ვარიანტები შევსებული უნდა იყოს`
                );
        })
        .of(
            yup
                .number()
                .integer()
                .positive("მორფემის ფონეტიკური ვარიანტი არჩეული უნდა იყოს")
                .default(0)
                .required("მორფემის ფონეტიკური ვარიანტი არჩეული უნდა იყოს")
        ),
    morphemeOccasionPhoneticsChangeIds: yup
        .array()
        .ensure()
        .of(
            yup
                .number()
                .integer()
                .positive("მორფემის ფონეტიკური შესაძლებლობა არჩეული უნდა იყოს")
                .default(0)
                .required("მორფემის ფონეტიკური შესაძლებლობა არჩეული უნდა იყოს")
        ),
});
