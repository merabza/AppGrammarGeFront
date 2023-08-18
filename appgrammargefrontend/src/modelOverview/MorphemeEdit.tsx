//MorphemeEdit.tsx

import { useState, useEffect, useCallback, useMemo, FC } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import {
  Morpheme,
  MorphemeRange,
  PhoneticsType,
  PhoneticsOption,
  PhoneticsChangeModel,
} from "../masterData/mdTypes";
// import { PhoneticsChangeModel } from "../redux/types/masterDataTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useForman } from "../appcarcass/hooks/useForman";
import { useClearTablesFromRepo } from "../appcarcass/masterdata/masterDataHooks/useClearTablesFromRepo";
import {
  MorphemeEditFormData,
  morphemeEditFormDataSchema,
} from "./MorphemeEditFormData";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateMorphemeMutation,
  useDeleteMorphemeMutation,
  useLazyGetOneMorphemeByIdQuery,
  useUpdateMorphemeMutation,
} from "../redux/api/modelEditorMorphemesCrudApi";
import WaitPage from "../appcarcass/common/WaitPage";
import AlertMessages from "../appcarcass/common/AlertMessages";
import {
  EAlertKind,
  clearAllAlerts,
} from "../appcarcass/redux/slices/alertSlice";
import EditorHeader from "../appcarcass/editorParts/EditorHeader";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import OneNumberControl from "../appcarcass/editorParts/OneNumberControl";
import OneTextControl from "../appcarcass/editorParts/OneTextControl";
import PhoneticsCombEditor from "../editorParts/PhoneticsCombEditor";
import OneSaveCancelButtons from "../appcarcass/editorParts/OneSaveCancelButtons";
import OneErrorRow from "../appcarcass/editorParts/OneErrorRow";
import { useAlert } from "../appcarcass/hooks/useAlert";

