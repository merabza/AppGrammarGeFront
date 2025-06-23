//RootEdit.tsx

import { useState, useEffect, useMemo, type FC } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import WaitPage from "../appcarcass/common/WaitPage";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useClearTablesFromRepo } from "../appcarcass/masterdata/masterDataHooks/useClearTablesFromRepo";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import {
    clearForConfirmRootsPagesMemo,
    clearMemo,
    clearRoot,
} from "../redux/slices/rootsSlice";
import {
    type RootData,
    rootDataSchema,
} from "./TypesAndSchemas/RootDataTypeAndSchema";
import {
    clearAllAlerts,
    EAlertKind,
} from "../appcarcass/redux/slices/alertSlice";
import {
    useConfirmRejectRootChangeMutation,
    useCreateRootMutation,
    useDeleteRootMutation,
    useLazyOnlyRootByIdQuery,
    useUpdateRootMutation,
} from "../redux/api/rootCrudApi";
import EditorHeader from "../appcarcass/editorParts/EditorHeader";
import StatusConfirmRejectPart from "./StatusConfirmRejectPart";
import OnePlaintextRow from "../appcarcass/editorParts/OnePlaintextRow";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import OneTextControl from "../appcarcass/editorParts/OneTextControl";
import OneNumberControl from "../appcarcass/editorParts/OneNumberControl";
import OneSaveCancelButtons from "../appcarcass/editorParts/OneSaveCancelButtons";
import OneErrorRow from "../appcarcass/editorParts/OneErrorRow";
import { setDeleteFailureRoot } from "../redux/slices/rootCrudSlice";
import { useAlert } from "../appcarcass/hooks/useAlert";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { useForman } from "../appcarcass/hooks/useForman";
import type {
    PhoneticsChangeQueryModel,
    classifierModel,
} from "../masterData/mdTypes";
import { isAllowEditAndDelete } from "./dteFunctions";
import MultiCombEditor from "../appcarcass/editorParts/MultiCombEditor";
import { ETableName } from "../masterData/tableNames";

