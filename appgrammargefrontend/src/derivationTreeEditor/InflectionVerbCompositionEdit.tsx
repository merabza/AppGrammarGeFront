//InflectionVerbCompositionEdit.tsx

import { useEffect, useState, useMemo, FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";

import Paradigm from "./Paradigm";
import StatusConfirmRejectPart from "./StatusConfirmRejectPart";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { MorphemeRange, Pronoun, classifierModel } from "../masterData/mdTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import {
  InflectionVerbCompositionData,
  inflectionVerbCompositionDataSchema,
  inflectionVerbCompositionPredecessorsModel,
} from "./TypesAndSchemas/InflectionVerbCompositionDataTypeAndSchema";
import {
  clearForConfirmRootsPagesMemo,
  clearMemo,
  clearRoot,
} from "../redux/slices/rootsSlice";
import { useClearTablesFromRepo } from "../appcarcass/masterdata/masterDataHooks/useClearTablesFromRepo";
import { useLazyGetOneInflectionVerbCompositionByIdQuery } from "../redux/api/inflectionVerbCompositionCrudApi";
import { useCheckLoadRootsByInflectionVerbCompositionId } from "./derivationCrudHooks/useCheckLoadRootsByInflectionVerbCompositionId";
import WaitPage from "../appcarcass/common/WaitPage";
import { useCreateOrUpdateInflectionVerbComposition } from "./derivationCrudHooks/useCreateOrUpdateInflectionVerbComposition";
import EditorHeader from "../appcarcass/editorParts/EditorHeader";
import { useDeleteInflectionVerbComposition } from "./derivationCrudHooks/useDeleteInflectionVerbComposition";
import { setDeleteFailureInflectionVerbComposition } from "../redux/slices/inflectionVerbCompositionCrudSlice";
import { useConfirmRejectInflectionVerbComposition } from "./derivationCrudHooks/useConfirmRejectInflectionVerbComposition";
import OnePlaintextRow from "../appcarcass/editorParts/OnePlaintextRow";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import OneSaveCancelButtons from "../appcarcass/editorParts/OneSaveCancelButtons";
import InflectionVerbCompositionPredecessors from "./InflectionVerbCompositionPredecessors";
import OneErrorRow from "../appcarcass/editorParts/OneErrorRow";
import {
  clearAllAlerts,
  EAlertKind,
} from "../appcarcass/redux/slices/alertSlice";
import { useAlert } from "../appcarcass/hooks/useAlert";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { useForman } from "../appcarcass/hooks/useForman";
import { isAllowEditAndDelete } from "./dteFunctions";