const MorphemeEdit: FC = () => {
  //const history = useHistory();
  const navigate = useNavigate();

  //1. იდენტიფიკატორი
  const [curMrpIdVal, setCurMrpIdVal] = useState<number | undefined>(undefined);

  const dispatch = useAppDispatch();

  //2. კომპონენტის თვისებები
  // const { alert, mdWorkingOnLoad, checkLoadMdTables,
  //   phoneticsTypes, morphemeRanges, morphemesQuery, phoneticsChanges, phoneticsChangesQuery, phoneticsOptions,
  //   savingMorpheme, loadingMorpheme, workingOnDeleteMorpheme, morphemeForEdit, getOneMorphemeById, DeleteFailure } = props;

  // const {
  //   alert,
  //   masterData,
  //   savingMorpheme,
  //   loadingMorpheme,
  //   workingOnDeleteMorpheme,
  //   morphemeForEdit,
  //   DeleteFailure,
  //   checkLoadMdTables,
  //   getOneMorphemeById,
  // } = props;

  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );

  // const { datatypesLoading, datatypes } = masterData;

  const phoneticsTypes = mdRepo.phoneticsTypes as PhoneticsType[];
  const morphemeRanges = mdRepo.morphemeRanges as MorphemeRange[];
  const morphemesQuery = mdRepo.morphemesQuery as Morpheme[];
  const phoneticsChanges =
    mdRepo.phoneticsChangesQuery as PhoneticsChangeModel[];
  const phoneticsChangesQuery =
    mdRepo.phoneticsChangesQuery as PhoneticsChangeModel[];
  const phoneticsOptions = mdRepo.phoneticsOptions as PhoneticsOption[];

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const [getOneMorphemeById, { isLoading: loadingMorpheme }] =
    useLazyGetOneMorphemeByIdQuery();

  const [createMorpheme, { isLoading: creatingMorpheme }] =
    useCreateMorphemeMutation();
  const [updateMorpheme, { isLoading: updatingMorpheme }] =
    useUpdateMorphemeMutation();
  const [
    deleteMorpheme,
    { isLoading: workingOnDeleteMorpheme, isError: DeleteFailure },
  ] = useDeleteMorphemeMutation();

  const { morphemeForEdit } = useAppSelector(
    (state) => state.modelEditorMorphemesCrudState
  );

  //console.log("MorphemeEdit props=", props);

  //3. ეს არის ის ცხრილები, რომელზეც მოქმედებს ეს კონკრეტული რედაქტორი
  const tableNamesForClear = useMemo(
    () => [
      "morphemes",
      "morphPhoneticsOption",
      "morphPhoneticsOccasion",
      "morphemesQuery",
    ],
    []
  );

  //4. ეს არის ის ცხრილები, რომლებიდანაც ინფორმაცია სჭირდება ამ რედაქტრს
  const tableNamesForLoad = useMemo(
    () => [
      "phoneticsTypes",
      "morphemeRanges",
      "morphemesQuery",
      "phoneticsChanges",
      "phoneticsChangesQuery",
      "phoneticsOptions",
    ],
    []
  );

  const [checkLoadMdTables] = useCheckLoadMdTables();
  const [clearTablesFromRepo] = useClearTablesFromRepo();

  useEffect(() => {
    checkLoadMdTables(tableNamesForLoad);
  }, [tableNamesForLoad]);

  //6. ფორმის მენეჯერი
  const [
    frm,
    changeField,
    getError,
    getAllErrors,
    clearToDefaults,
    setFormData,
  ] = useForman<typeof morphemeEditFormDataSchema, MorphemeEditFormData>(
    morphemeEditFormDataSchema
  );

  function clearUsedTables() {
    clearTablesFromRepo(tableNamesForClear, tableNamesForLoad);
  }

  const setPhoneticsType = useCallback(
    (curForm: MorphemeEditFormData, newPhoneticsTypeId: number | null) => {
      const pcLength =
        !phoneticsChanges || !newPhoneticsTypeId
          ? 0
          : phoneticsChanges.filter(
              (f) =>
                f.phoneticsTypeId === newPhoneticsTypeId && f.phoneticsOptionId
            ).length;
      const newForm = { ...curForm };
      newForm.phoneticsChangesLength = pcLength;
      if (!newForm.phoneticsOptionMorphemeIds)
        newForm.phoneticsOptionMorphemeIds = [];
      while (newForm.phoneticsOptionMorphemeIds.length < pcLength)
        newForm.phoneticsOptionMorphemeIds.push(0);
      newForm.phoneticsOptionMorphemeIds.length = pcLength;
      newForm.morpheme.phoneticsTypeId =
        newPhoneticsTypeId == null ? 0 : newPhoneticsTypeId;
      setFormData(newForm);
    },
    [phoneticsChanges, setFormData]
  );

  const { mrpId: fromParamsmrpId } = useParams<string>();

  //7. იდენტიფიკატორის ეფექტი
  useEffect(() => {
    const mrpIdVal = fromParamsmrpId ? parseInt(fromParamsmrpId) : 0;

    //ვამოწმებთ მისამართში შეიცვალა თუ არა იდენტიფიკატორი
    if (curMrpIdVal !== mrpIdVal) {
      //შეცვლილა
      //დავიმახსოვროთ შეცვლილი იდენტიფიკატორი
      setCurMrpIdVal(mrpIdVal);
      if (mrpIdVal) {
        //თუ იდენტიფიკატორი კარგია, ჩავტვირთოთ ბაზიდან ინფორმაცია
        getOneMorphemeById(mrpIdVal);
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
      loadingMorpheme ||
      !curMrpIdVal ||
      !morphemeForEdit ||
      mdWorkingOnLoad ||
      mdWorkingOnLoadingTables ||
      !phoneticsChanges
    )
      return;

    setPhoneticsType(morphemeForEdit, morphemeForEdit.morpheme.phoneticsTypeId);
  }, [
    curMrpIdVal,
    morphemeForEdit,
    loadingMorpheme,
    phoneticsChanges,
    mdWorkingOnLoad,
    mdWorkingOnLoadingTables,
  ]);

  //console.log("MorphemeEdit curMrpIdVal=", curMrpIdVal);
  //console.log("MorphemeEdit frm=", frm);

  const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

  if (ApiLoadHaveErrors)
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );

  const morphemesDataType = dataTypes.find((f) => f.dtTable === "morphemes");

  //8. ჩატვირთვის შემოწმება
  if (loadingMorpheme || mdWorkingOnLoad || mdWorkingOnLoadingTables)
    //თუ ინფორმაციის ჩატვირთვა ჯერ კიდევ მიმდინარეობა
    return <WaitPage />;
  //თუ იდენტიფიკატორი წესიერია და ჩატვირთული ობიექტი ჯერ არ არის, ან საჭირო ცხრილები ჩატვირთული არ არის
  if (
    !morphemesDataType ||
    !frm ||
    (curMrpIdVal && !morphemeForEdit) ||
    !phoneticsTypes ||
    !morphemeRanges ||
    !morphemesQuery ||
    !phoneticsChanges ||
    !phoneticsChangesQuery ||
    !phoneticsOptions
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

  //10. საბმიტის ფუნქცია
  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    dispatch(clearAllAlerts());
    if (haveErrors) return;

    //გადავიტანოთ ფორმის მონაცემები ძირითად მონაცემებში
    //წავშალოთ ფორმის ინფორმაცია, რადგან ის საჭირო არ არის შენახვისას

    const currentForm = JSON.parse(JSON.stringify(frm)) as MorphemeEditFormData;

    // delete currentForm.formData;
    if (currentForm.morpheme.phoneticsTypeId === 0)
      currentForm.morpheme.phoneticsTypeId = null;

    if (curMrpIdVal) updateMorpheme(currentForm);
    else createMorpheme(currentForm);
    clearUsedTables();
  }

  //დავიანგარიშოთ იმ მორფემების სია, რომლებიც შეიძლება ჩაენაცვლოს სარედაქტირებელ მორფემას, როგორც ფონეტიკური ვარიანტები
  //პირველ ეტაპზე ავიღოთ მხოლოდ 0-ზე მეტი ნომრით იმავე რანგის მორფემები, გარდა დასარედაქტირებელისა.
  //შემდგომში როცა ფონეტიკური ტიპის არჩევა მოხდება. მორფემების არჩევა თვითონ უნდა მოხდეს ფონეტიკური დაანგარიშების საშუალებით
  //და რედაქტირების დროსაც სხვა არჩევანის საშუალება არ უნდა მოგვცეს.
  const substMorphemes = morphemesQuery
    .filter(
      (f) =>
        f.morphemeRangeId === frm.morpheme.morphemeRangeId &&
        f.mrpId !== curMrpIdVal &&
        f.mrpNom > -1
    )
    .sort((a, b) => a.mrpNom - b.mrpNom);

  //console.log("MorphemeEdit morphemesQuery=", morphemesQuery);
  //console.log("MorphemeEdit substMorphemes=", substMorphemes);

  return (
    <Row>
      <Col md="6">
        <AlertMessages alertKind={EAlertKind.ClientRunTime} />
        <Form onSubmit={handleSubmit}>
          <EditorHeader
            curIdVal={curMrpIdVal}
            EditorName="მორფემა"
            EditorNameGenitive="მორფემის"
            EditedObjectName={
              frm && frm.morpheme && frm.morpheme.mrpMorpheme
                ? frm.morpheme.mrpMorpheme
                : ""
            }
            workingOnDelete={workingOnDeleteMorpheme}
            DeleteFailure={DeleteFailure}
            onDelete={() => {
              if (!!curMrpIdVal) deleteMorpheme(curMrpIdVal);
              clearUsedTables();
            }}
            allowDelete={morphemesDataType.delete}
          />
          <OneStrongLabel
            controlId="mainParametersLabel"
            label="მთავარი პარამეტრები"
          />
          <OneComboBoxControl
            controlId="morpheme.morphemeRangeId"
            label="რანგი"
            value={frm.morpheme.morphemeRangeId}
            dataMember={morphemeRanges}
            valueMember="mrId"
            displayMember="mrKey"
            secondDisplayMember="mrName"
            getError={getError}
            onChangeValue={changeField}
            firstItem={{ id: 0, name: "აირჩიეთ რანგი" }}
          />
          <OneNumberControl
            controlId="morpheme.mrpNom"
            label="რიგითი ნომერი"
            value={frm.morpheme.mrpNom}
            getError={getError}
            onChangeValue={changeField}
          />
          <OneTextControl
            controlId="morpheme.mrpMorpheme"
            label="მორფემა"
            value={frm.morpheme.mrpMorpheme}
            getError={getError}
            onChangeValue={changeField}
          />
          <OneComboBoxControl
            controlId="morpheme.phoneticsTypeId"
            label="ფონეტიკური ტიპი"
            value={frm.morpheme.phoneticsTypeId}
            dataMember={phoneticsTypes}
            valueMember="phtId"
            displayMember="phtName"
            getError={getError}
            onChangeValue={(fieldPath, value) => {
              setPhoneticsType(frm, value);
            }}
            firstItem={{ id: 0, name: "უცვლელი" }}
          />
          <OneStrongLabel
            controlId="phoneticsOptions"
            label="ფონეტიკური ვარიანტები"
          />
          {!!frm.morpheme.phoneticsTypeId &&
            phoneticsChanges
              .filter(
                (pc) =>
                  pc.phoneticsTypeId === frm.morpheme.phoneticsTypeId &&
                  pc.phoneticsOptionId
              )
              .sort(
                (a, b) =>
                  a.phoneticsTypeByOptionSequentialNumber -
                  b.phoneticsTypeByOptionSequentialNumber
              )
              .map((m, index) => {
                const phoName = phoneticsOptions.find(
                  (f) => f.phoId === m.phoneticsOptionId
                )?.phoName;
                const fieldName = `phoneticsOptionMorphemeIds[${index}]`;
                const value =
                  frm.phoneticsOptionMorphemeIds &&
                  index < frm.phoneticsOptionMorphemeIds.length
                    ? frm.phoneticsOptionMorphemeIds[index]
                    : 0;
                //console.log("MorphemeEdit frm.phoneticsOptionMorphemeIds=", frm.phoneticsOptionMorphemeIds);
                return (
                  <OneComboBoxControl
                    key={index}
                    controlId={fieldName}
                    label={`ვარიანტი ${index + 1}. ${phoName}`}
                    value={value}
                    dataMember={substMorphemes}
                    valueMember="mrpId"
                    displayMember="mrpName"
                    getError={getError}
                    onChangeValue={changeField}
                    firstItem={{ id: 0, name: "აირჩიეთ მორფემა" }}
                    sortByDisplayMember={false}
                  />
                );
              })}

          <PhoneticsCombEditor
            controlGroupId="morphemeOccasionPhoneticsChangeIds"
            label="ფონეტიკური შესაძლებლობები"
            basePhoneticsChanges={frm.morphemeOccasionPhoneticsChangeIds}
            phoneticsChanges={phoneticsChangesQuery}
            getError={getError}
            onChangeValue={changeField}
            onTrashButtonClick={(index) => {
              const newFrm = { ...frm };
              newFrm.morphemeOccasionPhoneticsChangeIds.splice(index, 1);
              setFormData(newFrm);
            }}
            onPlusButtonClick={() => {
              const newFrm = { ...frm };
              newFrm.morphemeOccasionPhoneticsChangeIds.push(0);
              setFormData(newFrm);
            }}
          />

          <OneSaveCancelButtons
            curIdVal={curMrpIdVal}
            haveErrors={haveErrors}
            savingNow={creatingMorpheme || updatingMorpheme}
            onCloseClick={() => {
              dispatch(clearAllAlerts());
              navigate(-1); //goBack
            }}
            allowEdit={morphemesDataType.update}
          />
          <OneErrorRow allErrors={allErrors} />
        </Form>
      </Col>
    </Row>
  );
};

