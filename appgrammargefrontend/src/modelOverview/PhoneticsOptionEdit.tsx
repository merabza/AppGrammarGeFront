//PhoneticsOptionEdit.tsx

import { useState, useEffect, useMemo, FC } from "react";
import { Form, Row, Col } from "react-bootstrap";
import * as yup from "yup";

import { GetOnephoneticsOptionDetailDescription } from "./PhoneticsTypeModule";
import { useNavigate, useParams } from "react-router-dom";
import { useForman } from "../appcarcass/hooks/useForman";
import {
  PhoneticsOptionEditFormData,
  phoneticsOptionEditFormDataSchema,
} from "./PhoneticsOptionEditFormData";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import {
  useCreatePhoneticsOptionMutation,
  useDeletePhoneticsOptionMutation,
  useLazyGetOnePhoneticsOptionByIdQuery,
  useUpdatePhoneticsOptionMutation,
} from "../redux/api/modelEditorPhoneticsOptionsCrudApi";
import WaitPage from "../appcarcass/common/WaitPage";
import AlertMessages from "../appcarcass/common/AlertMessages";
import {
  EAlertKind,
  clearAllAlerts,
} from "../appcarcass/redux/slices/alertSlice";
import { PhoneticsOptionDetail } from "../masterData/mdTypes";
import EditorHeader from "../appcarcass/editorParts/EditorHeader";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import OneTextControl from "../appcarcass/editorParts/OneTextControl";
import OneEditDeleteButtons from "../appcarcass/editorParts/OneEditDeleteButtons";
import OneUpDownButtons from "../appcarcass/editorParts/OneUpDownButtons";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import OneNumberControl from "../appcarcass/editorParts/OneNumberControl";
import OnePlusButton from "../appcarcass/editorParts/OnePlusButton";
import OneSaveCancelButtons from "../appcarcass/editorParts/OneSaveCancelButtons";
import OneErrorRow from "../appcarcass/editorParts/OneErrorRow";
import { useClearTablesFromRepo } from "../appcarcass/masterdata/masterDataHooks/useClearTablesFromRepo";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useAlert } from "../appcarcass/hooks/useAlert";