const InflectionVerbCompositionEdit: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  //1. იდენტიფიკატორი
  const [curIvcIdVal, setCurIvcIdVal] = useState<number | undefined>(undefined);
  const [curInfIdVal, setCurInfIdVal] = useState<number | undefined>(undefined);
  const [curDbrIdVal, setCurDbrIdVal] = useState<number | undefined>(undefined);
  const [currentRootId, setCurrentRootId] = useState<number | undefined>(
    undefined
  );

  const [
    deleteInflectionVerbComposition,
    workingOnDeleteInflectionVerbComposition,
    DeleteFailure,
  ] = useDeleteInflectionVerbComposition();

  const [
    createOrUpdateInflectionVerbComposition,
    creatingOrupdatingInflectionVerbComposition,
  ] = useCreateOrUpdateInflectionVerbComposition();

  const [
    confirmRejectInflectionVerbComposition,
    workingOnConfirmRejectInflectionVerbComposition,
    confirmRejectFailure,
    clearConfirmRejectFailure,
  ] = useConfirmRejectInflectionVerbComposition();

  const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
    useAppSelector((state) => state.masterDataState);

  const { rootLoading } = useAppSelector((state) => state.rootsState);

  //const pronouns = mdRepo.pronouns as Pronoun[];
  const morphemeRanges = mdataRepo.morphemeRanges as MorphemeRange[];
  const classifiers = mdataRepo.classifiers as classifierModel[];

  //console.log("InflectionVerbCompositionEdit props=", props);

  //3. ეს არის ის ცხრილები, რომელზეც მოქმედებს ეს კონკრეტული რედაქტორი
  //   const tableNamesForClear = [];
  const [checkLoadMdTables] = useCheckLoadMdTables();

  //4. ეს არის ის ცხრილები, რომლებიდანაც ინფორმაცია სჭირდება ამ რედაქტრს
  const tableNamesForLoad = useMemo(
    () => ["pronouns", "morphemeRanges", "classifiers"],
    []
  );

  const [clearTables] = useClearTablesFromRepo();

  const { user } = useAppSelector((state) => state.userState);

  useEffect(() => {
    checkLoadMdTables(tableNamesForLoad);
  }, [tableNamesForLoad]); //, checkLoadMdTables - ჩამტვირთავი მეთოდების ჩანატება useEffect-ის დამოკიდებულებებში იწვევს ჩაციკვლას

  // useEffect(() => {
  //   if ( !verbRowParadigmsByVerbTypesLoading && !verbRowParadigmsByVerbTypesLoadingFailure && !verbRowParadigmsByVerbTypes )
  //     GetVerbRowParadigmsByVerbTypes();
  // }, [verbRowParadigmsByVerbTypesLoading, verbRowParadigmsByVerbTypesLoadingFailure,
  //   verbRowParadigmsByVerbTypes, GetVerbRowParadigmsByVerbTypes]);

  //5. სარედაქტირებელი ობიექტის სქემა

  //console.log("InflectionVerbCompositionEdit yupSchema=", yupSchema);
  //console.log("InflectionVerbCompositionEdit yupSchema.fields=", yupSchema.fields);
  //console.log("InflectionVerbCompositionEdit yupSchema.fields.verb=", yupSchema.fields.verb);
  //console.log("InflectionVerbCompositionEdit yupSchema.fields.verb.fields=", yupSchema.fields.verb.fields);
  //console.log("InflectionVerbCompositionEdit yupSchema.fields.verb.fields.keys()=", Object.keys(yupSchema.fields.verb.fields));

  //6. ფორმის მენეჯერი
  const [
    frm,
    changeField,
    getError,
    getAllErrors,
    clearToDefaults,
    setFormData,
  ] = useForman<
    typeof inflectionVerbCompositionDataSchema,
    InflectionVerbCompositionData
  >(inflectionVerbCompositionDataSchema);

  function clearUsedTables() {
    dispatch(clearMemo());
    clearTables(null, tableNamesForLoad);
    if (currentRootId) dispatch(clearRoot(currentRootId));
    dispatch(clearForConfirmRootsPagesMemo());
  }

  const { rootId: fromParamsRootId } = useParams<string>();
  const { dbrId: fromParamsDbrId } = useParams<string>();
  const { infId: fromParamsInfId } = useParams<string>();
  const { ivcId: fromParamsIvcId } = useParams<string>();

  const [
    getOneInflectionVerbCompositionById,
    { isLoading: loadingInflectionVerbComposition },
  ] = useLazyGetOneInflectionVerbCompositionByIdQuery();
  const [CheckLoadRootsByInflectionVerbCompositionId] =
    useCheckLoadRootsByInflectionVerbCompositionId();

  const { inflectionVerbCompositionForEdit } = useAppSelector(
    (state) => state.inflectionVerbCompositionCrudState
  );

  //7. იდენტიფიკატორის ეფექტი
  useEffect(() => {
    //დავადგინოთ ძირის იდენტიფიკატორი
    const rootIdVal = fromParamsRootId ? parseInt(fromParamsRootId) : 0;
    if (currentRootId !== rootIdVal) setCurrentRootId(rootIdVal);

    //დავადგინოთ ძირის იდენტიფიკატორი
    const dbrIdVal = fromParamsDbrId ? parseInt(fromParamsDbrId) : 0;
    if (curDbrIdVal !== dbrIdVal) setCurDbrIdVal(dbrIdVal);

    //დავადგინოთ ფლექსიის იდენტიფიკატორი
    const infIdVal = fromParamsInfId ? parseInt(fromParamsInfId) : 0;
    if (curInfIdVal !== infIdVal) setCurInfIdVal(infIdVal);

    const ivcIdVal = fromParamsIvcId ? parseInt(fromParamsIvcId) : 0;
    //ვამოწმებთ მისამართში შეიცვალა თუ არა იდენტიფიკატორი
    if (curIvcIdVal !== ivcIdVal) {
      //შეცვლილა
      //დავიმახსოვროთ შეცვლილი იდენტიფიკატორი
      setCurIvcIdVal(ivcIdVal);
      if (ivcIdVal) {
        //თუ იდენტიფიკატორი კარგია, ჩავტვირთოთ ბაზიდან ინფორმაცია
        getOneInflectionVerbCompositionById(ivcIdVal);
        CheckLoadRootsByInflectionVerbCompositionId(ivcIdVal);
        return;
      }

      //ახალი სარედაქტირებელი ობიექტის შექმნა
      clearToDefaults();
      return;
    }

    //console.log("InflectionVerbCompositionEdit Check for load");

    //console.log("Before setInflectionType ", {loadingInflectionVerbComposition, infId, inflectionForEdit, mdWorkingOnLoad,
    //   inflectionBlocks, inflectionTypes, morphemeGroups, morphemeRanges, morphemesQuery, morphemeRangesByInflectionBlocks, rootLoading})
    //console.log("Check for load", {loadingInflectionVerbComposition, fromParamsInfId,
    //  inflectionVerbCompositionForEdit, mdWorkingOnLoad, pronouns, morphemeRanges, rootLoading});

    //აქ თუ მოვედით, ესეიგი იდენტიფიკატორი იგივეა და კომპონენტის თვისებები შეიცვალა
    //ანუ სავარაუდოდ ჩატვირთვა დამთავრდა
    //თუმცა მაინც უნდა დავრწმუნდეთ
    //ან თუ ახალი ჩანაწერი იქნება, ჩატვირთვას არ ველოდებით
    //ან თუ ჩატვირთვა კი დასრულდა, მაგრამ ჩატვირთულიობიექტი მაინც შევამოწმოთ
    if (
      loadingInflectionVerbComposition ||
      !fromParamsInfId ||
      !inflectionVerbCompositionForEdit ||
      mdWorkingOnLoad ||
      Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
      //!pronouns ||
      !morphemeRanges ||
      !classifiers ||
      rootLoading
    )
      return;

    //console.log("InflectionVerbCompositionEdit inflectionVerbCompositionForEdit=",inflectionVerbCompositionForEdit);

    setFormData(inflectionVerbCompositionForEdit);
  }, [
    //pronouns,
    morphemeRanges,
    classifiers,
    curIvcIdVal,
    curInfIdVal,
    curDbrIdVal,
    currentRootId,
    inflectionVerbCompositionForEdit,
    loadingInflectionVerbComposition,
    mdWorkingOnLoad,
    mdWorkingOnLoadingTables,
    fromParamsRootId,
    fromParamsDbrId,
    fromParamsInfId,
    fromParamsIvcId,
    rootLoading,
    // getOneInflectionVerbCompositionById,
    // clearToDefaults,
    // CheckLoadRootsByInflectionVerbCompositionId,
    // setFormData,
  ]);

  const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

  if (ApiLoadHaveErrors)
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );

  if (
    loadingInflectionVerbComposition ||
    mdWorkingOnLoad ||
    Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
    rootLoading
  )
    //თუ ინფორმაციის ჩატვირთვა ჯერ კიდევ მიმდინარეობა
    return <WaitPage />;

  //8. ჩატვირთვის შემოწმება
  //თუ იდენტიფიკატორი წესიერია და ჩატვირთული ობიექტი ჯერ არ არის, ან საჭირო ცხრილები ჩატვირთული არ არის
  if (/*!pronouns ||*/ !morphemeRanges || !classifiers) {
    return (
      <div>
        <h5>ინფორმაციის ჩატვირთვის პრობლემა!</h5>
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

    const currentForm = { ...frm } as InflectionVerbCompositionData;
    //delete currentForm.formData;

    currentForm.inflectionVerbCompositionPredecessors.forEach(
      (pred, index, arr) => {
        if (pred.lastMorphemeRangeId === 0)
          arr[index].lastMorphemeRangeId = undefined;
      }
    );

    createOrUpdateInflectionVerbComposition(
      curInfIdVal,
      curDbrIdVal,
      currentRootId,
      currentForm
    );

    clearUsedTables();
  }

  //console.log("InflectionVerbCompositionEdit frm=",frm);

  const inflectionVerbCompositionResultName =
    frm &&
    frm.inflectionVerbComposition &&
    frm.inflectionVerbComposition.ivcName
      ? frm.inflectionVerbComposition.ivcName
      : "";
  const userHasConfirmRight =
    user?.appClaims.some((s) => s === "Confirm") ?? false;

  const allowEditAndDelete = isAllowEditAndDelete(
    curIvcIdVal,
    user?.userName,
    frm.inflectionVerbComposition.creator,
    frm.inflectionVerbComposition.recordStatusId,
    userHasConfirmRight
  );

  const verbCompositionLastRanges = morphemeRanges
    .filter((f) => f.mrVerbCompositionSelectable)
    .sort((a, b) => a.mrPosition - b.mrPosition)
    .map(function (item) {
      return { mrId: item.mrId, mrKeyName: `${item.mrKey}-${item.mrName}` };
    });

  // debugger;

  return (
    <Row className="root-editor-row">
      <Col md="8" className="root-editor-column">
        <div id="root-deriv-tree" className="root-editor-scroll">
          {/* {alertMessage && <Alert variant={alertType}>{alertMessage}</Alert>} */}
          <Form onSubmit={handleSubmit}>
            <EditorHeader
              curIdVal={curDbrIdVal}
              EditorName="ზმნური კომპოზიცია"
              EditorNameGenitive="ზმნური კომპოზიციის"
              EditedObjectName={inflectionVerbCompositionResultName}
              workingOnDelete={workingOnDeleteInflectionVerbComposition}
              DeleteFailure={DeleteFailure}
              onDelete={() => {
                deleteInflectionVerbComposition(
                  curIvcIdVal,
                  curInfIdVal,
                  curDbrIdVal,
                  currentRootId
                );
                clearUsedTables();
              }}
              onClearDeletingFailure={() => {
                dispatch(setDeleteFailureInflectionVerbComposition(false));
              }}
              allowDelete={allowEditAndDelete}
            />

            {userHasConfirmRight &&
              frm.inflectionVerbComposition.recordStatusId !== undefined && (
                <StatusConfirmRejectPart
                  recordStatusId={frm.inflectionVerbComposition.recordStatusId}
                  creator={frm.inflectionVerbComposition.creator}
                  applier={frm.inflectionVerbComposition.applier}
                  workingOnConfirmReject={
                    workingOnConfirmRejectInflectionVerbComposition
                  }
                  confirmRejectFailure={confirmRejectFailure}
                  onConfirmRejectClick={(confirm, withAllDescendants) => {
                    confirmRejectInflectionVerbComposition(
                      curIvcIdVal,
                      curInfIdVal,
                      curDbrIdVal,
                      currentRootId,
                      confirm,
                      withAllDescendants
                    );
                    clearUsedTables();
                  }}
                  onClearConfirmRejectFailure={() => {
                    clearConfirmRejectFailure();
                  }}
                />
              )}

            <OnePlaintextRow
              controlId="result"
              label="შედეგი"
              text={inflectionVerbCompositionResultName}
            />

            <OneStrongLabel
              controlId="mainParametersLabel"
              label="მთავარი პარამეტრები"
            />

            <div>
              <OneComboBoxControl
                controlId="inflectionVerbComposition.classifierId"
                label="კლასიფიკატორი"
                value={frm.inflectionVerbComposition.classifierId}
                dataMember={classifiers}
                firstItem={{ id: 0, name: "არცერთი" }}
                valueMember="clfId"
                displayMember="clfName"
                sortByDisplayMember={true}
                getError={getError}
                firstItemIsSelectable
                onChangeValue={changeField}
              />

              <InflectionVerbCompositionPredecessors
                predecessors={frm.inflectionVerbCompositionPredecessors}
                verbCompositionLastRanges={verbCompositionLastRanges}
                getError={getError}
                onPredecessorChange={(parentNom, item) => {
                  const newForm = { ...frm };

                  let predByVerbComposition =
                    newForm.inflectionVerbCompositionPredecessors.find(
                      (pred) => pred.parentNom === parentNom
                    );
                  if (item) {
                    if (!predByVerbComposition) {
                      predByVerbComposition =
                        {} as inflectionVerbCompositionPredecessorsModel;
                      predByVerbComposition.parentNom = parentNom;
                      predByVerbComposition.parentInflectionId = item.itemId;
                      predByVerbComposition.lastMorphemeRangeId = parentNom
                        ? null
                        : 3;
                      newForm.inflectionVerbCompositionPredecessors.push(
                        predByVerbComposition
                      );
                    } else {
                      predByVerbComposition.parentInflectionId = item.itemId;
                    }
                  } else {
                    if (predByVerbComposition) {
                      newForm.inflectionVerbCompositionPredecessors =
                        newForm.inflectionVerbCompositionPredecessors.filter(
                          (pred) => pred.parentNom !== parentNom
                        );
                    }
                  }
                  //console.log("InflectionVerbCompositionEdit onPredecessorChange newForm=",newForm);
                  setFormData(newForm);
                }}
                onPredecessorLastMorphemeRangeIdChange={(
                  parentNom: number,
                  value: number
                ) => {
                  //console.log("!!!InflectionVerbCompositionEdit onPredecessorLastMorphemeRangeIdChange {parentNom, value}=",{parentNom, value});
                  const newForm = { ...frm };
                  const predecessor =
                    newForm.inflectionVerbCompositionPredecessors.find(
                      (pred) => pred.parentNom === parentNom
                    );
                  if (!predecessor) return;
                  predecessor.lastMorphemeRangeId = value;
                  //console.log("!!!InflectionVerbCompositionEdit onPredecessorLastMorphemeRangeIdChange newForm=",newForm);
                  setFormData(newForm);
                }}
              />
            </div>

            <OneSaveCancelButtons
              curIdVal={curIvcIdVal}
              haveErrors={haveErrors}
              savingNow={creatingOrupdatingInflectionVerbComposition}
              onCloseClick={() => {
                dispatch(clearAllAlerts());
                navigate(-1); //goBack
              }}
              allowEdit={allowEditAndDelete}
            />
            <OneErrorRow allErrors={allErrors} />
          </Form>
        </div>
      </Col>

      {/* <Route
        path="/inflVerbCompEdit/:ivcId/:infId?/:dbrId?/:rootId?"
        element={<Paradigm />}
      /> */}
      {!!curIvcIdVal && (
        <Paradigm
          InflectionIdentifier={curIvcIdVal}
          InflectionVerbComposition
        />
      )}
    </Row>
  );
};

export default InflectionVerbCompositionEdit;
