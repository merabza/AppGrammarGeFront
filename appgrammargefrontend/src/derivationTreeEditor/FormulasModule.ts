//FormulasModule.ts

//FormulasModule.ts
import type { Morpheme, MorphemeRange } from "../masterData/mdTypes";
import type { Err } from "../appcarcass/redux/types/errorTypes";

export interface FormulaFormDataType {
    error: Err | null;
    ranges: MorphemeRange[];
    morphemes: number[];
}

export function createFormulaFormData(
    ranges: MorphemeRange[],
    morphemes: number[],
    rangesInGroup: MorphemeRange[],
    morphemeIds: number[],
    morphemesQuery: Morpheme[],
    forFreeMorphems = false,
    forInflection = false
): FormulaFormDataType {
    // console.log(
    //   "FormulasModule createFormulaFormData {ranges, morphemes, rangesInGroup, morphemeIds, morphemesQuery, forFreeMorphems, forInflection}=",
    //   {
    //     ranges,
    //     morphemes,
    //     rangesInGroup,
    //     morphemeIds,
    //     morphemesQuery,
    //     forFreeMorphems,
    //     forInflection,
    //   }
    // );
    // debugger;
    //თუ არ არის შევქმნათ ფორმის ინფორმაცია, თუ არის დავაკოპიროთ ლოკალურ ცვლადში

    const formData = {
        ranges: ranges,
        morphemes: morphemes,
        error: null,
    } as FormulaFormDataType;

    // const filteredRanges = forFreeMorphems ? rangesInGroup.filter(f=>f.mrBaseNom === null) : rangesInGroup;
    //დავიმახსოვროთ რანგების რაოდეონობა
    const mrLength = rangesInGroup.length;

    const newRangesInGroup = JSON.parse(
        JSON.stringify(rangesInGroup)
    ) as MorphemeRange[];

    // console.log(
    //   "FormulasModule createFormulaFormData newRangesInGroup=",
    //   newRangesInGroup
    // );

    //დავითვალოთ დასაშვები მინიმუმები და მაქსიმუბი
    //თან გზაში უნდა შემოწმდეს რამდენიმე რამე:
    //1. მორფემა უნდა ეკუთვნოდეს ერთერთ რანგს, რომელიც შეესაბამება დერივაციის ტიპის ჯგუფს
    //2. თუ მორფემა რანგის მიხედვით ფუძეა, მისი ნომერი უნდა იყოს ერთი. მაგრამ თუ არააუცილებელი მორფემაა მაშინ შეიძლება იყოს 0-იც
    //3. თუ მორფმა არჩევითია, იმის ნომერი შეიძლება იყოს ან 0 ან (-1).
    newRangesInGroup.forEach((range, index, arr) => {
        const selectable = forInflection
            ? range.mrInflectionSelectable
            : range.mrSelectable;
        //რადგან ვიცით, რომ ზოგი რანგი შეიძლება არ იყოს რანგების სიაში, ამიტომ შემდეგ შემოწმებას აზრი ეკარგება
        // if ( range.mrPosition !== index )
        //   formData.errorData = "არასწორი მოდელი, გამოტოვებულია რანგი";
        if (range.mrBaseNom !== null && selectable)
            formData.error = {
                errorCode: "wrongModel",
                errorMessage:
                    "არასწორი მოდელი, ერთერთი რანგი გამოცხადებულია როგორც ფუძე და ერთდროულად როგორც ასარჩევი მორფემა",
            } as Err;
        if (range.mrBaseNom !== null) {
            if (range.mrBaseRequired) {
                arr[index].minNom = 1;
                arr[index].maxNom = 1;
            } else {
                arr[index].minNom = 0;
                arr[index].maxNom = 1;
            }
        } else {
            if (selectable) {
                arr[index].minNom = forFreeMorphems ? 0 : -1;
                arr[index].maxNom = 0;
                if (forFreeMorphems) {
                    const mfrnoms = morphemesQuery
                        .filter((mf) => mf.morphemeRangeId === range.mrId)
                        .map((mf) => mf.mrpNom);
                    arr[index].maxNom = Math.max(...mfrnoms);
                }
            } else {
                arr[index].minNom = 0;
                arr[index].maxNom = 0;
                if (!forFreeMorphems) {
                    const mfrnoms = morphemesQuery
                        .filter((mf) => mf.morphemeRangeId === range.mrId)
                        .map((mf) => mf.mrpNom);
                    arr[index].maxNom = Math.max(...mfrnoms);
                }
            }
        }
    });

    //დავაფიქსიროთ რანგების მასივი
    formData.ranges = newRangesInGroup;
    //მორფემების მასივი თუ ჯერ არ არსებობს შევქმნათ
    // if (!formData.morphemes) {
    //   formData.morphemes = [];
    // }
    // //დავაფიქსიროთ რანგების რაოდენობის მიხედვით მორფემების მასივის სიგრძე
    // formData.morphemes.length = mrLength;

    //ქვადა ციკლი გადასაკეთებელია ისე, როგორც ამ სტატიაშია მოცემული. პირველი პასუხის ბოლო ვარიანტი
    //Array.from({length: 5}, (v, i) => i)   // gives [0, 1, 2, 3, 4]
    //იგივე მეთოდი შესაძლებელია გამოვიყენოთ მასივის დაკოპირებისას, თუ სიგრძე არ იცვლება
    //https://stackoverflow.com/questions/4852017/how-to-initialize-an-arrays-length-in-javascript

    formData.morphemes = Array.from({ length: mrLength }, () => 0);
    // console.log(
    //   "FormulasModule createFormulaFormData formData.morphemes=",
    //   formData.morphemes
    // );

    // for (let i = 0; i < mrLength; i++) {
    //   if (formData.morphemes[i] === undefined) formData.morphemes[i] = 0;
    //   //console.log("FormulasModule createFormulaFormData setDerivationType formData.morphemes[i]=", formData.morphemes[i]);
    // }
    // formData.morphemes.forEach((item, index, arr) => {
    //   //console.log("FormulasModule createFormulaFormData setDerivationType formData.morphemes.forEach.item=", item);
    // });

    //ძირითადი ობიექტის მორფემების იდენტიფიკატორის მასივიდან სათითაოდ მოვათავსოთ იდენტიფიკატორიები ფორმის მასივში
    //, index, arr
    morphemeIds &&
        morphemeIds.forEach((item) => {
            const morpheme = item
                ? morphemesQuery.find((f) => f.mrpId === item)
                : null;
            const rangeIndex = morpheme
                ? newRangesInGroup.findIndex(
                      (f) => f.mrId === morpheme.morphemeRangeId
                  )
                : null;
            const range =
                rangeIndex != null ? newRangesInGroup[rangeIndex] : null;
            //თუ მორფემის იდენტიფიკატორის მიხედვით მორფემაც მოიშებნა და რანგიც
            //და ამავე დროს რანგში მორფემის ნომერი დასაშვებ ზღვრებშია
            if (
                morpheme &&
                range &&
                rangeIndex != null &&
                morpheme.mrpNom >= range.minNom &&
                morpheme.mrpNom <= range.maxNom
            ) {
                //მაშინ ეს იდენტიფიკატორი გადავინახოთ რედაქტორის შესაბამის უჯრაში
                formData.morphemes[rangeIndex] = item;
            }
            // else {//თუ მორფმეის იდენტიფიკატორი უვარგისია, გადავაგდოთ
            //   //ანუ საწყის მონაცემებშიც წავშალოთ
            //   arr[index] = null;
            // }
        });

    //თუ რომელიმე გაუქმდა ამოიყაროს მასივიდან
    //newForm.morphemeIds = newForm.morphemeIds.filter(f=>f !== null);
    // console.log(
    //   "FormulasModule createFormulaFormData setDerivationType newRangesInGroup=",
    //   newRangesInGroup
    // );
    // console.log(
    //   "FormulasModule createFormulaFormData setDerivationType formData.morphemes=",
    //   formData.morphemes
    // );
    //შემოწმდეს მორფემების მასივში შემავალი ელემენტები სათითაოდ
    formData.morphemes.forEach((item, index, arr) => {
        //და თუ რომელიმე ელემენტი ცარიელია, ან შეიცავს არაშესაბამისი რანგის მორფემას, ჩავსვათ შესაბამისი მორფემის იდენტიფიკატორი.
        const mrp = item ? morphemesQuery.find((f) => f.mrpId === item) : null;
        //const range = mrp ? newRangesInGroup.find((f)=> f.mrId === mrp.morphemeRangeId ) : null;
        const range = newRangesInGroup[index];

        // console.log(
        //   "FormulasModule createFormulaFormData setDerivationType index=",
        //   index
        // );
        // console.log(
        //   "FormulasModule createFormulaFormData setDerivationType mrp=",
        //   mrp
        // );
        // console.log(
        //   "FormulasModule createFormulaFormData setDerivationType range=",
        //   range
        // );

        if (
            !mrp ||
            mrp.morphemeRangeId !== range.mrId ||
            mrp.mrpNom < range.minNom ||
            mrp.mrpNom > range.maxNom
        ) {
            //თუ მინიმუმსა და მაქსიმუმს შორი 0 არ არის, მაშინ ავიღოთ მოდულით ნაკლები
            //თავიდან დავუშვათ, რომ 0 ყველაზე კარგი ვარიანტია
            let newMrpNom = 0;
            if (range.maxNom < 0) newMrpNom = range.maxNom;
            if (range.minNom > 0) newMrpNom = range.minNom;
            const mrp2 = morphemesQuery.find(
                (f) =>
                    f.morphemeRangeId === range.mrId && f.mrpNom === newMrpNom
            );
            // console.log(
            //   "FormulasModule createFormulaFormData setDerivationType mrp2=",
            //   mrp2
            // );
            if (mrp2) arr[index] = mrp2.mrpId;
        }
    });
    return formData;
}
