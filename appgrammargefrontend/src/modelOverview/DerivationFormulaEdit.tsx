//DerivationFormulaEdit.tsx

import { useState, useEffect, useCallback, useMemo, type FC } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import type {
    DerivationType,
    Morpheme,
    MorphemeRange,
    MorphemeRangeByDerivationType,
    PhoneticsType,
} from "../masterData/mdTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useForman } from "../appcarcass/hooks/useForman";
import {
    type DerivationFormulaFormData,
    DerivationFormulaFormDataSchema,
} from "./DerivationFormulaFormData";
import { createFormulaFormData } from "../derivationTreeEditor/FormulasModule";
import { useNavigate, useParams } from "react-router-dom";
import AlertMessages from "../appcarcass/common/AlertMessages";
import {
    EAlertKind,
    clearAllAlerts,
} from "../appcarcass/redux/slices/alertSlice";
import WaitPage from "../appcarcass/common/WaitPage";
import type { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import EditorHeader from "../appcarcass/editorParts/EditorHeader";
import OnePlaintextRow from "../appcarcass/editorParts/OnePlaintextRow";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import { getFormulaVisual2 } from "./FormulasModule";
import OneCheckBoxControl from "../appcarcass/editorParts/OneCheckBoxControl";
import OneTextControl from "../appcarcass/editorParts/OneTextControl";
import OneSaveCancelButtons from "../appcarcass/editorParts/OneSaveCancelButtons";
import OneErrorRow from "../appcarcass/editorParts/OneErrorRow";
import { useClearTablesFromRepo } from "../appcarcass/masterdata/masterDataHooks/useClearTablesFromRepo";
import {
    useCreateDerivationFormulaMutation,
    useDeleteDerivationFormulaMutation,
    useLazyGetOneDerivationFormulaByIdQuery,
    useUpdateDerivationFormulaMutation,
} from "../redux/api/derivationFormulasCrudApi";
import { useAlert } from "../appcarcass/hooks/useAlert";
import { clearDerivFormulas } from "../redux/slices/modelDataSlice";
import { ETableName } from "../masterData/tableNames";

const DerivationFormulaEdit: FC = () => {
    const navigate = useNavigate();

    //1. იდენტიფიკატორი
    const [curDfIdVal, setCurDfIdVal] = useState<number | undefined>(undefined);

    const dispatch = useAppDispatch();

    const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
        useAppSelector((state) => state.masterDataState);

    const morphemeRanges = mdataRepo[
        ETableName.MorphemeRanges
    ] as MorphemeRange[];
    const morphemesQuery = mdataRepo[ETableName.MorphemesQuery] as Morpheme[];
    const derivationTypes = mdataRepo[
        ETableName.DerivationTypes
    ] as DerivationType[];
    const phoneticsTypes = mdataRepo[
        ETableName.PhoneticsTypes
    ] as PhoneticsType[];
    const morphemeRangesByDerivationTypes = mdataRepo[
        ETableName.MorphemeRangesByDerivationTypes
    ] as MorphemeRangeByDerivationType[];
    const [morphemes, setMorphemes] = useState<number[]>([] as number[]);

    // console.log("DerivationFormulaEdit morphemes=", morphemes);

    const [ranges, setRanges] = useState<MorphemeRange[]>(
        [] as MorphemeRange[]
    );
    const dataTypesState = useAppSelector((state) => state.dataTypesState);
    const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;
    const [clearTables] = useClearTablesFromRepo();

    const [
        getOneDerivationFormulaById,
        { isLoading: loadingDerivationFormula },
    ] = useLazyGetOneDerivationFormulaByIdQuery();

    const { derivationFormulaForEdit } = useAppSelector(
        (state) => state.derivationFormulasCrudState
    );

    const [createDerivationFormula, { isLoading: creatingDerivationFormula }] =
        useCreateDerivationFormulaMutation();
    const [updateDerivationFormula, { isLoading: updatingDerivationFormula }] =
        useUpdateDerivationFormulaMutation();
    const [
        deleteDerivationFormula,
        { isLoading: deletingDerivationFormula, isError: DeleteFailure },
    ] = useDeleteDerivationFormulaMutation();

    //const { datatypesLoading, datatypes } = masterData;

    // console.log("DerivationFormulaEdit morphemeRanges=", morphemeRanges);
    // console.log(
    //   "DerivationFormulaEdit morphemeRangesByDerivationTypes=",
    //   morphemeRangesByDerivationTypes
    // );

    //3. ეს არის ის ცხრილები, რომელზეც მოქმედებს ეს კონკრეტული რედაქტორი
    const tableNamesForClear = useMemo(
        () => [ETableName.DerivationFormulasQuery],
        []
    );

    //4. ეს არის ის ცხრილები, რომლებიდანაც ინფორმაცია სჭირდება ამ რედაქტრს
    const tableNamesForLoad = useMemo(
        () => [
            ETableName.MorphemeRanges,
            ETableName.MorphemesQuery,
            ETableName.DerivationTypes,
            ETableName.PhoneticsTypes,
            ETableName.MorphemeRangesByDerivationTypes,
        ],
        []
    );
    const [checkLoadMdTables] = useCheckLoadMdTables();

    useEffect(() => {
        checkLoadMdTables(tableNamesForLoad);
    }, [tableNamesForLoad]);

    //console.log("DerivationFormulaEdit yupSchema=", yupSchema);

    //6. ფორმის მენეჯერი
    const [
        frm,
        changeField,
        getError,
        getAllErrors,
        clearToDefaults,
        setFormData,
    ] = useForman<
        typeof DerivationFormulaFormDataSchema,
        DerivationFormulaFormData
    >(DerivationFormulaFormDataSchema);

    function clearUsedTables() {
        clearTables(tableNamesForClear, tableNamesForLoad);
        dispatch(clearDerivFormulas());
    }

    const copyMorphemsToMainData = useCallback(
        (forForm: DerivationFormulaFormData, morphemes: number[]) => {
            const newForm = JSON.parse(
                JSON.stringify(forForm)
            ) as DerivationFormulaFormData;

            newForm.morphemeIds = morphemes
                .map((mrpId) => {
                    return mrpId
                        ? morphemesQuery.find((f) => f.mrpId === mrpId)
                        : null;
                })
                .filter((f): f is Morpheme => !!f && !!f.mrpNom)
                .map((m) => m.mrpId);

            //გავუგზავნოთ ახალი ფორმა ფორმის მენეჯერს.
            return newForm;
        },
        [morphemesQuery]
    );

    const setDerivationType = useCallback(
        (
            curForm: DerivationFormulaFormData,
            newDerivationTypeId: number
        ): DerivationFormulaFormData | undefined => {
            //თუ საჭირო ინფორმაცია ჯერ ჩატვირთული არ არის, მაშIნ გაგრეძელებას აზრი არ აქვს
            if (
                !derivationTypes ||
                !morphemeRanges ||
                !morphemesQuery ||
                !morphemeRangesByDerivationTypes
            )
                return;

            //დავამზადოთ ფორმის ახალი ობიექტი
            const newForm = JSON.parse(
                JSON.stringify(curForm)
            ) as DerivationFormulaFormData; // { ...curForm } as InflectionData;
            //დერივაციის ტიპის პოვნას აზრი აქვს მხოლოდ იმ შემთხვევაში, თუ დერივაციიც ტიპების ცხრილი ჩატვირთულია
            //მოვძებნოთ დერივაციის ტიპის შესაბამისი ობიექტი
            const derivType = derivationTypes.find(
                (f) => f.drtId === newDerivationTypeId
            );

            if (!derivType) return;

            //ამოვკრიბოთ იმ რანგების შესახებ ინფორმაცია, რომლებიც მონაწილეობენ ამ ტიპის დერივაციის ფორმირებაში
            const MorphemeRangeIdsByDT = morphemeRangesByDerivationTypes
                .filter((f) => f.derivationTypeId === newDerivationTypeId)
                .map((m) => m.morphemeRangeId);
            //დერივაციის ტიპში მითითებული ჯგუფის მიხედვით ამოვკრიბოთ რანგების შესაბამისი ობიექტები
            //თან გავითვალისწინოთ რომ ამ დერივაციის ტიპში ეს რანგი უნდა მონაწილეობდეს თუ არა
            const rangesInGroup = morphemeRanges
                .filter(
                    (f) =>
                        f.morphemeGroupId === derivType.morphemeGroupId &&
                        MorphemeRangeIdsByDT.includes(f.mrId)
                )
                .sort((a, b) => a.mrPosition - b.mrPosition);

            // console.log(
            //   "DerivationFormulaEdit setDerivationType MorphemeRangeIdsByDT=",
            //   MorphemeRangeIdsByDT
            // );

            // console.log(
            //   "DerivationFormulaEdit setDerivationType rangesInGroup=",
            //   rangesInGroup
            // );

            // console.log(
            //   "DerivationFormulaEdit setDerivationType newDerivationTypeId=",
            //   newDerivationTypeId
            // );

            //დავაფიქსიროთ დერივაციის ტიპი
            newForm.derivationFormula.derivationTypeId = newDerivationTypeId;

            const formulaFormDataType = createFormulaFormData(
                ranges,
                morphemes,
                rangesInGroup,
                newForm.morphemeIds,
                morphemesQuery
            );

            // console.log(
            //   "DerivationFormulaEdit formulaFormDataType.morphemes=",
            //   formulaFormDataType.morphemes
            // );
            // console.log(
            //   "DerivationFormulaEdit formulaFormDataType.ranges=",
            //   formulaFormDataType.ranges
            // );
            setMorphemes(formulaFormDataType.morphemes);
            setRanges(formulaFormDataType.ranges);

            //გავუგზავნოთ ახალი ფორმა ფორმის მენეჯერს.

            // console.log("DerivationFormulaEdit setDerivationType newForm=", newForm);
            const newFormWithMorphemes = copyMorphemsToMainData(
                newForm,
                formulaFormDataType.morphemes
            );

            return newFormWithMorphemes;
        },
        [
            morphemes,
            ranges,
            derivationTypes,
            morphemeRanges,
            morphemesQuery,
            morphemeRangesByDerivationTypes,
        ]
    );

    const { dfId: fromParamsDfId } = useParams<string>();

    //7. იდენტიფიკატორის ეფექტი
    useEffect(() => {
        const dfIdVal = fromParamsDfId ? parseInt(fromParamsDfId) : 0;

        //ვამოწმებთ მისამართში შეიცვალა თუ არა იდენტიფიკატორი
        if (curDfIdVal !== dfIdVal) {
            //შეცვლილა
            //დავიმახსოვროთ შეცვლილი იდენტიფიკატორი
            setCurDfIdVal(dfIdVal);
            if (dfIdVal) {
                //თუ იდენტიფიკატორი კარგია, ჩავტვირთოთ ბაზიდან ინფორმაცია
                getOneDerivationFormulaById(dfIdVal);
                return;
            }
            //ახალი სარედაქტირებელი ობიექტის შექმნა
            clearToDefaults();
            return;
        }

        //აქ თუ მოვედით, ესეიგი იდენტიფიკატორი იგივეა და კომპონენტის თვისებები შეიცვალა
        //ანუ სავარაუდოდ ჩატვირთვა დამთავრდა
        //თუმცა მაინც უნდა დავრწმუნდეთ
        //ან თუ ახალი ჩანაწერი იქნება, ჩატვირთვას არ ველოდებით
        //ან თუ ჩატვირთვა კი დასრულდა, მაგრამ ჩატვირთული ობიექტი მაინც შევამოწმოთ
        if (
            loadingDerivationFormula ||
            !curDfIdVal ||
            !derivationFormulaForEdit ||
            mdWorkingOnLoad ||
            Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
            !derivationTypes ||
            !morphemeRanges ||
            !morphemesQuery ||
            !morphemeRangesByDerivationTypes
        )
            return;

        const newForm = setDerivationType(
            derivationFormulaForEdit,
            derivationFormulaForEdit.derivationFormula.derivationTypeId
        );
        if (newForm) setFormData(newForm);
    }, [
        curDfIdVal,
        derivationFormulaForEdit,
        loadingDerivationFormula,
        mdWorkingOnLoad,
        mdWorkingOnLoadingTables,
        derivationTypes,
        morphemeRanges,
        morphemesQuery,
        morphemeRangesByDerivationTypes,
    ]);

    const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

    if (ApiLoadHaveErrors)
        return (
            <div>
                <h5>ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );

    //8. ჩატვირთვის შემოწმება
    if (
        loadingDerivationFormula ||
        mdWorkingOnLoad ||
        Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s)
    )
        //თუ ინფორმაციის ჩატვირთვა ჯერ კიდევ მიმდინარეობა
        return <WaitPage />;

    const dataType = dataTypes.find((f) => f.dtTable === "derivationFormulas");

    //თუ იდენტიფიკატორი წესიერია და ჩატვირთული ობიექტი ჯერ არ არის, ან საჭირო ცხრილები ჩატვირთული არ არის
    if (
        !dataType ||
        !frm ||
        !frm.morphemeIds ||
        (curDfIdVal && !derivationFormulaForEdit) ||
        !morphemeRanges ||
        !morphemesQuery ||
        !derivationTypes ||
        !phoneticsTypes ||
        !morphemeRangesByDerivationTypes ||
        !dataTypes
    ) {
        return (
            <div>
                <h5>ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );
    }

    //9. შეცდომების შესახებ ინფორმაცია გამოიყენება საბმიტის ფუნქციაში
    const allErrors = getAllErrors();
    const haveErrors = allErrors !== "";

    //10. საბმიტის ფუნქცია
    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        dispatch(clearAllAlerts());
        if (haveErrors) return;

        //გადავიტანოთ ფორმის მონაცემები ძირითად მონაცემებში
        //წავშალოთ ფორმის ინფორმაცია, რადგან ის საჭირო არ არის შენახვისას

        const currentForm = JSON.parse(
            JSON.stringify(frm)
        ) as DerivationFormulaFormData;

        if (currentForm.derivationFormula.dfAutoPhoneticsType === 0)
            currentForm.derivationFormula.dfAutoPhoneticsType = null;

        if (curDfIdVal)
            updateDerivationFormula({
                derivationFormulaFormData: currentForm,
                navigate,
            });
        else
            createDerivationFormula({
                derivationFormulaFormData: currentForm,
                navigate,
            });
        clearUsedTables();
    }

    // console.log("DerivationFormulaEdit frm=", frm);

    return (
        <Row>
            <Col md="6">
                <AlertMessages alertKind={EAlertKind.ClientRunTime} />
                <Form onSubmit={handleSubmit}>
                    <EditorHeader
                        curIdVal={curDfIdVal}
                        EditorName="დერივაციის ფორმულა"
                        EditorNameGenitive="დერივაციის ფორმულის"
                        EditedObjectName={
                            frm &&
                            frm.derivationFormula &&
                            frm.derivationFormula.formulaName
                                ? frm.derivationFormula.formulaName
                                : ""
                        }
                        workingOnDelete={deletingDerivationFormula}
                        DeleteFailure={DeleteFailure}
                        onDelete={() => {
                            if (!!curDfIdVal)
                                deleteDerivationFormula({
                                    dfId: curDfIdVal,
                                    navigate,
                                });
                            clearUsedTables();
                        }}
                        allowDelete={dataType.delete}
                    />
                    <OnePlaintextRow
                        controlId="result"
                        label="შედეგი"
                        text={getFormulaVisual2(
                            frm.morphemeIds,
                            ranges,
                            morphemesQuery
                        )}
                    />
                    <OneStrongLabel
                        controlId="mainParametersLabel"
                        label="მთავარი პარამეტრები"
                    />
                    <OneComboBoxControl
                        controlId="derivationFormula.derivationTypeId"
                        label="დერივაციის ტიპი"
                        value={frm.derivationFormula.derivationTypeId}
                        dataMember={derivationTypes.filter(
                            (f) => !f.drtAutomatic
                        )}
                        valueMember="drtId"
                        displayMember="drtName"
                        getError={getError}
                        onChangeValue={(fieldPath, value) => {
                            setDerivationType(frm, value);
                        }}
                        firstItem={{ id: 0, name: "აირჩიეთ დერივაციის ტიპი" }}
                    />
                    <OneCheckBoxControl
                        controlId="derivationFormula.dfAutoNounInflection"
                        label="სახელის ავტომატური ფლექსია"
                        value={frm.derivationFormula.dfAutoNounInflection}
                        getError={getError}
                        onChangeValue={changeField}
                    />
                    <OneComboBoxControl
                        controlId="derivationFormula.dfAutoPhoneticsType"
                        label="ავტომატური ფონეტიკური ტიპი"
                        value={frm.derivationFormula.dfAutoPhoneticsType}
                        dataMember={phoneticsTypes}
                        valueMember="phtId"
                        displayMember="phtName"
                        getError={getError}
                        onChangeValue={changeField}
                        firstItem={{ id: 0, name: "უცვლელი" }}
                    />
                    <OneTextControl
                        controlId="derivationFormula.formulaName"
                        label="ფორმულის სახელი"
                        value={frm.derivationFormula.formulaName}
                        getError={getError}
                        onChangeValue={changeField}
                    />
                    <OneStrongLabel
                        controlId="morphemes"
                        label="მორფემები რანგების მიხედვით"
                    />
                    {ranges.map((range, index) => {
                        return (
                            <OneComboBoxControl
                                key={index}
                                controlId={`morphemes[${index}]`}
                                label={`${range.mrPosition + 1}. ${
                                    range.mrName
                                }`}
                                value={morphemes[index]}
                                dataMember={morphemesQuery.filter(
                                    (mph) =>
                                        mph.morphemeRangeId === range.mrId &&
                                        mph.mrpNom >= range.minNom &&
                                        mph.mrpNom <= range.maxNom
                                )}
                                valueMember="mrpId"
                                displayMember="mrpName"
                                sortByDisplayMember={false}
                                getError={getError}
                                onChangeValue={(fieldPath, value) => {
                                    const newForm = JSON.parse(
                                        JSON.stringify(frm)
                                    ) as DerivationFormulaFormData;

                                    morphemes[index] = value;
                                    // //გავუგზავნოთ ახალი ფორმა ფორმის მენეჯერს.
                                    copyMorphemsToMainData(newForm, morphemes);
                                }}
                            />
                        );
                    })}
                    <OneSaveCancelButtons
                        curIdVal={curDfIdVal}
                        haveErrors={haveErrors}
                        savingNow={
                            creatingDerivationFormula ||
                            updatingDerivationFormula
                        }
                        onCloseClick={() => {
                            dispatch(clearAllAlerts());
                            navigate(-1); //goBack
                        }}
                        allowEdit={dataType.update}
                    />
                    <OneErrorRow allErrors={allErrors} />
                </Form>
            </Col>
        </Row>
    );
};

export default DerivationFormulaEdit;