export default MorphemeEdit;

// function mapStateToProps(state) {
//   const alert = state.alert;
//   const { savingMorpheme, loadingMorpheme, workingOnDeleteMorpheme, morphemeForEdit, DeleteFailure } = state.modelEditorStore
//   const masterData = state.masterData;

//   return { alert, masterData,
//     savingMorpheme, loadingMorpheme, workingOnDeleteMorpheme, morphemeForEdit, DeleteFailure
//    };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     getOneMorphemeById: (mrpId) => dispatch(ModelEditorActions.getOneMorphemeById(mrpId)),
//     updateMorpheme: (history, mrp) => dispatch(ModelEditorActions.updateMorpheme(history, mrp)),
//     createMorpheme: (history, mrp) => dispatch(ModelEditorActions.createMorpheme(history, mrp)),
//     deleteMorpheme: (history, mrpId) => dispatch(ModelEditorActions.deleteMorpheme(history, mrpId)),
//     clearDeletingFailure: () => dispatch(ModelEditorActions.clearDeletingFailure()),
//     checkLoadMdTables: (tableNames) => dispatch(MasterDataActions.checkLoadMdTables(tableNames)),
//     clearTablesFromRepo: (tableNamesFroClear, tableNamesFroLoad) => dispatch(MasterDataActions.clearTablesFromRepo(tableNamesFroClear, tableNamesFroLoad)),
//     clearAlert: () => dispatch(alertActions.clear())
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(MorphemeEdit);
