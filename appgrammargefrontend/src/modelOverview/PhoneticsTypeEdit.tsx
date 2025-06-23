//PhoneticsTypeEdit.tsx

import { useState, useEffect, useMemo, type FC } from "react";
import { Form, Row, Col } from "react-bootstrap";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import {
    type PhoneticsTypeEditFormData,
    phoneticsTypeEditFormDataSchema,
} from "./PhoneticsTypeEditFormData";
import { useForman } from "../appcarcass/hooks/useForman";
import { useClearTablesFromRepo } from "../appcarcass/masterdata/masterDataHooks/useClearTablesFromRepo";
import {
    useCreatePhoneticsTypeMutation,
    useDeletePhoneticsTypeMutation,
    useLazyGetOnePhoneticsTypeByIdQuery,
    useUpdatePhoneticsTypeMutation,
} from "../redux/api/modelEditorPhoneticsTypesCrudApi";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import WaitPage from "../appcarcass/common/WaitPage";
import type {
    PhoneticsOption,
    PhoneticsTypeProhibition,
} from "../masterData/mdTypes";
import type { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import AlertMessages from "../appcarcass/common/AlertMessages";
import {
    EAlertKind,
    clearAllAlerts,
} from "../appcarcass/redux/slices/alertSlice";
import EditorHeader from "../appcarcass/editorParts/EditorHeader";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import OneTextControl from "../appcarcass/editorParts/OneTextControl";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import OneNumberControl from "../appcarcass/editorParts/OneNumberControl";
import OnePlusButton from "../appcarcass/editorParts/OnePlusButton";
import { GetOnePhoneticsTypeProhibitionDescription } from "./PhoneticsTypeModule";
import OneSaveCancelButtons from "../appcarcass/editorParts/OneSaveCancelButtons";
import OneErrorRow from "../appcarcass/editorParts/OneErrorRow";
import OneUpDownButtons from "../appcarcass/editorParts/OneUpDownButtons";
import OneEditDeleteButtons from "../appcarcass/editorParts/OneEditDeleteButtons";
import { useAlert } from "../appcarcass/hooks/useAlert";
import { ETableName } from "../masterData/tableNames";

const PhoneticsTypeEdit: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [curPhtIdVal, setCurPhtIdVal] = useState<number | undefined>(
        undefined
    ); //1. იდენტიფიკატორი
    const [expandedProhibitionIndex, setExpandedProhibitionIndex] = useState<
        number | null
    >(null); //გახსნილი აკრძალვის ნომერი

    const { phtId } = useParams<string>();

    //3. ეს არის ის ცხრილები, რომელზეც მოქმედებს ეს კონკრეტული რედაქტორი
    const tableNamesForClear = useMemo(
        () => [
            ETableName.PhoneticsTypes,
            ETableName.PhoneticsTypeProhibitions,
            ETableName.PhoneticsChanges,
        ],
        []
    );

    const { phoneticsTypeForEdit } = useAppSelector(
        (state) => state.modelEditorPhoneticsTypesCrudState
    );

    //4. ეს არის ის ცხრილები, რომლებიდანაც ინფორმაცია სჭირდება ამ რედაქტრს
    const tableNamesForLoad = useMemo(() => [ETableName.PhoneticsOptions], []);

    const [checkLoadMdTables] = useCheckLoadMdTables();
    const [clearTables] = useClearTablesFromRepo();

    const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
        useAppSelector((state) => state.masterDataState);
    const phoneticsOptions = mdataRepo[
        ETableName.PhoneticsOptions
    ] as PhoneticsOption[];

    const dataTypesState = useAppSelector((state) => state.dataTypesState);
    const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

    const [createPhoneticsType, { isLoading: creatingPhoneticsType }] =
        useCreatePhoneticsTypeMutation();
    const [updatePhoneticsType, { isLoading: updatingPhoneticsType }] =
        useUpdatePhoneticsTypeMutation();
    const [
        deletePhoneticsType,
        { isLoading: workingOnDeletePhoneticsType, isError: DeleteFailure },
    ] = useDeletePhoneticsTypeMutation();

    useEffect(() => {
        checkLoadMdTables(tableNamesForLoad);
    }, [
        // checkLoadMdTables,
        tableNamesForLoad,
        // mdWorkingOnLoad,
        // datatypesLoading,
        // datatypes,
    ]);

    //6. ფორმის მენეჯერი
    const [
        frm,
        changeField,
        getError,
        getAllErrors,
        clearToDefaults,
        setFormData,
    ] = useForman<
        typeof phoneticsTypeEditFormDataSchema,
        PhoneticsTypeEditFormData
    >(phoneticsTypeEditFormDataSchema);

    function clearUsedTables() {
        clearTables(tableNamesForClear, tableNamesForLoad);
    }

    const [getOnePhoneticsTypeById, { isLoading: loadingPhoneticsType }] =
        useLazyGetOnePhoneticsTypeByIdQuery();

    //7. იდენტიფიკატორის ეფექტი
    useEffect(() => {
        const phtIdVal = phtId ? parseInt(phtId) : 0;
        //console.log("PhoneticsTypeEdit useEffect phtIdVal=", phtIdVal);

        //ვამოწმებთ მისამართში შეიცვალა თუ არა იდენტიფიკატორი
        if (curPhtIdVal !== phtIdVal) {
            //შეცვლილა
            //დავიმახსოვროთ შეცვლილი იდენტიფიკატორი
            setCurPhtIdVal(phtIdVal);
            if (phtIdVal) {
                //თუ იდენტიფიკატორი კარგია, ჩავტვირთოთ ბაზიდან ინფორმაცია
                getOnePhoneticsTypeById(phtIdVal);
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
        if (loadingPhoneticsType || !phtId || !phoneticsTypeForEdit) return;

        //ჩატვირთული ინფორმაცია მივცეთ ფორმის მენეჯერს
        setFormData(phoneticsTypeForEdit);
    }, [curPhtIdVal, phtId, phoneticsTypeForEdit, loadingPhoneticsType]);

    //10. საბმიტის ფუნქცია
    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        dispatch(clearAllAlerts());
        if (haveErrors) return;

        const currentForm = JSON.parse(
            JSON.stringify(frm)
        ) as PhoneticsTypeEditFormData;

        if (curPhtIdVal)
            updatePhoneticsType({
                phoneticsTypeEditFormData: currentForm,
                navigate,
            });
        else
            createPhoneticsType({
                phoneticsTypeEditFormData: currentForm,
                navigate,
            });
        clearUsedTables();
    }

    function renumProhibitions(
        phoneticsTypeProhibitions: PhoneticsTypeProhibition[]
    ) {
        phoneticsTypeProhibitions
            .sort((a, b) => a.phtpProhOrd - b.phtpProhOrd)
            .forEach((e, i) => (e.phtpProhOrd = i));
    }

    function goProhibitionDown(frm: PhoneticsTypeEditFormData, index: number) {
        renumProhibitions(frm.phoneticsTypeProhibitions);
        frm.phoneticsTypeProhibitions[index].phtpProhOrd = index + 1;
        frm.phoneticsTypeProhibitions[index + 1].phtpProhOrd = index;
    }

    const phoneticsTypesDataType = dataTypes.find(
        (f) => f.dtTable === "phoneticsTypes"
    );

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
        loadingPhoneticsType ||
        mdWorkingOnLoad ||
        Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s)
    )
        //თუ ინფორმაციის ჩატვირთვა ჯერ კიდევ მიმდინარეობა
        return <WaitPage />;

    //თუ იდენტიფიკატორი წესიერია და ჩატვირთული ობიექტი ჯერ არ არის, ან საჭირო ცხრილები ჩატვირთული არ არის
    if (
        (curPhtIdVal && !phoneticsTypeForEdit) ||
        !phoneticsOptions ||
        !dataTypes ||
        !phoneticsTypesDataType
    ) {
        return (
            <div>
                <h5>ინფორმაციის ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );
    }

    //9. შეცდომების შესახებ ინფორმაცია გამოიყენება საბმიტის ფუნქციაში
    const allErrors = getAllErrors();
    const haveErrors = allErrors !== "";

    if (!frm) return <div>ფორმის მონაცემები არ არის</div>;

    return (
        <Row>
            <Col sm="6">
                <AlertMessages alertKind={EAlertKind.ClientRunTime} />
                <Form onSubmit={handleSubmit}>
                    <EditorHeader
                        curIdVal={curPhtIdVal}
                        EditorName="ფონეტიკური ტიპი"
                        EditorNameGenitive="ფონეტიკური ტიპის"
                        EditedObjectName={
                            frm &&
                            frm.phoneticsType &&
                            frm.phoneticsType.phtName
                                ? frm.phoneticsType.phtName
                                : ""
                        }
                        workingOnDelete={workingOnDeletePhoneticsType}
                        DeleteFailure={DeleteFailure}
                        onDelete={() => {
                            if (!!curPhtIdVal)
                                deletePhoneticsType({
                                    phtId: curPhtIdVal,
                                    navigate,
                                });
                            clearUsedTables();
                        }}
                        allowDelete={phoneticsTypesDataType.delete}
                    />
                    <OneStrongLabel
                        controlId="mainParametersLabel"
                        label="მთავარი პარამეტრები"
                    />
                    <OneTextControl
                        controlId="phoneticsType.phtName"
                        label="დასახელება"
                        value={frm.phoneticsType.phtName}
                        getError={getError}
                        onChangeValue={changeField}
                    />
                    <OneComboBoxControl
                        controlId="phoneticsType.phtLastLetter"
                        label="ბოლო ბგერა"
                        value={frm.phoneticsType.phtLastLetter}
                        dataMember={[
                            { id: 0, name: "თანხმოვანი" },
                            { id: 1, name: "ხმოვანი" },
                            { id: 2, name: "სულერთია" },
                        ]}
                        valueMember="id"
                        displayMember="name"
                        getError={getError}
                        onChangeValue={changeField}
                    />
                    <OneNumberControl
                        controlId="phoneticsType.phtDistance"
                        label="დისტანცია"
                        value={frm.phoneticsType.phtDistance}
                        getError={getError}
                        onChangeValue={changeField}
                    />
                    <OneTextControl
                        controlId="phoneticsType.phtNote"
                        label="შენიშვნა"
                        value={frm.phoneticsType.phtNote}
                        getError={getError}
                        onChangeValue={changeField}
                    />
                    <OneComboBoxControl
                        controlId="phoneticsType.phtSlab"
                        label="მარცვალების"
                        value={frm.phoneticsType.phtSlab}
                        dataMember={[
                            { id: 0, name: "მინიმუმ" },
                            { id: 1, name: "ზუსტად" },
                            { id: 2, name: "მაქსიმუმ" },
                        ]}
                        valueMember="id"
                        displayMember="name"
                        getError={getError}
                        onChangeValue={changeField}
                    />
                    <OneNumberControl
                        controlId="phoneticsType.phtSlabCount"
                        label="რაოდენობა"
                        value={frm.phoneticsType.phtSlabCount}
                        getError={getError}
                        onChangeValue={changeField}
                        minv={0}
                    />
                    <OneStrongLabel
                        controlId="phoneticsOptionsLabel"
                        label="ფონეტიკური ვარიანტები"
                    />
                    {frm &&
                        frm.phoneticsOptionIds &&
                        frm.phoneticsOptionIds.map((poId, index) => {
                            return (
                                <OneComboBoxControl
                                    key={index}
                                    controlId={`phoneticsOptionIds[${index}]`}
                                    label={`ფონეტიკური ვარიანტი ${index + 1}`}
                                    value={frm.phoneticsOptionIds[index]}
                                    dataMember={phoneticsOptions}
                                    valueMember="phoId"
                                    displayMember="phoName"
                                    firstItem={{
                                        id: 0,
                                        name: "აირჩიეთ ფონეტიკური ვარიანტი",
                                    }}
                                    getError={getError}
                                    onChangeValue={changeField}
                                    onTrashButtonClick={() => {
                                        const newFrm = JSON.parse(
                                            JSON.stringify(frm)
                                        ) as PhoneticsTypeEditFormData;
                                        newFrm.phoneticsOptionIds.splice(
                                            index,
                                            1
                                        );
                                        setFormData(newFrm);
                                    }}
                                />
                            );
                        })}

                    <OnePlusButton
                        onClick={() => {
                            const newFrm = JSON.parse(
                                JSON.stringify(frm)
                            ) as PhoneticsTypeEditFormData;
                            newFrm.phoneticsOptionIds.push(0);
                            setFormData(newFrm);
                        }}
                    />

                    <OneStrongLabel
                        controlId="prohibitionsLabel"
                        label="შეზღუდვები"
                    />

                    <ol>
                        {frm &&
                            frm.phoneticsTypeProhibitions &&
                            frm.phoneticsTypeProhibitions
                                .sort((a, b) => a.phtpProhOrd - b.phtpProhOrd)
                                .map((phtp, index) => {
                                    return (
                                        <li key={index}>
                                            <OneEditDeleteButtons
                                                controlId={index.toString()}
                                                label={GetOnePhoneticsTypeProhibitionDescription(
                                                    phtp
                                                )}
                                                onEditClick={(e) => {
                                                    e.preventDefault();
                                                    if (
                                                        expandedProhibitionIndex ===
                                                        index
                                                    )
                                                        setExpandedProhibitionIndex(
                                                            null
                                                        );
                                                    setExpandedProhibitionIndex(
                                                        index
                                                    );
                                                }}
                                                onDeleteClick={(e) => {
                                                    e.preventDefault();
                                                    const newFrm = JSON.parse(
                                                        JSON.stringify(frm)
                                                    ) as PhoneticsTypeEditFormData;
                                                    newFrm.phoneticsTypeProhibitions.splice(
                                                        index,
                                                        1
                                                    );
                                                    setFormData(newFrm);
                                                }}
                                            />
                                            {expandedProhibitionIndex ===
                                                index && (
                                                <div>
                                                    <OneUpDownButtons
                                                        controlId={index.toString()}
                                                        label="პოზიციის ცვლილება"
                                                        enableUp={index > 0}
                                                        enableDown={
                                                            index <
                                                            frm
                                                                .phoneticsTypeProhibitions
                                                                .length -
                                                                1
                                                        }
                                                        onUpClick={(e) => {
                                                            e.preventDefault();
                                                            goProhibitionDown(
                                                                frm,
                                                                index - 1
                                                            );
                                                            setExpandedProhibitionIndex(
                                                                index - 1
                                                            );
                                                        }}
                                                        onDownClick={(e) => {
                                                            e.preventDefault();
                                                            goProhibitionDown(
                                                                frm,
                                                                index
                                                            );
                                                            setExpandedProhibitionIndex(
                                                                index + 1
                                                            );
                                                        }}
                                                    />
                                                    {/* <Form.Label column sm="10">რედაქტირდება აკრძალვა ინდექსით {index}</Form.Label> */}
                                                    {/* {getOneNumberControl(`phoneticsTypeProhibitions[${index}].phtpProhOrd`, "რიგირთი ნომერი", frm.phoneticsTypeProhibitions[index].phtpProhOrd, 0)} */}
                                                    <OneComboBoxControl
                                                        controlId={`phoneticsTypeProhibitions[${index}].phtpProhId`}
                                                        label="შეზღუდვის ტიპი"
                                                        value={
                                                            frm
                                                                .phoneticsTypeProhibitions[
                                                                index
                                                            ].phtpProhId
                                                        }
                                                        dataMember={[
                                                            {
                                                                id: 0,
                                                                name: "იყოს",
                                                            },
                                                            {
                                                                id: 1,
                                                                name: "იყოს ერთ-ერთი",
                                                            },
                                                            {
                                                                id: 2,
                                                                name: "არ იყოს",
                                                            },
                                                        ]}
                                                        valueMember="id"
                                                        displayMember="name"
                                                        getError={getError}
                                                        onChangeValue={
                                                            changeField
                                                        }
                                                    />
                                                    <OneComboBoxControl
                                                        controlId={`phoneticsTypeProhibitions[${index}].phtpOrient`}
                                                        label="ორიენტაცია"
                                                        value={
                                                            frm
                                                                .phoneticsTypeProhibitions[
                                                                index
                                                            ].phtpOrient
                                                        }
                                                        dataMember={[
                                                            {
                                                                id: 0,
                                                                name: "ბოლოდან",
                                                            },
                                                            {
                                                                id: 1,
                                                                name: "თავიდან",
                                                            },
                                                        ]}
                                                        valueMember="id"
                                                        displayMember="name"
                                                        getError={getError}
                                                        onChangeValue={
                                                            changeField
                                                        }
                                                    />
                                                    <OneNumberControl
                                                        controlId={`phoneticsTypeProhibitions[${index}].phtpStart`}
                                                        label="პირველი სიმბოლოს ნომერი"
                                                        value={
                                                            frm
                                                                .phoneticsTypeProhibitions[
                                                                index
                                                            ].phtpStart
                                                        }
                                                        getError={getError}
                                                        onChangeValue={
                                                            changeField
                                                        }
                                                        minv={0}
                                                    />
                                                    <OneNumberControl
                                                        controlId={`phoneticsTypeProhibitions[${index}].phtpCount`}
                                                        label="სიმბოლოების რაოდენობა"
                                                        value={
                                                            frm
                                                                .phoneticsTypeProhibitions[
                                                                index
                                                            ].phtpCount
                                                        }
                                                        getError={getError}
                                                        onChangeValue={
                                                            changeField
                                                        }
                                                        minv={1}
                                                    />
                                                    <OneComboBoxControl
                                                        controlId={`phoneticsTypeProhibitions[${index}].phtpObject`}
                                                        label="ობიექტის ტიპი"
                                                        value={
                                                            frm
                                                                .phoneticsTypeProhibitions[
                                                                index
                                                            ].phtpObject
                                                        }
                                                        dataMember={[
                                                            {
                                                                id: 0,
                                                                name: "ბგერა",
                                                            },
                                                            {
                                                                id: 1,
                                                                name: "ხმოვანი",
                                                            },
                                                            {
                                                                id: 2,
                                                                name: "თანხმოვანი",
                                                            },
                                                        ]}
                                                        valueMember="id"
                                                        displayMember="name"
                                                        getError={getError}
                                                        onChangeValue={
                                                            changeField
                                                        }
                                                    />
                                                    <OneTextControl
                                                        controlId={`phoneticsTypeProhibitions[${index}].phtpNew`}
                                                        label="სიმბოლოები"
                                                        value={
                                                            frm
                                                                .phoneticsTypeProhibitions[
                                                                index
                                                            ].phtpNew
                                                        }
                                                        getError={getError}
                                                        onChangeValue={
                                                            changeField
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                    </ol>

                    <OnePlusButton
                        onClick={(e) => {
                            e.preventDefault();
                            const newFrm = JSON.parse(
                                JSON.stringify(frm)
                            ) as PhoneticsTypeEditFormData;
                            let newPtp = yup
                                .reach(
                                    phoneticsTypeEditFormDataSchema,
                                    "phoneticsTypeProhibitions[0]"
                                )
                                .cast({}) as PhoneticsTypeProhibition;
                            if (newPtp) {
                                newPtp.phtpProhOrd =
                                    newFrm.phoneticsTypeProhibitions.length + 1;
                                newFrm.phoneticsTypeProhibitions.push(newPtp);
                                setFormData(newFrm);
                                setExpandedProhibitionIndex(
                                    newFrm.phoneticsTypeProhibitions.length - 1
                                );
                            }
                        }}
                    />

                    <OneSaveCancelButtons
                        curIdVal={curPhtIdVal}
                        haveErrors={haveErrors}
                        savingNow={
                            creatingPhoneticsType || updatingPhoneticsType
                        }
                        onCloseClick={() => {
                            dispatch(clearAllAlerts());
                            navigate(-1); //goBack
                        }}
                        allowEdit={phoneticsTypesDataType.update}
                    />

                    <OneErrorRow allErrors={allErrors} />
                </Form>
            </Col>
        </Row>
    );
};

export default PhoneticsTypeEdit;
