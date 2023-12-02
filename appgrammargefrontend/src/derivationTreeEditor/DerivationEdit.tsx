//DerivationEdit.tsx

import { useEffect, useState, useCallback, useMemo, FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";

import PhoneticsCombEditor from "../editorParts/PhoneticsCombEditor";
import StatusConfirmRejectPart from "./StatusConfirmRejectPart";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useCheckLoadDerivationFormulas } from "../modelOverview/formulasHooks/useCheckLoadDerivationFormulas";
import {
  DerivationBranchData,
  DerivationPredecessorModel,
  derivationBranchDataSchema,
} from "./TypesAndSchemas/DerivationBranchDataTypeAndSchema";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import {
  clearForConfirmRootsPagesMemo,
  clearMemo,
} from "../redux/slices/rootsSlice";
import { useClearTablesFromRepo } from "../appcarcass/masterdata/masterDataHooks/useClearTablesFromRepo";
import { useClearRootsByDerivation } from "./derivationCrudHooks/useClearRootsByDerivation";
import {
  DerivationFormulaQueryModel,
  DerivationType,
  Morpheme,
  MorphemeGroup,
  MorphemeRange,
  MorphemeRangeByDerivationType,
  PhoneticsChangeQueryModel,
  PhoneticsType,
  classifierModel,
} from "../masterData/mdTypes";
import {
  clearAllAlerts,
  EAlertKind,
  setAlertClientRunTimeError,
} from "../appcarcass/redux/slices/alertSlice";
import { createFormulaFormData } from "./FormulasModule";
import { useLazyGetOneDerivationBranchByIdQuery } from "../redux/api/derivationCrudApi";
import { useCheckLoadRootsByBranchId } from "./derivationCrudHooks/useCheckLoadRootsByBranchId";
import WaitPage from "../appcarcass/common/WaitPage";
import { useCreateOrUpdateDerivationBranch } from "./derivationCrudHooks/useCreateOrUpdateDerivationBranch";
import EditorHeader from "../appcarcass/editorParts/EditorHeader";
import { useDeleteDerivationBranch } from "./derivationCrudHooks/useDeleteDerivationBranch";
import { setDeleteFailureDerivation } from "../redux/slices/derivationCrudSlice";
import { useConfirmRejectDerivationBranch } from "./derivationCrudHooks/useConfirmRejectDerivationBranch";
import OnePlaintextRow from "../appcarcass/editorParts/OnePlaintextRow";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import BasesAndFreeMorphemes from "./BasesAndFreeMorphemes";
import OneSaveCancelButtons from "../appcarcass/editorParts/OneSaveCancelButtons";
import OneErrorRow from "../appcarcass/editorParts/OneErrorRow";
import { useAlert } from "../appcarcass/hooks/useAlert";
import { Err } from "../appcarcass/redux/types/errorTypes";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { useForman } from "../appcarcass/hooks/useForman";
import { isAllowEditAndDelete } from "./dteFunctions";
import { useCheckLoadLookupTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadLookupTables";
import { ILookup } from "../appcarcass/redux/types/masterdataTypes";

const DerivationEdit: FC = () => {
  const navigate = useNavigate();

  //1. იდენტიფიკატორი
  const [curDbrIdVal, setCurDbrIdVal] = useState<number | undefined>();

  const dispatch = useAppDispatch();

  const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
    useAppSelector((state) => state.masterDataState);

  const { rootLoading } = useAppSelector((state) => state.rootsState);
  const { derivationFormulas } = useAppSelector(
    (state) => state.modelDataState
  );

  const morphemesQuery = mdataRepo.morphemesQuery as Morpheme[];
  const morphemeRanges = mdataRepo.morphemeRanges as MorphemeRange[];
  const derivationTypes = mdataRepo.derivationTypes as DerivationType[];
  const morphemeRangesByDerivationTypes =
    mdataRepo.morphemeRangesByDerivationTypes as MorphemeRangeByDerivationType[];

  const derivationFormulasQuery =
    mdataRepo.derivationFormulasQuery as ILookup[];
  const morphemeGroups = mdataRepo.morphemeGroups as MorphemeGroup[];
  const classifiers = mdataRepo.classifiers as ILookup[];
  const phoneticsChangesQuery =
    mdataRepo.phoneticsChangesQuery as PhoneticsChangeQueryModel[];
  const phoneticsTypes = mdataRepo.phoneticsTypes as ILookup[];

  const [currentRootId, setCurrentRootId] = useState<number | undefined>(
    undefined
  );
  const [autoPhonetics, setAutoPhonetics] = useState<boolean>(false);

  const [curRanges, setCurRanges] = useState<MorphemeRange[]>(
    [] as MorphemeRange[]
  );
  const [curMorphemes, setCurMorphemes] = useState<number[]>([] as number[]);

  const { derivationBranchForEdit } = useAppSelector(
    (state) => state.derivationCrudState
  );
  const [deleteDerivation, workingOnDeleteDerivationBranch, DeleteFailure] =
    useDeleteDerivationBranch();
  const [createOrUpdateDerivationBranch, creatingOrupdatingDerivationBranch] =
    useCreateOrUpdateDerivationBranch();
  const [
    confirmRejectDerivation,
    workingOnConfirmRejectDerivationBranch,
    confirmRejectFailure,
    clearConfirmRejectFailure,
  ] = useConfirmRejectDerivationBranch();

  //3. ეს არის ის ცხრილები, რომელზეც მოქმედებს ეს კონკრეტული რედაქტორი
  //   const tableNamesForClear = useMemo(() => [], []);

  //4. ეს არის ის ცხრილები, რომლებიდანაც ინფორმაცია სჭირდება ამ რედაქტრს
  const tableNamesForLoadLookup = useMemo(
    () => ["derivationFormulasQuery", "classifiers", "phoneticsTypes"],
    []
  );

  //4. ეს არის ის ცხრილები, რომლებიდანაც ინფორმაცია სჭირდება ამ რედაქტრს
  const tableNamesForLoad = useMemo(
    () => [
      "derivationTypes",
      "morphemeGroups",
      "morphemeRanges",
      "morphemeRangesByDerivationTypes",
      "morphemesQuery",
      "phoneticsChangesQuery",
    ],
    []
  );

  const [checkLoadLookupTables, loadingLookupTables] =
    useCheckLoadLookupTables();
  const [checkLoadMdTables] = useCheckLoadMdTables();
  const [checkLoadDerivationFormulas, derivFormulasLoading] =
    useCheckLoadDerivationFormulas();
  const [clearTablesFromRepo] = useClearTablesFromRepo();
  const [clearRootsByDerivation] = useClearRootsByDerivation();

  const { user } = useAppSelector((state) => state.userState);

  useEffect(() => {
    checkLoadLookupTables(tableNamesForLoadLookup);
    checkLoadMdTables(tableNamesForLoad);
    // console.log("DerivationEdit useEffect checkLoadDerivationFormulas started");
    checkLoadDerivationFormulas();
    // console.log(
    //   "DerivationEdit useEffect checkLoadDerivationFormulas finished"
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableNamesForLoad, tableNamesForLoadLookup]);

  //6. ფორმის მენეჯერი
  const [
    frm,
    changeField,
    getError,
    getAllErrors,
    clearToDefaults,
    setFormData,
  ] = useForman<typeof derivationBranchDataSchema, DerivationBranchData>(
    derivationBranchDataSchema
  );

  function clearUsedTables() {
    dispatch(clearMemo());
    clearTablesFromRepo(null, tableNamesForLoad);
    if (curDbrIdVal) clearRootsByDerivation(curDbrIdVal);
    dispatch(clearForConfirmRootsPagesMemo());
  }

  const copyMorphemsToMainData = useCallback(
    (
      forForm: DerivationBranchData,
      morphemes: number[],
      ranges: MorphemeRange[]
    ) => {
      const newForm = JSON.parse(
        JSON.stringify(forForm)
      ) as DerivationBranchData;
      newForm.freeMorphemeIds = morphemes
        .map((mrpId) => {
          return mrpId ? morphemesQuery.find((f) => f.mrpId === mrpId) : null;
        })
        .filter(
          (f, index): f is Morpheme =>
            !!f && ranges[index].mrBaseNom === null && !!f.mrpNom
        )
        .map((m) => m.mrpId);
      return newForm;
    },
    [morphemesQuery]
  );

  const setderivationFormula = useCallback(
    (
      curForm: DerivationBranchData,
      newderivationFormulaId: number
    ): DerivationBranchData | undefined => {
      // console.log(
      //   "DerivationEdit setderivationFormula derivationTypes=",
      //   derivationTypes
      // );

      //თუ საჭირო ინფორმაცია ჯერ ჩატვირთული არ არის, მაშინ გაგრეძელებას აზრი არ აქვს
      if (
        !derivationTypes ||
        !morphemeRanges ||
        !morphemesQuery ||
        !morphemeRangesByDerivationTypes ||
        !derivationFormulas ||
        !morphemeGroups
      )
        return curForm;

      //დავამზადოთ ფორმის ახალი ობიექტი
      const newForm = JSON.parse(
        JSON.stringify(curForm)
      ) as DerivationBranchData; // { ...curForm } as InflectionData;

      // console.log("DerivationEdit setderivationFormula newForm=", newForm);

      //დერივაციის ფორმულის იდენტიფიკატორის მიხედვით მოხდეს დერივაციის ფორმულის პოვნა
      const derivationFormula = derivationFormulas.find(
        (f) => f.dfId === newderivationFormulaId
      );
      if (!derivationFormula) {
        dispatch(
          setAlertClientRunTimeError({
            errorCode: "FormulaNotFound",
            errorMessage: "ფორმულა ვერ მოიძებნა",
          } as Err)
        );
        return newForm;
      }

      // console.log(
      //   "DerivationEdit setderivationFormula derivationFormula=",
      //   derivationFormula
      // );

      //დერივაციის ტიპის პოვნას აზრი აქვს მხოლოდ იმ შემთხვევაში, თუ დერივაციიც ტიპების ცხრილი ჩატვირთულია
      //მოვძებნოთ დერივაციის ტიპის შესაბამისი ობიექტი
      const derivType = derivationTypes.find(
        (f) => f.drtId === derivationFormula.derivationTypeId
      );
      if (!derivType) {
        dispatch(
          setAlertClientRunTimeError({
            errorCode: "DerivationTypeNotFound",
            errorMessage: "დერივაციის ტიპი ვერ მოიძებნა",
          } as Err)
        );
        return newForm;
      }

      // console.log("DerivationEdit setderivationFormula derivType=", derivType);

      //დერივაციის ტიპის მიხედვით დადგინდეს მორფემების ჯგუფი
      const morphemeGroup = morphemeGroups.find(
        (mog) => mog.mogId === derivType.morphemeGroupId
      );
      if (!morphemeGroup) {
        dispatch(
          setAlertClientRunTimeError({
            errorCode: "MorphemeGroupNotFound",
            errorMessage: "მორფემების ჯგუფი ვერ მოიძებნა",
          } as Err)
        );
        return newForm;
      }

      interface MorfemeAndRange {
        morpheme: Morpheme;
        range: MorphemeRange;
      }
      // console.log(
      //   "DerivationEdit setderivationFormula morphemeGroup=",
      //   morphemeGroup
      // );

      //დავადგინოთ ფორმულაში არსებული მორფემების რანგები და ამოვარჩიოთ მათგან მხოლოდ ისინი,
      //რომლებიც არჩევითია და მითითებულია (-1) , ან ფუძეა და მითითებულია (1)
      const selectableRangeIds = derivationFormula.derivationFormulaDetails
        .map((m) => {
          const morpheme = morphemesQuery.find((f) => f.mrpId === m); //აქ იყო m.morphemeId თუ მარტო ეს ერთი რიცხვია დეტალებში, ასე უნდა დარჩერს
          const range = morphemeRanges.find(
            (f) => f.mrId === morpheme?.morphemeRangeId
          );
          return { morpheme, range } as MorfemeAndRange;
        })
        .filter(
          (f) =>
            f.range.morphemeGroupId === morphemeGroup.mogId &&
            ((f.range.mrSelectable && f.morpheme.mrpNom === -1) ||
              (f.range.mrBaseNom !== null && f.morpheme.mrpNom === 1))
        )
        .map((m) => m.range.mrId);

      // console.log(
      //   "DerivationEdit setderivationFormula selectableRangeIds=",
      //   selectableRangeIds
      // );

      setAutoPhonetics(morphemeGroup.mogAutoPhonetics);

      //ამოვკრიბოთ იმ რანგების შესახებ ინფორმაცია, რომლებიც მონაწილეობენ ამ ტიპის დერივაციის ფორმირებაში
      const morphemeRangeIdsByDT = morphemeRangesByDerivationTypes
        .filter(
          (f) => f.derivationTypeId === derivationFormula.derivationTypeId
        )
        .map((m) => m.morphemeRangeId);

      // console.log(
      //   "DerivationEdit setderivationFormula morphemeRangeIdsByDT=",
      //   morphemeRangeIdsByDT
      // );

      //დერივაციის ტიპში მითითებული ჯგუფის მიხედვით ამოვკრიბოთ რანგების შესაბამისი ობიექტები
      //თან გავითვალისწინოთ რომ ამ დერივაციის ტიპში ეს რანგი უნდა მონაწილეობდეს თუ არა
      const rangesInGroup = morphemeRanges
        .filter(
          (f) =>
            f.morphemeGroupId === derivType.morphemeGroupId &&
            (f.mrBaseNom !== null || f.mrSelectable) &&
            morphemeRangeIdsByDT.includes(f.mrId) &&
            selectableRangeIds.includes(f.mrId)
        )
        .sort((a, b) => a.mrPosition - b.mrPosition);

      // console.log(
      //   "DerivationEdit setderivationFormula rangesInGroup=",
      //   rangesInGroup
      // );

      //დავაფიქსიროთ დერივაციის ტიპი
      newForm.derivationBranch.derivationFormulaId = newderivationFormulaId;
      const formulaFormDataType = createFormulaFormData(
        curRanges,
        curMorphemes,
        rangesInGroup,
        newForm.freeMorphemeIds,
        morphemesQuery,
        true
      );

      setCurMorphemes(formulaFormDataType.morphemes);
      setCurRanges(formulaFormDataType.ranges);
      if (formulaFormDataType.error)
        dispatch(setAlertClientRunTimeError(formulaFormDataType.error));

      // console.log(
      //   "DerivationEdit setderivationFormula formulaFormDataType=",
      //   formulaFormDataType
      // );

      // console.log("DerivationFormulaEdit setDerivationType newForm=", newForm);

      const newFormWithMorphemes = copyMorphemsToMainData(
        newForm,
        formulaFormDataType.morphemes,
        formulaFormDataType.ranges
      );

      return newFormWithMorphemes;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      derivationTypes,
      morphemeGroups,
      morphemeRanges,
      morphemesQuery,
      morphemeRangesByDerivationTypes,
      curMorphemes,
      curRanges,
    ]
  );

  const { rootId: fromParamsRootId } = useParams<string>();
  const { dbrId: fromParamsDbrId } = useParams<string>();

  const [getOneDerivationBranchById, { isLoading: loadingDerivationBranch }] =
    useLazyGetOneDerivationBranchByIdQuery();
  const [checkLoadRootsByBranchId] = useCheckLoadRootsByBranchId();

  //7. იდენტიფიკატორის ეფექტი
  useEffect(() => {
    //დავადგინოთ ძირის იდენტიფიკატორი
    const rootIdVal = fromParamsRootId ? parseInt(fromParamsRootId) : 0;
    if (currentRootId !== rootIdVal) setCurrentRootId(rootIdVal);

    //დავადგინოთ დერივაციის იდენტიფიკატორი
    const dbrIdVal = fromParamsDbrId ? parseInt(fromParamsDbrId) : 0;

    //ვამოწმებთ მისამართში შეიცვალა თუ არა იდენტიფიკატორი
    if (curDbrIdVal !== dbrIdVal) {
      //შეცვლილა

      //გავასუფთავოთ შეცდომები, სანამ ახლების დაგროვებას დავიწყებთ
      dispatch(clearAllAlerts());

      //დავიმახსოვროთ შეცვლილი იდენტიფიკატორი
      setCurDbrIdVal(dbrIdVal);
      if (dbrIdVal) {
        //თუ იდენტიფიკატორი კარგია, ჩავტვირთოთ ბაზიდან ინფორმაცია
        //console.log("DerivationEdit getOneDerivationBranchById dbrIdVal=", dbrIdVal);
        getOneDerivationBranchById(dbrIdVal);
        checkLoadRootsByBranchId(dbrIdVal);
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
    if (
      loadingDerivationBranch ||
      !fromParamsDbrId ||
      !derivationBranchForEdit ||
      mdWorkingOnLoad ||
      Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
      !derivationTypes ||
      !morphemeGroups ||
      !morphemeRanges ||
      !classifiers ||
      !morphemesQuery ||
      !morphemeRangesByDerivationTypes ||
      derivFormulasLoading ||
      !derivationFormulas ||
      rootLoading
    )
      return;

    const newForm = setderivationFormula(
      derivationBranchForEdit,
      derivationBranchForEdit.derivationBranch.derivationFormulaId
    );
    if (newForm) setFormData(newForm);
  }, [
    currentRootId,
    curDbrIdVal,
    fromParamsRootId,
    fromParamsDbrId,
    loadingDerivationBranch,
    derivationBranchForEdit,
    derivationTypes,
    morphemeGroups,
    morphemeRanges,
    classifiers,
    morphemeRangesByDerivationTypes,
    morphemesQuery,
    derivFormulasLoading,
    derivationFormulas,
    mdWorkingOnLoad,
    mdWorkingOnLoadingTables,
    rootLoading,
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
    loadingDerivationBranch ||
    mdWorkingOnLoad ||
    Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
    derivFormulasLoading ||
    rootLoading
  )
    //თუ ინფორმაციის ჩატვირთვა ჯერ კიდევ მიმდინარეობა
    return <WaitPage />;
  // console.log("DerivationEdit Check mdRepo=", mdRepo);

  // console.log("DerivationEdit Check Load", {
  //   curDbrIdVal,
  //   derivationBranchForEdit,
  //   derivationFormulasQuery,
  //   morphemeRanges,
  //   classifiers,
  //   morphemeGroups,
  //   derivationTypes,
  //   morphemesQuery,
  //   morphemeRangesByDerivationTypes,
  //   phoneticsChangesQuery,
  //   phoneticsTypes,
  //   derivationFormulas,
  //   frm,
  // });

  //8. ჩატვირთვის შემოწმება
  //თუ იდენტიფიკატორი წესიერია და ჩატვირთული ობიექტი ჯერ არ არის, ან საჭირო ცხრილები ჩატვირთული არ არის

  if (
    (curDbrIdVal && !derivationBranchForEdit) ||
    !derivationFormulasQuery ||
    !morphemeRanges ||
    !classifiers ||
    !morphemeGroups ||
    !derivationTypes ||
    !morphemesQuery ||
    !morphemeRangesByDerivationTypes ||
    !phoneticsChangesQuery ||
    !phoneticsTypes ||
    !derivationFormulas ||
    !frm ||
    !frm.derivationBranch
  ) {
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
    const currentForm = JSON.parse(JSON.stringify(frm)) as DerivationBranchData;

    currentForm.derivationPredecessors.forEach((pred, index, arr) => {
      if (pred.phoneticsChangeId === 0) arr[index].phoneticsChangeId = null;
    });

    createOrUpdateDerivationBranch(curDbrIdVal, currentRootId, currentForm);

    clearUsedTables();
  }

  const derivationBranchResultName =
    frm && frm.derivationBranch && frm.derivationBranch.dbrBaseName
      ? frm.derivationBranch.dbrBaseName
      : "";
  const userHasConfirmRight =
    user?.appClaims.some((s) => s === "Confirm") ?? false;

  const allowEditAndDelete = isAllowEditAndDelete(
    curDbrIdVal,
    user?.userName,
    frm.derivationBranch.creator,
    frm.derivationBranch.recordStatusId,
    userHasConfirmRight
  );

  // const allowEditAndDelete =
  //   (userHasConfirmRight &&
  //     frm.derivationBranch &&
  //     frm.derivationBranch.recordStatusId !== 1 &&
  //     frm.derivationBranch.recordStatusId !== 0) ||
  //   (!userHasConfirmRight && frm.derivationBranch.recordStatusId !== 1);

  return (
    <Row>
      <Col md="6">
        <AlertMessages alertKind={EAlertKind.ClientRunTime} />
        <Form onSubmit={handleSubmit}>
          <EditorHeader
            curIdVal={curDbrIdVal}
            EditorName="დერივაცია"
            EditorNameGenitive="დერივაციის"
            EditedObjectName={derivationBranchResultName}
            workingOnDelete={workingOnDeleteDerivationBranch}
            DeleteFailure={DeleteFailure}
            onDelete={() => {
              deleteDerivation(curDbrIdVal, currentRootId);
              clearUsedTables();
            }}
            onClearDeletingFailure={() => {
              dispatch(setDeleteFailureDerivation(false));
            }}
            allowDelete={allowEditAndDelete}
          />

          {userHasConfirmRight &&
            frm.derivationBranch.recordStatusId !== undefined &&
            frm.derivationBranch.recordStatusId !== 2 && (
              <StatusConfirmRejectPart
                recordStatusId={frm.derivationBranch.recordStatusId}
                creator={frm.derivationBranch.creator}
                applier={frm.derivationBranch.applier}
                workingOnConfirmReject={workingOnConfirmRejectDerivationBranch}
                confirmRejectFailure={confirmRejectFailure}
                onConfirmRejectClick={(confirm, withAllDescendants) => {
                  confirmRejectDerivation(
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
            text={derivationBranchResultName}
          />
          <OneStrongLabel
            controlId="mainParametersLabel"
            label="მთავარი პარამეტრები"
          />

          <OneComboBoxControl
            controlId="derivationBranch.classifierId"
            label="კლასიფიკატორი"
            value={frm.derivationBranch.classifierId}
            dataMember={classifiers}
            firstItem={{ id: 0, name: "არცერთი" }}
            valueMember="clfId"
            displayMember="clfName"
            sortByDisplayMember={true}
            getError={getError}
            firstItemIsSelectable
            onChangeValue={changeField}
          />

          <OneComboBoxControl
            controlId="derivationBranch.derivationFormulaId"
            label="დერივაციის მოდელი"
            value={frm.derivationBranch.derivationFormulaId}
            dataMember={derivationFormulasQuery}
            firstItem={{ id: 0, name: "აირჩიე დერივაციის მოდელი" }}
            valueMember="dfId"
            displayMember="dfName"
            sortByDisplayMember={true}
            getError={getError}
            onChangeValue={(fieldPath, value) => {
              const newForm = setderivationFormula(frm, value);
              if (newForm) setFormData(newForm);
            }}
          />

          {!!frm.derivationBranch.derivationFormulaId && (
            <div>
              <BasesAndFreeMorphemes
                ranges={curRanges}
                morphemes={curMorphemes}
                morphemesQuery={morphemesQuery}
                phoneticsTypes={phoneticsTypes}
                phoneticsChangesQuery={phoneticsChangesQuery}
                morphemesdPath="morphemes"
                getError={getError}
                selectPhoneticsType={false}
                autoPhonetics={autoPhonetics}
                predecessors={frm.derivationPredecessors}
                onMorphemeChange={(index, value) => {
                  let newForm = JSON.parse(
                    JSON.stringify(frm)
                  ) as DerivationBranchData;
                  //let newForm = { ...frm };
                  curMorphemes[index] = value;
                  newForm = copyMorphemsToMainData(
                    newForm,
                    curMorphemes,
                    curRanges
                  );
                  // //გავუგზავნოთ ახალი ფორმა ფორმის მენეჯერს.
                  setFormData(newForm);
                }}
                onPredecessorChange={(baseNom, item) => {
                  //console.log("DerivationEdit.js BasesAndFreeMorphemes onPredecessorChange {baseNom, item}=", {baseNom, item})
                  const newForm = JSON.parse(
                    JSON.stringify(frm)
                  ) as DerivationBranchData;

                  let predByBase = newForm.derivationPredecessors.find(
                    (pred) => pred.baseNom === baseNom
                  );
                  if (item) {
                    if (!predByBase) {
                      predByBase = {} as DerivationPredecessorModel;
                      predByBase.baseNom = baseNom;
                      predByBase.parentBranchId = item.itemId;
                      predByBase.phoneticsChangeId = null;
                      newForm.derivationPredecessors.push(predByBase);
                    } else {
                      predByBase.parentBranchId = item.itemId;
                    }
                  } else {
                    if (predByBase) {
                      newForm.derivationPredecessors =
                        newForm.derivationPredecessors.filter(
                          (pred) => pred.baseNom !== baseNom
                        );
                    }
                  }
                  setFormData(newForm);
                }}
                onPredecessorPhoneticsTypeChange={(baseNom, value) => {
                  const newForm = JSON.parse(
                    JSON.stringify(frm)
                  ) as DerivationBranchData;

                  const predByBase = newForm.derivationPredecessors.find(
                    (pred) => pred.baseNom === baseNom
                  );
                  if (!predByBase) return;
                  predByBase.phoneticsChangeId = value;
                  setFormData(newForm);
                }}
              />

              <PhoneticsCombEditor
                controlGroupId="basePhoneticsCombDetails"
                label="შედეგის ფონეტიკური შესაძლებლობები"
                basePhoneticsChanges={frm.basePhoneticsCombDetails}
                phoneticsChangesQuery={phoneticsChangesQuery}
                getError={getError}
                onChangeValue={changeField}
                onTrashButtonClick={(index) => {
                  const newFrm = JSON.parse(
                    JSON.stringify(frm)
                  ) as DerivationBranchData;

                  newFrm.basePhoneticsCombDetails.splice(index, 1);
                  setFormData(newFrm);
                }}
                onPlusButtonClick={() => {
                  const newFrm = JSON.parse(
                    JSON.stringify(frm)
                  ) as DerivationBranchData;

                  newFrm.basePhoneticsCombDetails.push(0);
                  setFormData(newFrm);
                }}
              />
            </div>
          )}
          <OneSaveCancelButtons
            curIdVal={curDbrIdVal}
            haveErrors={haveErrors}
            savingNow={creatingOrupdatingDerivationBranch}
            onCloseClick={() => {
              dispatch(clearAllAlerts());
              navigate(-1); //goBack
            }}
            allowEdit={allowEditAndDelete}
          />
          <OneErrorRow allErrors={allErrors} />
        </Form>
      </Col>
    </Row>
  );
};

export default DerivationEdit;