const RootEdit: FC = () => {
    const navigate = useNavigate();

    //1. იდენტიფიკატორი
    const [curRootIdVal, setCurRootIdVal] = useState<number | undefined>(
        undefined
    );

    const dispatch = useAppDispatch();
    const [LoadRootById, { isLoading: loadingRoot }] =
        useLazyOnlyRootByIdQuery();
    const [createRoot, { isLoading: creatingRoot }] = useCreateRootMutation();
    const [updateRoot, { isLoading: updatingRoot }] = useUpdateRootMutation();
    const [
        deleteRoot,
        { isLoading: workingOnDeleteRoot, isError: DeleteFailure },
    ] = useDeleteRootMutation();
    const [
        confirmRejectRootChange,
        {
            isLoading: workingOnConfirmRejectRootChange,
            isError: confirmRejectFailure,
        },
    ] = useConfirmRejectRootChangeMutation();

    const { rootForEdit } = useAppSelector((state) => state.rootCrudState);

    // console.log("RootEdit rootForEdit", rootForEdit);

    // //2. კომპონენტის თვისებები
    // const {
    //   alert,
    //   user,
    //   mdWorkingOnLoad,
    //   checkLoadMdTables,
    //   derivationTypes,
    //   classifiers,
    //   phoneticsChangesQuery,
    //   savingRoot,
    //   loadingRoot,
    //   workingOnDeleteRoot,
    //   rootForEdit,
    //   getOneRootById,
    //   DeleteFailure,
    //   clearTablesFromRepo,
    //   clearRoot,
    //   clearMemo,
    //   workingOnConfirmRejectRootChange,
    //   confirmRejectFailure,
    //   confirmRejectRootChange,
    //   clearConfirmRejectFailure,
    //   clearForConfirmRootsPagesMemo,
    //   clearAlert,
    //   updateRoot,
    //   createRoot,
    //   deleteRoot,
    //   clearDeletingFailure,
    // } = props;

    //const fromParamsRootId = props.match.params.rootId;
    // const { baseName, page } = props.match.params;
    const { rootId: fromParamsRootId } = useParams<string>();

    // console.log("RootEdit fromParamsRootId=", fromParamsRootId);
    // console.log("RootEdit curRootIdVal=", curRootIdVal);

    //console.log("RootEdit props=", props);

    //3. ეს არის ის ცხრილები, რომელზეც მოქმედებს ეს კონკრეტული რედაქტორი
    // const tableNamesForClear = useMemo(() => [], []);

    //4. ეს არის ის ცხრილები, რომლებიდანაც ინფორმაცია სჭირდება ამ რედაქტრს
    const tableNamesForLoad = useMemo(
        () => [ETableName.Classifiers, ETableName.PhoneticsChangesQuery],
        []
    );

    const [checkLoadMdTables] = useCheckLoadMdTables();
    const [clearTables] = useClearTablesFromRepo();

    const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
        useAppSelector((state) => state.masterDataState);
    //const derivationTypes = mdRepo.derivationTypes as DerivationType[];
    const classifiers = mdataRepo[ETableName.Classifiers] as classifierModel[];
    const phoneticsChangesQuery = mdataRepo[
        ETableName.PhoneticsChangesQuery
    ] as PhoneticsChangeQueryModel[];

    const { user } = useAppSelector((state) => state.userState);

    useEffect(() => {
        checkLoadMdTables(tableNamesForLoad);
    }, [tableNamesForLoad]); //, checkLoadMdTables - ჩამტვირთავი მეთოდების ჩანატება useEffect-ის დამოკიდებულებებში იწვევს ჩაციკვლას

    //console.log("RootEdit yupSchema=", yupSchema);

    //6. ფორმის მენეჯერი
    const [
        frm,
        changeField,
        getError,
        getAllErrors,
        clearToDefaults,
        setFormData,
    ] = useForman<typeof rootDataSchema, RootData>(rootDataSchema); //ToDo აქ სასურველია <any, any> შეიცვალოს <სქემის ტიპი, გასაგზავნი ინფორმაციის ტიპი>

    function clearUsedTables() {
        clearTables(null, tableNamesForLoad);
        dispatch(clearRoot(curRootIdVal));
        dispatch(clearMemo());
        dispatch(clearForConfirmRootsPagesMemo());
    }
    //console.log("RootEdit.js on check Load {curRootIdVal, rootForEdit, derivationTypes, loadingRoot, mdWorkingOnLoad}=", {curRootIdVal, rootForEdit, derivationTypes, loadingRoot, mdWorkingOnLoad});

    // if (
    //   EAlertKind.ApiLoad in alert &&
    //   alert[EAlertKind.ApiLoad] &&
    //   alert[EAlertKind.ApiLoad].message
    // ) {
    //   return (
    //     <div>
    //       <h5>ჩატვირთვის პრობლემა</h5>
    //       {
    //         <Alert variant={alert[EAlertKind.ApiLoad].alertType.toString()}>
    //           {alert[EAlertKind.ApiLoad].message}
    //         </Alert>
    //       }
    //     </div>
    //   );
    // }

    //7. იდენტიფიკატორის ეფექტი
    useEffect(() => {
        // console.log("RootEdit useEffect Start");
        const rootIdVal = fromParamsRootId ? parseInt(fromParamsRootId) : 0;
        //ვამოწმებთ მისამართში შეიცვალა თუ არა იდენტიფიკატორი
        if (curRootIdVal !== rootIdVal) {
            //შეცვლილა
            //დავიმახსოვროთ შეცვლილი იდენტიფიკატორი
            setCurRootIdVal(rootIdVal);
            if (rootIdVal) {
                //თუ იდენტიფიკატორი კარგია, ჩავტვირთოთ ბაზიდან ინფორმაცია
                LoadRootById(rootIdVal);
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
        //ან თუ ჩატვირთვა კი დასრულდა, მაგრამ ჩატვირთულიობიექტი მაინც შევამოწმოთ
        if (loadingRoot || !fromParamsRootId || !rootForEdit) return;

        //ჩატვირთული ინფორმაცია მივცეთ ფორმის მენეჯერს
        // console.log("setFormData rootForEdit=", rootForEdit);
        setFormData(rootForEdit);
    }, [
        curRootIdVal,
        fromParamsRootId,
        loadingRoot,
        rootForEdit,
        // LoadRootById,
        // clearToDefaults,
        // setFormData,
    ]);

    const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

    // console.log("ApiLoadMessage=", ApiLoadMessage);

    if (ApiLoadHaveErrors)
        return (
            <div>
                <h5>ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );

    if (
        loadingRoot ||
        mdWorkingOnLoad ||
        Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s)
    )
        //თუ ინფორმაციის ჩატვირთვა ჯერ კიდევ მიმდინარეობა
        return <WaitPage />;

    //8. ჩატვირთვის შემოწმება
    //თუ იდენტიფიკატორი წესიერია და ჩატვირთული ობიექტი ჯერ არ არის, ან საჭირო ცხრილები ჩატვირთული არ არის

    // console.log("RootEdit", {
    //   curRootIdVal,
    //   rootForEdit,
    //   derivationTypes,
    //   classifiers,
    //   phoneticsChanges,
    //   frm,
    //   loadingRoot,
    //   mdWorkingOnLoad,
    // });

    if (
        (curRootIdVal && !rootForEdit) ||
        //!derivationTypes ||
        !classifiers ||
        !phoneticsChangesQuery ||
        !frm ||
        !frm.root
    ) {
        return (
            <div>
                <h5>ინფორმაციის ჩატვირთვის პრობლემა</h5>
            </div>
        );
    }

    //9. შეცდომების შესახებ ინფორმაცია გამოიყენება საბმიტის ფუნქციაში
    const allErrors = getAllErrors();
    const haveErrors = allErrors !== "";

    //10. საბმიტის ფუნქცია
    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        dispatch(clearAllAlerts());
        if (haveErrors) return;

        //გადავიტანოთ ფორმის მონაცემები ძირითად მონაცემებში
        //წავშალოთ ფორმის ინფორმაცია, რადგან ის საჭირო არ არის შენახვისას

        const currentForm = { ...frm } as RootData;
        if (curRootIdVal) updateRoot({ rootData: currentForm, navigate });
        else createRoot({ rootData: currentForm, navigate });
        clearUsedTables();
    }

    const rootResultName =
        frm && frm.root && frm.root.rootName
            ? `${frm.root.rootName}:${
                  frm.root.rootHomonymIndex ? frm.root.rootHomonymIndex : 0
              }`
            : "";
    const userHasConfirmRight =
        user?.appClaims.some((s) => s === "Confirm") ?? false;

    // console.log("RootEdit frm=", frm);
    // console.log("RootEdit frm.root=", frm.root);
    // console.log("RootEdit frm.root.recordStatusId=", frm.root.recordStatusId);
    // console.log("RootEdit frm.root.creator=", frm.root.creator);
    // console.log("RootEdit user?.userName=", user?.userName);
    // console.log("RootEdit userHasConfirmRight=", userHasConfirmRight);

    const allowEditAndDelete = isAllowEditAndDelete(
        curRootIdVal,
        user?.userName,
        frm.root.creator,
        frm.root.recordStatusId,
        userHasConfirmRight
    );

    // (!userHasConfirmRight && frm && frm.root.recordStatusId === 0) ||
    // (userHasConfirmRight && frm && frm.root.recordStatusId !== 1);

    // console.log("RootEdit userHasConfirmRight=", userHasConfirmRight);
    // console.log("RootEdit frm.root.recordStatusId=", frm.root.recordStatusId);
    // console.log("RootEdit frm.root.allowEditAndDelete=", allowEditAndDelete);

    return (
        <Row>
            <Col md="6">
                <AlertMessages alertKind={EAlertKind.ApiMutation} />
                <Form onSubmit={handleSubmit}>
                    <EditorHeader
                        curIdVal={curRootIdVal}
                        EditorName="ძირი"
                        EditorNameGenitive="ძირის"
                        EditedObjectName={rootResultName}
                        workingOnDelete={workingOnDeleteRoot}
                        DeleteFailure={DeleteFailure}
                        onDelete={() => {
                            if (curRootIdVal) {
                                deleteRoot({ rootId: curRootIdVal, navigate });
                                clearUsedTables();
                            }
                        }}
                        onClearDeletingFailure={() => {
                            dispatch(setDeleteFailureRoot(false));
                        }}
                        allowDelete={allowEditAndDelete}
                    />

                    {userHasConfirmRight &&
                        frm.root.recordStatusId !== undefined && (
                            <StatusConfirmRejectPart
                                recordStatusId={frm.root.recordStatusId}
                                creator={frm.root.creator}
                                applier={frm.root.applier}
                                workingOnConfirmReject={
                                    workingOnConfirmRejectRootChange
                                }
                                confirmRejectFailure={confirmRejectFailure}
                                onConfirmRejectClick={(
                                    confirm,
                                    withAllDescendants
                                ) => {
                                    if (curRootIdVal) {
                                        confirmRejectRootChange({
                                            rootId: curRootIdVal,
                                            confirm,
                                            withAllDescendants,
                                            navigate,
                                        });
                                        clearUsedTables();
                                    }
                                }}
                                onClearConfirmRejectFailure={() => {
                                    // clearConfirmRejectFailure();//todo დროებით დავაკომენტარე რადგან არ ვიცი rtk თვითონ როგორ ექცევა შეცდომის სტატუსს. შეიძლება ეს ბრძანება საჭირო არც იყოს
                                }}
                            />
                        )}

                    <OnePlaintextRow
                        controlId="result"
                        label="შედეგი"
                        text={rootResultName}
                    />
                    <OneStrongLabel
                        controlId="mainParametersLabel"
                        label="მთავარი პარამეტრები"
                    />

                    <OneComboBoxControl
                        controlId="root.classifierId"
                        label="კლასიფიკატორი"
                        value={frm.root.classifierId}
                        dataMember={classifiers}
                        firstItem={{ id: 0, name: "არცერთი" }}
                        valueMember="clfId"
                        displayMember="clfName"
                        sortByDisplayMember={true}
                        getError={getError}
                        firstItemIsSelectable
                        onChangeValue={changeField}
                    />

                    <OneTextControl
                        controlId="root.rootName"
                        label="ძირი"
                        value={frm.root.rootName}
                        getError={getError}
                        onChangeValue={changeField}
                    />
                    <OneNumberControl
                        controlId="root.rootHomonymIndex"
                        label="ომონიმიის სორტირების ნომერი"
                        value={frm.root.rootHomonymIndex}
                        minv={0}
                        getError={getError}
                        onChangeValue={changeField}
                    />
                    <OneTextControl
                        controlId="root.rootNote"
                        label="შენიშვნა"
                        value={frm.root.rootNote}
                        getError={getError}
                        onChangeValue={changeField}
                    />

                    {/* <PhoneticsCombEditor
                        controlGroupId="basePhoneticsCombDetails"
                        label="შედეგის ფონეტიკური შესაძლებლობები"
                        basePhoneticsChanges={frm.basePhoneticsCombDetails}
                        phoneticsChangesQuery={phoneticsChangesQuery}
                        getError={getError}
                        onChangeValue={changeField}
                        onTrashButtonClick={(index) => {
                            const newFrm = JSON.parse(
                                JSON.stringify(frm)
                            ) as RootData;

                            newFrm.basePhoneticsCombDetails.splice(index, 1);
                            setFormData(newFrm);
                        }}
                        onPlusButtonClick={() => {
                            const newFrm = JSON.parse(
                                JSON.stringify(frm)
                            ) as RootData;
                            newFrm.basePhoneticsCombDetails.push(0);
                            setFormData(newFrm);
                        }}
                    /> */}

                    <MultiCombEditor
                        controlGroupId="basePhoneticsCombDetails"
                        label="შედეგის ფონეტიკური შესაძლებლობები"
                        IntValueList={frm.basePhoneticsCombDetails}
                        dataMember={phoneticsChangesQuery.filter(
                            (fc) => !fc.onlyPhoneticsType
                        )}
                        firstItem={{
                            id: 0,
                            name: "აირჩიე ფონეტიკური ცვლილება",
                        }}
                        valueMember="phcId"
                        displayMember="phcName"
                        getError={getError}
                        onChangeValue={changeField}
                        onTrashButtonClick={(index) => {
                            const newFrm = JSON.parse(
                                JSON.stringify(frm)
                            ) as RootData;

                            newFrm.basePhoneticsCombDetails.splice(index, 1);
                            setFormData(newFrm);
                        }}
                        onPlusButtonClick={() => {
                            const newFrm = JSON.parse(
                                JSON.stringify(frm)
                            ) as RootData;
                            newFrm.basePhoneticsCombDetails.push(0);
                            setFormData(newFrm);
                        }}
                    />

                    <OneSaveCancelButtons
                        curIdVal={curRootIdVal}
                        haveErrors={haveErrors}
                        savingNow={creatingRoot || updatingRoot}
                        onCloseClick={() => {
                            dispatch(clearAllAlerts());
                            navigate(-1); //go back
                        }}
                        allowEdit={allowEditAndDelete}
                    />
                    <OneErrorRow allErrors={allErrors} />
                </Form>
            </Col>
        </Row>
    );
};

export default RootEdit;