const PhoneticsOptionEdit: FC = () => {
  //const history = useHistory();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [curPhoIdVal, setCurPhoIdVal] = useState<number | undefined>(undefined); //1. იდენტიფიკატორი
  const [expandedActionIndex, setExpandedActionIndex] = useState<number | null>(
    null
  ); //გახსნილი მოქმედების ნომერი

  // //2. კომპონენტის თვისებები
  // const {
  //   alert,
  //   datatypesLoading,
  //   datatypes,
  //   checkLoadDataTypes,
  //   savingPhoneticsOption,
  //   loadingPhoneticsOption,
  //   DeleteFailure,
  //   workingOnDeletePhoneticsOption,
  //   phoneticsOptionForEdit,
  //   getOnePhoneticsOptionById,
  // } = props;

  const { phoId } = useParams<string>();

  //3. ეს არის ის ცხრილები, რომელზეც მოქმედებს ეს კონკრეტული რედაქტორი
  const tableNamesForClear = useMemo(
    () => ["phoneticsOptions", "phoneticsOptionDetails"],
    []
  );

  const { phoneticsOptionForEdit } = useAppSelector(
    (state) => state.modelEditorPhoneticsOptionsCrudState
  );

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const { mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );

  const [createPhoneticsOption, { isLoading: creatingPhoneticsOption }] =
    useCreatePhoneticsOptionMutation();
  const [updatePhoneticsOption, { isLoading: updatingPhoneticsOption }] =
    useUpdatePhoneticsOptionMutation();
  const [
    deletePhoneticsOption,
    { isLoading: workingOnDeletePhoneticsOption, isError: DeleteFailure },
  ] = useDeletePhoneticsOptionMutation();

  const [clearTablesFromRepo] = useClearTablesFromRepo();
  const [checkLoadMdTables] = useCheckLoadMdTables();

  //4. ამ რედაქტორს არ სჭირდება ინფორმაცია ცხრილებიდან
  // const tableNamesFroLoad = [];

  //6. ფორმის მენეჯერი
  const [
    frm,
    changeField,
    getError,
    getAllErrors,
    clearToDefaults,
    setFormData,
  ] = useForman<
    typeof phoneticsOptionEditFormDataSchema,
    PhoneticsOptionEditFormData
  >(phoneticsOptionEditFormDataSchema);

  function clearUsedTables() {
    clearTablesFromRepo(tableNamesForClear, null);
  }

  useEffect(() => {
    checkLoadMdTables(null);
  }, [dataTypes]);

  const [getOnePhoneticsOptionById, { isLoading: loadingPhoneticsOption }] =
    useLazyGetOnePhoneticsOptionByIdQuery();

  //7. იდენტიფიკატორის ეფექტი
  useEffect(() => {
    const phoIdVal = phoId ? parseInt(phoId) : 0;

    //ვამოწმებთ მისამართში შეიცვალა თუ არა იდენტიფიკატორი
    if (curPhoIdVal !== phoIdVal) {
      //შეცვლილა
      //დავიმახსოვროთ შეცვლილი იდენტიფიკატორი
      setCurPhoIdVal(phoIdVal);
      if (phoIdVal) {
        //თუ იდენტიფიკატორი კარგია, ჩავტვირთოთ ბაზიდან ინფორმაცია
        getOnePhoneticsOptionById(phoIdVal);
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
    if (loadingPhoneticsOption || !phoId || !phoneticsOptionForEdit) return;

    //ჩატვირთული ინფორმაცია მივცეთ ფორმის მენეჯერს
    setFormData(phoneticsOptionForEdit);
  }, [curPhoIdVal, phoId, phoneticsOptionForEdit, loadingPhoneticsOption]);

  //10. საბმიტის ფუნქცია
  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    dispatch(clearAllAlerts());
    if (haveErrors) return;

    const currentForm = JSON.parse(
      JSON.stringify(frm)
    ) as PhoneticsOptionEditFormData;

    if (curPhoIdVal)
      updatePhoneticsOption({
        phoneticsOptionEditFormData: currentForm,
        navigate,
      });
    else
      createPhoneticsOption({
        phoneticsOptionEditFormData: currentForm,
        navigate,
      });
    clearUsedTables();
  }

  function renumDetails(phoneticsOptionDetails: PhoneticsOptionDetail[]) {
    phoneticsOptionDetails
      .sort((a, b) => a.phodActOrd - b.phodActOrd)
      .forEach((e, i) => (e.phodActOrd = i));
  }

  function goDetailDown(index: number) {
    renumDetails(frm.phoneticsOptionDetails);
    frm.phoneticsOptionDetails[index].phodActOrd = index + 1;
    frm.phoneticsOptionDetails[index + 1].phodActOrd = index;
  }

  const PhoneticsOptionsDataType = dataTypes.find(
    (f) => f.dtTable === "phoneticsOptions"
  );

  const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

  if (ApiLoadHaveErrors)
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );

  if (loadingPhoneticsOption || mdWorkingOnLoad || mdWorkingOnLoadingTables)
    //თუ ინფორმაციის ჩატვირთვა ჯერ კიდევ მიმდინარეობა
    return <WaitPage />;

  //8. ჩატვირთვის შემოწმება
  if (
    (curPhoIdVal && !phoneticsOptionForEdit) ||
    !dataTypes ||
    !PhoneticsOptionsDataType
  ) {
    //თუ იდენტიფიკატორი წესიერია და ჩატვირთული ობიექტი ჯერ არ არის
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

  return (
    <Row>
      <Col sm="6">
        <AlertMessages alertKind={EAlertKind.ClientRunTime} />
        <Form onSubmit={handleSubmit}>
          <EditorHeader
            curIdVal={curPhoIdVal}
            EditorName="ფონეტიკური ვარიანტი"
            EditorNameGenitive="ფონეტიკური ვარიანტის"
            EditedObjectName={
              frm && frm.phoneticsOption && frm.phoneticsOption.phoName
                ? frm.phoneticsOption.phoName
                : ""
            }
            workingOnDelete={workingOnDeletePhoneticsOption}
            DeleteFailure={DeleteFailure}
            onDelete={() => {
              if (!!curPhoIdVal)
                deletePhoneticsOption({ phoId: curPhoIdVal, navigate });
              clearUsedTables();
            }}
            allowDelete={PhoneticsOptionsDataType.delete}
          />
          <OneStrongLabel
            controlId="mainParametersLabel"
            label="მთავარი პარამეტრები"
          />
          <OneTextControl
            controlId="phoneticsOption.phoName"
            label="დასახელება"
            value={frm.phoneticsOption.phoName}
            getError={getError}
            onChangeValue={changeField}
          />
          <OneStrongLabel
            controlId="phoneticsOptionDetailsLabel"
            label="დეტალები"
          />
          <ol>
            {frm &&
              frm.phoneticsOptionDetails &&
              frm.phoneticsOptionDetails
                .sort((a, b) => a.phodActOrd - b.phodActOrd)
                .map((phod, index) => {
                  return (
                    <li key={index}>
                      <OneEditDeleteButtons
                        controlId={index.toString()}
                        label={GetOnephoneticsOptionDetailDescription(phod)}
                        onEditClick={(e) => {
                          e.preventDefault();
                          if (expandedActionIndex === index)
                            setExpandedActionIndex(null);
                          setExpandedActionIndex(index);
                        }}
                        onDeleteClick={(e) => {
                          e.preventDefault();
                          const newFrm = { ...frm };
                          newFrm.phoneticsOptionDetails.splice(index, 1);
                          setFormData(newFrm);
                        }}
                      />
                      {expandedActionIndex === index && (
                        <div>
                          <OneUpDownButtons
                            controlId={index.toString()}
                            label="პოზიციის ცვლილება"
                            enableUp={index > 0}
                            enableDown={
                              index < frm.phoneticsOptionDetails.length - 1
                            }
                            onUpClick={(e) => {
                              e.preventDefault();
                              goDetailDown(index - 1);
                              setExpandedActionIndex(index - 1);
                            }}
                            onDownClick={(e) => {
                              e.preventDefault();
                              goDetailDown(index);
                              setExpandedActionIndex(index + 1);
                            }}
                          />
                          {/* <Form.Label column sm="10">რედაქტირდება აკრძალვა ინდექსით {index}</Form.Label> */}
                          {/* {getOneNumberControl(`phoneticsOptionDetails[${index}].phodActOrd`, "რიგირთი ნომერი", frm.phoneticsOptionDetails[index].phodActOrd, 0)} */}
                          <OneComboBoxControl
                            controlId={`phoneticsOptionDetails[${index}].phodActId`}
                            label="მოქმედების ტიპი"
                            value={frm.phoneticsOptionDetails[index].phodActId}
                            dataMember={[
                              { id: 0, name: "იკარგება/ჩაენაცვლება" },
                              { id: 1, name: "ჩნდება" },
                            ]}
                            valueMember="id"
                            displayMember="name"
                            getError={getError}
                            onChangeValue={changeField}
                          />
                          <OneComboBoxControl
                            controlId={`phoneticsOptionDetails[${index}].phodOrient`}
                            label="ორიენტაცია"
                            value={frm.phoneticsOptionDetails[index].phodOrient}
                            dataMember={[
                              { id: 0, name: "ბოლოდან" },
                              { id: 1, name: "თავიდან" },
                            ]}
                            valueMember="id"
                            displayMember="name"
                            getError={getError}
                            onChangeValue={changeField}
                          />
                          <OneNumberControl
                            controlId={`phoneticsOptionDetails[${index}].phodStart`}
                            label="პირველი სიმბოლოს ნომერი"
                            value={frm.phoneticsOptionDetails[index].phodStart}
                            getError={getError}
                            onChangeValue={changeField}
                            minv={0}
                          />
                          <OneNumberControl
                            controlId={`phoneticsOptionDetails[${index}].phodCount`}
                            label="სიმბოლოების რაოდენობა"
                            value={frm.phoneticsOptionDetails[index].phodCount}
                            getError={getError}
                            onChangeValue={changeField}
                            minv={1}
                          />
                          <OneComboBoxControl
                            controlId={`phoneticsOptionDetails[${index}].phodObject`}
                            label="ობიექტის ტიპი"
                            value={frm.phoneticsOptionDetails[index].phodObject}
                            dataMember={[
                              { id: 0, name: "ბგერა" },
                              { id: 1, name: "ხმოვანი" },
                              { id: 2, name: "თანხმოვანი" },
                            ]}
                            valueMember="id"
                            displayMember="name"
                            getError={getError}
                            onChangeValue={changeField}
                          />
                          <OneTextControl
                            controlId={`phoneticsOptionDetails[${index}].phodNew`}
                            label="სიმბოლოები"
                            value={frm.phoneticsOptionDetails[index].phodNew}
                            getError={getError}
                            onChangeValue={changeField}
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
          </ol>

          {PhoneticsOptionsDataType.update && (
            <OnePlusButton
              onClick={(e) => {
                e.preventDefault();

                const newFrm = { ...frm };
                let newPod = yup
                  .reach(
                    phoneticsOptionEditFormDataSchema,
                    "phoneticsOptionDetails[0]"
                  )
                  .cast({}) as PhoneticsOptionDetail;
                if (newPod) {
                  newPod.phodActOrd = newFrm.phoneticsOptionDetails.length + 1;
                  newFrm.phoneticsOptionDetails.push(newPod);
                  setFormData(newFrm);
                  setExpandedActionIndex(
                    newFrm.phoneticsOptionDetails.length - 1
                  );
                }
              }}
            />
          )}

          <OneSaveCancelButtons
            curIdVal={curPhoIdVal}
            haveErrors={haveErrors}
            savingNow={creatingPhoneticsOption || updatingPhoneticsOption}
            onCloseClick={() => {
              dispatch(clearAllAlerts());
              navigate(-1); //goBack
            }}
            allowEdit={PhoneticsOptionsDataType.update}
          />

          <OneErrorRow allErrors={allErrors} />
        </Form>
      </Col>
    </Row>
  );
};

export default PhoneticsOptionEdit;

// function mapStateToProps(state) {
//   const { datatypesLoading, datatypes } = state.masterData;
//   const {
//     DeleteFailure,
//     savingPhoneticsOption,
//     loadingPhoneticsOption,
//     workingOnDeletePhoneticsOption,
//     phoneticsOptionForEdit,
//   } = state.modelEditorStore;
//   const alert = state.alert;

//   return {
//     alert,
//     datatypesLoading,
//     datatypes,
//     DeleteFailure,
//     savingPhoneticsOption,
//     loadingPhoneticsOption,
//     workingOnDeletePhoneticsOption,
//     phoneticsOptionForEdit,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     getOnePhoneticsOptionById: (phoId) =>
//       dispatch(ModelEditorActions.getOnePhoneticsOptionById(phoId)),
//     updatePhoneticsOption: (history, pho) =>
//       dispatch(ModelEditorActions.updatePhoneticsOption(history, pho)),
//     createPhoneticsOption: (history, pho) =>
//       dispatch(ModelEditorActions.createPhoneticsOption(history, pho)),
//     deletePhoneticsOption: (history, phoId) =>
//       dispatch(ModelEditorActions.deletePhoneticsOption(history, phoId)),
//     clearDeletingFailure: () =>
//       dispatch(ModelEditorActions.clearDeletingFailure()),
//     clearTablesFromRepo: (tableNamesForClear) =>
//       dispatch(MasterDataActions.clearTablesFromRepo(tableNamesForClear, [])),
//     checkLoadDataTypes: () => dispatch(MasterDataActions.checkLoadDataTypes()),
//     clearAlert: () => dispatch(alertActions.clear()),
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(PhoneticsOptionEdit);
