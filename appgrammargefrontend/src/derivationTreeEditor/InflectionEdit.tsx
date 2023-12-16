//InflectionEdit.tsx

import { useEffect, useState, useCallback, useMemo, FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";

import Paradigm from "./Paradigm";
import BasesAndFreeMorphemes from "./BasesAndFreeMorphemes";
import StatusConfirmRejectPart from "./StatusConfirmRejectPart";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { useForman } from "../appcarcass/hooks/useForman";
import {
  InflectionBlock,
  InflectionType,
  Morpheme,
  MorphemeGroup,
  MorphemeRange,
  MorphemeRangeByInflectionBlock,
  NounParadigm,
  PersonVariabilityType,
  PhoneticsType,
  Pronoun,
  VerbParadigm,
  VerbPluralityType,
  VerbRowFilter,
  VerbType,
  classifierModel,
} from "../masterData/mdTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useGetVerbRowParadigmsByVerbTypesQuery } from "../redux/api/modelDataApi";
import {
  InflectionData,
  InflectionPredecessorRedModel,
  inflectionDataSchema,
} from "./TypesAndSchemas/InflectionDataTypeAndSchema";
import {
  clearForConfirmRootsPagesMemo,
  clearMemo,
  clearRoot,
} from "../redux/slices/rootsSlice";
import { useClearTablesFromRepo } from "../appcarcass/masterdata/masterDataHooks/useClearTablesFromRepo";
import { createFormulaFormData } from "./FormulasModule";
import { useLazyGetOneInflectionByIdQuery } from "../redux/api/inflectionCrudApi";
import { useCheckLoadRootsByInflectionId } from "./derivationCrudHooks/useCheckLoadRootsByInflectionId";
import WaitPage from "../appcarcass/common/WaitPage";
import { useCreateOrUpdateInflection } from "./derivationCrudHooks/useCreateOrUpdateInflection";
import EditorHeader from "../appcarcass/editorParts/EditorHeader";
import { useDeleteInflection } from "./derivationCrudHooks/useDeleteInflection";
import { setDeleteFailureInflection } from "../redux/slices/inflectionCrudSlice";
import { useConfirmRejectInflection } from "./derivationCrudHooks/useConfirmRejectInflection";
import OnePlaintextRow from "../appcarcass/editorParts/OnePlaintextRow";
import OneNumberControl from "../appcarcass/editorParts/OneNumberControl";
import OneTextControl from "../appcarcass/editorParts/OneTextControl";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import OneSaveCancelButtons from "../appcarcass/editorParts/OneSaveCancelButtons";
import OneErrorRow from "../appcarcass/editorParts/OneErrorRow";
import {
  clearAllAlerts,
  EAlertKind,
  setAlertClientRunTimeError,
} from "../appcarcass/redux/slices/alertSlice";
import { useAlert } from "../appcarcass/hooks/useAlert";
import { Err } from "../appcarcass/redux/types/errorTypes";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { isAllowEditAndDelete } from "./dteFunctions";
import { ILookup } from "../appcarcass/redux/types/masterdataTypes";
import { useCheckLoadLookupTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadLookupTables";

const InflectionEdit: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  //1. იდენტიფიკატორი
  const [curInfIdVal, setCurInfIdVal] = useState<number | undefined>(undefined);
  const [curDbrIdVal, setCurDbrIdVal] = useState<number | undefined>(undefined);
  const [currentRootId, setCurrentRootId] = useState<number | undefined>(
    undefined
  );

  const { mdataRepo, mdLookupRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
    useAppSelector((state) => state.masterDataState);

  const { rootLoading } = useAppSelector((state) => state.rootsState);

  const morphemeRanges = mdataRepo.morphemeRanges as MorphemeRange[];
  const pronouns = mdataRepo.pronouns as Pronoun[];
  const classifiers = mdataRepo.classifiers as classifierModel[];
  const morphemeGroups = mdataRepo.morphemeGroups as MorphemeGroup[];
  const morphemesQuery = mdataRepo.morphemesQuery as Morpheme[];
  const inflectionTypes = mdataRepo.inflectionTypes as InflectionType[];
  const inflectionBlocks = mdataRepo.inflectionBlocks as InflectionBlock[];

  const morphemeRangesByInflectionBlocks =
    mdataRepo.morphemeRangesByInflectionBlocks as MorphemeRangeByInflectionBlock[];
  const phoneticsTypes = mdLookupRepo.phoneticsTypes as ILookup[];
  const nounParadigms = mdataRepo.nounParadigms as NounParadigm[];
  const verbParadigms = mdataRepo.verbParadigms as VerbParadigm[];

  const verbTypes = mdataRepo.verbTypes as VerbType[];
  const verbPluralityTypes =
    mdataRepo.verbPluralityTypes as VerbPluralityType[];
  const verbRowFilters = mdataRepo.verbRowFilters as VerbRowFilter[];
  const personVariabilityTypes =
    mdataRepo.personVariabilityTypes as PersonVariabilityType[];

  const [curMorphemes, setCurMorphemes] = useState<number[]>([] as number[]);
  const [curRanges, setCurRanges] = useState<MorphemeRange[]>(
    [] as MorphemeRange[]
  );

  const { inflectionForEdit } = useAppSelector(
    (state) => state.inflectionCrudState
  );

  const [createOrUpdateInflection, creatingOrupdatingInflection] =
    useCreateOrUpdateInflection();

  const [deleteInflection, workingOnDeleteInflection, DeleteFailure] =
    useDeleteInflection();

  const [
    confirmRejectInflection,
    workingOnConfirmRejectInflection,
    confirmRejectFailure,
    clearConfirmRejectFailure,
  ] = useConfirmRejectInflection();

  //console.log("InflectionEdit props=", props);

  //3. ეს არის ის ცხრილები, რომელზეც მოქმედებს ეს კონკრეტული რედაქტორი
  // const tableNamesForClear = [];

  //4. ეს არის ის ცხრილები, რომლებიდანაც ინფორმაცია სჭირდება ამ რედაქტრს
  const tableNamesForLoadLookup = useMemo(() => ["phoneticsTypes"], []);

  const tableNamesForLoad = useMemo(
    () => [
      "pronouns",
      "classifiers",
      "morphemeGroups",
      "morphemeRanges",
      "morphemesQuery",
      "inflectionTypes",
      "inflectionBlocks",
      "morphemeRangesByInflectionBlocks",
      "nounParadigms",
      "verbParadigms",
      "verbTypes",
      "verbPluralityTypes",
      "verbRowFilters",
      "personVariabilityTypes",
    ],
    []
  );

  const [checkLoadLookupTables, loadingLookupTables] =
    useCheckLoadLookupTables();
  const [clearTablesFromRepo] = useClearTablesFromRepo();

  const [checkLoadMdTables] = useCheckLoadMdTables();

  const { user } = useAppSelector((state) => state.userState);

  useEffect(() => {
    checkLoadLookupTables(tableNamesForLoadLookup);
    checkLoadMdTables(tableNamesForLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableNamesForLoad, tableNamesForLoadLookup]); //checkLoadMdTables - ჩამტვირთავი მეთოდების ჩანატება useEffect-ის დამოკიდებულებებში იწვევს ჩაციკვლას

  const {
    data: verbRowParadigmsByVerbTypes,
    isLoading: verbRowParadigmsByVerbTypesLoading,
  } = useGetVerbRowParadigmsByVerbTypesQuery();

  // useEffect(() => {
  //   if (
  //     !verbRowParadigmsByVerbTypesLoading &&
  //     !verbRowParadigmsByVerbTypesLoadingFailure &&
  //     !verbRowParadigmsByVerbTypes
  //   )
  //     GetVerbRowParadigmsByVerbTypes();
  // }, [
  //   verbRowParadigmsByVerbTypesLoading,
  //   verbRowParadigmsByVerbTypesLoadingFailure,
  //   verbRowParadigmsByVerbTypes,
  //   GetVerbRowParadigmsByVerbTypes,
  // ]);

  // pronouns, morphemeGroups, morphemeRanges, morphemesQuery, phoneticsTypes,
  // inflectionTypes, inflectionBlocks, morphemeRangesByInflectionBlocks, nounParadigms, verbParadigms,
  // verbTypes, verbPluralityTypes, verbRowFilters, personVariabilityTypes]);

  //console.log("InflectionEdit yupSchema=", yupSchema);
  //console.log("InflectionEdit yupSchema.fields=", yupSchema.fields);
  //console.log("InflectionEdit yupSchema.fields.verb=", yupSchema.fields.verb);
  //console.log("InflectionEdit yupSchema.fields.verb.fields=", yupSchema.fields.verb.fields);
  //console.log("InflectionEdit yupSchema.fields.verb.fields.keys()=", Object.keys(yupSchema.fields.verb.fields));

  //6. ფორმის მენეჯერი
  const [
    frm,
    changeField,
    getError,
    getAllErrors,
    clearToDefaults,
    setFormData,
  ] = useForman<typeof inflectionDataSchema, InflectionData>(
    inflectionDataSchema
  );

  function clearUsedTables() {
    dispatch(clearMemo());
    clearTablesFromRepo(null, tableNamesForLoad);
    if (currentRootId) dispatch(clearRoot(currentRootId));
    dispatch(clearForConfirmRootsPagesMemo());
  }

  const copyMorphemsToMainData = useCallback(
    (forForm: InflectionData, morphemes: number[], ranges: MorphemeRange[]) => {
      // console.log(
      //   "InflectionEdit copyMorphemsToMainData morphemes=",
      //   morphemes
      // );

      const newForm = { ...forForm } as InflectionData;
      newForm.freeMorphemeIds = morphemes
        .map((mrpId) => {
          return mrpId ? morphemesQuery.find((f) => f.mrpId === mrpId) : null;
        })
        .filter(
          (f, index): f is Morpheme =>
            !!f && ranges[index].mrBaseNom === null && !!f.mrpNom
        )
        .map((m) => m.mrpId);

      // console.log("InflectionEdit copyMorphemsToMainData newForm=", newForm);

      return newForm;
    },
    [morphemesQuery]
  );

  const setVerbType = useCallback(
    (curForm: InflectionData, newVerbTypeId: number) => {
      // //თუ საჭირო ინფორმაცია ჯერ ჩატვირთული არ არის, მაშინ გაგრეძელებას აზრი არ აქვს
      if (
        !verbTypes ||
        !personVariabilityTypes ||
        !verbParadigms ||
        !verbRowParadigmsByVerbTypes
      )
        return curForm;

      //დავამზადოთ ფორმის ახალი ობიექტი
      const newForm = { ...curForm } as InflectionData;

      //დავაფიქსიროთ ზმნის ტიპი
      if (newForm.verb) newForm.verb.verbTypeId = newVerbTypeId;

      //ზმინს ტიპის იდენტიფიკატორის მიხედვით მოხდეს ზმინს ტიპის პოვნა
      const verbType = verbTypes.find((f) => f.vtpId === newVerbTypeId);
      if (!verbType) {
        //console.log("InflectionEdit alertError ზმნის ტიპი ვერ მოიძებნა");
        dispatch(
          setAlertClientRunTimeError({
            errorCode: "VerbTypeNotFound",
            errorMessage: "ზმნის ტიპი ვერ მოიძებნა",
          } as Err)
        );
        return newForm;
      }

      //დავიმახსოვროთ პირების რაოდეონობა
      const verbPersonsCount = verbType ? verbType.vtpVerbPersonsCount : 0;

      //დავაფიქსიროთ პირების რაოდენობის მიხედვით პირცვალებადობების მასივის სიგრძე
      newForm.personVariabilityTypeIds.length = verbPersonsCount;

      //თუ რომელიმე განუსაზღვრელია, ან არ მოიძებნება იდენტიფიკატორი პირცვალებადობების ტიპების სიაში, მაშინ მივანიჭოთ 0
      for (let i = 0; i < verbPersonsCount; i++) {
        if (
          newForm.personVariabilityTypeIds[i] === undefined ||
          personVariabilityTypes.find(
            (f) => f.pvtId === newForm.personVariabilityTypeIds[i]
          ) === undefined
        )
          newForm.personVariabilityTypeIds[i] = 0;
      }

      // const formData = newForm.formData ? {...newForm.formData} : {};
      // formData.verbRowParadigmsdataMember = verbParadigms
      // .filter(x => {
      //   if ( newVerbTypeId )
      //     return verbRowParadigmsByVerbTypes[newVerbTypeId.toString()].includes(x.vpnId);
      //   return false;
      // })
      //   .map(m => { return {vpnId: m.vpnId, vpnFullName: `${m.vpnKey} ${m.vpnName}` };});
      // newForm.formData = formData;

      //console.log("InflectionEdit setVerbType newForm=", newForm);

      return newForm;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      personVariabilityTypes,
      verbTypes,
      verbParadigms,
      verbRowParadigmsByVerbTypes,
      // dispatch,
    ]
  );

  const setInflectionType = useCallback(
    (curForm: InflectionData, newInflectionTypeId: number) => {
      // Object.freeze(curForm);
      // console.log(
      //   "InflectionEdit setInflectionType parameters {curForm, newInflectionTypeId}",
      //   { curForm, newInflectionTypeId }
      // );

      // console.log("InflectionEdit setInflectionType Start", {
      //   inflectionBlocks,
      //   inflectionTypes,
      //   morphemeGroups,
      //   morphemeRanges,
      //   morphemesQuery,
      //   morphemeRangesByInflectionBlocks,
      // });

      //თუ საჭირო ინფორმაცია ჯერ ჩატვირთული არ არის, მაშiინ გაგრეძელებას აზრი არ აქვს
      if (
        !inflectionBlocks ||
        !inflectionTypes ||
        !morphemeGroups ||
        !morphemeRanges ||
        !morphemesQuery ||
        !morphemeRangesByInflectionBlocks
      )
        return curForm;

      //დავამზადოთ ფორმის ახალი ობიექტი
      const newForm = JSON.parse(JSON.stringify(curForm)) as InflectionData; // { ...curForm } as InflectionData;
      // console.log("InflectionEdit setInflectionType newForm=", newForm);

      //ფლექსიის ტიპის იდენტიფიკატორის მიხედვით მოხდეს ფლექსიის ტიპის პოვნა
      const inflectionType = inflectionTypes.find(
        (f) => f.iftId === newInflectionTypeId
      );
      if (!inflectionType) {
        //console.log("InflectionEdit alertError ფლექსიის ტიპი ვერ მოიძებნა");
        //alertError("ფლექსიის ტიპი ვერ მოიძებნა");
        dispatch(
          setAlertClientRunTimeError({
            errorCode: "InflectionTypeNotFound",
            errorMessage: "ფლექსიის ტიპი ვერ მოიძებნა",
          } as Err)
        );
        return newForm;
      }
      //console.log("InflectionEdit setInflectionType inflectionType=", inflectionType);

      //ფლექსიის ტიპის მიხედვით დადგინდეს მორფემების ჯგუფი
      const morphemeGroup = morphemeGroups.find(
        (mog) => mog.mogId === inflectionType.morphemeGroupId
      );
      if (!morphemeGroup) {
        //console.log("InflectionEdit alertError მორფემების ჯგუფი ვერ მოიძებნა");
        //alertError("მორფემების ჯგუფი ვერ მოიძებნა");
        dispatch(
          setAlertClientRunTimeError({
            errorCode: "MorphemeGroupNotFound",
            errorMessage: "მორფემების ჯგუფი ვერ მოიძებნა",
          } as Err)
        );
        return newForm;
      }
      //console.log("InflectionEdit setInflectionType morphemeGroup=", morphemeGroup);

      //ფლექსიის ტიპის იდენტიფიკატორის მიხედვით მოხდეს ფლექსიის ბლოკის პოვნა
      const inflectionBlock = inflectionBlocks.find(
        (f) =>
          f.inflectionTypeId === newInflectionTypeId &&
          f.inbContainsNecessaryBase
      );
      if (!inflectionBlock) {
        //console.log("InflectionEdit alertError ფლექსიის ბლოკი ვერ მოიძებნა");
        dispatch(
          setAlertClientRunTimeError({
            errorCode: "TheFlexBlockCouldNotBeFound",
            errorMessage: "ფლექსიის ბლოკი ვერ მოიძებნა",
          } as Err)
        );
        return newForm;
      }
      //console.log("InflectionEdit setInflectionType inflectionBlock=", inflectionBlock);

      //ამოვკრიბოთ იმ რანგების შესახებ ინფორმაცია, რომლებიც მონაწილეობენ ამ ტიპის ფლექსიის ფორმირებაში
      const morphemeRangeIdsByDT = morphemeRangesByInflectionBlocks
        .filter((f) => f.inflectionBlockId === inflectionBlock.inbId)
        .map((m) => m.morphemeRangeId);
      //console.log("InflectionEdit setInflectionType morphemeRangeIdsByDT=", morphemeRangeIdsByDT);

      //ფლექსიის ტიპში მითითებული ჯგუფის მიხედვით ამოვკრიბოთ რანგების შესაბამისი ობიექტები
      //თან გავითვალისწინოთ რომ ამ ფლექსიის ტიპში ეს რანგი უნდა მონაწილეობდეს თუ არა
      const rangesInGroup = morphemeRanges
        .filter(
          (f) =>
            f.morphemeGroupId === inflectionType.morphemeGroupId &&
            morphemeRangeIdsByDT.includes(f.mrId) &&
            (f.mrInflectionSelectable || f.mrBaseNom !== null)
        )
        .sort((a, b) => a.mrPosition - b.mrPosition);
      //console.log("InflectionEdit setInflectionType rangesInGroup=", rangesInGroup);

      //დავაფიქსიროთ ფლექსიის ტიპი
      newForm.inflection.inflectionTypeId = newInflectionTypeId;

      if (inflectionType.iftKey === "verb") {
        if (newForm.noun !== null) newForm.noun = null;
        if (newForm.verb === null) {
          // newForm.verb = {};
          // Object.keys(yupSchema.fields.verb.fields).forEach(f=> {
          //   newForm.verb[f] = yupSchema.fields.verb.fields[f].default();
          // });
          newForm.verb = {
            infId: 0,
            infName: "",
            verbTypeId: 0,
            verbParadigmId: 0,
            verbPluralityTypeId: 0,
            verbRowFilterId: 0,
          };
        }
      }

      if (inflectionType.iftKey === "noun") {
        if (newForm.verb !== null) {
          newForm.verb = null;
          newForm.personVariabilityTypeIds = [];
        }
        if (newForm.noun === null) {
          // newForm.noun = {};
          // Object.keys(yupSchema.fields.noun.fields).forEach(f=> {
          //   newForm.noun[f] = yupSchema.fields.noun.fields[f].default();
          // });
          newForm.noun = { nounParadigmId: 0 };
        }
      }

      // console.log(
      //   "InflectionEdit setInflectionType before createFormulaFormData newForm=",
      //   newForm
      // );

      const formulaFormDataType = createFormulaFormData(
        curRanges,
        curMorphemes,
        rangesInGroup,
        newForm.freeMorphemeIds,
        morphemesQuery,
        true,
        true
      );

      // console.log(
      //   "InflectionEdit setInflectionType formulaFormDataType=",
      //   formulaFormDataType
      // );
      setCurMorphemes(formulaFormDataType.morphemes);
      setCurRanges(formulaFormDataType.ranges);
      if (formulaFormDataType.error)
        dispatch(setAlertClientRunTimeError(formulaFormDataType.error));

      //newForm.formData.creator = newForm.inflection.creator;
      // switch(newForm.inflection.recordStatusId)
      // {
      //   case 0:
      //     newForm.formData.editStatus = 'ახალი';
      //     newForm.formData.editStatusColor = 'blue';
      //     break
      //   case 1:
      //     newForm.formData.editStatus = 'წაშლის კანდიდატი';
      //     newForm.formData.editStatusColor = 'red';
      //     break
      //   case 2:
      //     newForm.formData.editStatus = 'დამოწმებული';
      //     newForm.formData.editStatusColor = 'green';
      //     break
      //   }

      //გავუგზავნოთ ახალი ფორმა ფორმის მენეჯერს.

      const newFormWithMorphemes = copyMorphemsToMainData(
        newForm,
        formulaFormDataType.morphemes,
        formulaFormDataType.ranges
      );

      //console.log("InflectionEdit setInflectionType newFormWithMorphemes=", newFormWithMorphemes);

      return newFormWithMorphemes;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      inflectionBlocks,
      inflectionTypes,
      morphemeGroups,
      morphemeRanges,
      morphemesQuery,
      morphemeRangesByInflectionBlocks,
      // copyMorphemsToMainData,
      // dispatch,
      // morphemes,
      // ranges,
    ]
  );
  //, yupSchema.fields.verb.fields, yupSchema.fields.noun.fields

  const { rootId: fromParamsRootId } = useParams<string>();
  const { dbrId: fromParamsDbrId } = useParams<string>();
  const { infId: fromParamsInfId } = useParams<string>();

  const [getOneInflectionById, { isLoading: loadingInflection }] =
    useLazyGetOneInflectionByIdQuery();
  const [CheckLoadRootsByInflectionId] = useCheckLoadRootsByInflectionId();

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

    //ვამოწმებთ მისამართში შეიცვალა თუ არა იდენტიფიკატორი
    if (curInfIdVal !== infIdVal) {
      //შეცვლილა

      //გავასუფთავოთ შეცდომები, სანამ ახლების დაგროვებას დავიწყებთ
      dispatch(clearAllAlerts());

      //დავიმახსოვროთ შეცვლილი იდენტიფიკატორი
      setCurInfIdVal(infIdVal);
      if (infIdVal) {
        //თუ იდენტიფიკატორი კარგია, ჩავტვირთოთ ბაზიდან ინფორმაცია
        getOneInflectionById(infIdVal);
        CheckLoadRootsByInflectionId(infIdVal);
        return;
      }

      //ახალი სარედაქტირებელი ობიექტის შექმნა
      clearToDefaults();
      return;
    }

    //console.log("Before setInflectionType ", {loadingInflection, infId, inflectionForEdit, mdWorkingOnLoad,
    //   inflectionBlocks, inflectionTypes, morphemeGroups, morphemeRanges, morphemesQuery, morphemeRangesByInflectionBlocks, rootLoading})

    //აქ თუ მოვედით, ესეიგი იდენტიფიკატორი იგივეა და კომპონენტის თვისებები შეიცვალა
    //ანუ სავარაუდოდ ჩატვირთვა დამთავრდა
    //თუმცა მაინც უნდა დავრწმუნდეთ
    //ან თუ ახალი ჩანაწერი იქნება, ჩატვირთვას არ ველოდებით
    //ან თუ ჩატვირთვა კი დასრულდა, მაგრამ ჩატვირთულიობიექტი მაინც შევამოწმოთ
    if (
      loadingInflection ||
      !fromParamsInfId ||
      !inflectionForEdit ||
      mdWorkingOnLoad ||
      Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
      !inflectionBlocks ||
      !inflectionTypes ||
      !pronouns ||
      !classifiers ||
      !morphemeGroups ||
      !morphemeRanges ||
      !morphemesQuery ||
      !morphemeRangesByInflectionBlocks ||
      !verbTypes ||
      !personVariabilityTypes ||
      rootLoading
    )
      return;

    // setFormData(inflectionForEdit);

    //console.log("InflectionEdit Call setInflectionType inflectionTypeId=",inflectionForEdit.inflection.inflectionTypeId);
    let newForm = setInflectionType(
      inflectionForEdit,
      inflectionForEdit.inflection.inflectionTypeId
    );
    if (newForm && newForm.verb)
      newForm = setVerbType(
        newForm,
        newForm.verb ? newForm.verb.verbTypeId : 0
      );
    //console.log("InflectionEdit after Call setInflectionType newForm=",newForm);
    if (newForm) setFormData(newForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pronouns,
    classifiers,
    morphemeGroups,
    morphemeRanges,
    morphemesQuery,
    inflectionBlocks,
    inflectionTypes,
    morphemeRangesByInflectionBlocks,
    verbTypes,
    personVariabilityTypes,
    curInfIdVal,
    curDbrIdVal,
    currentRootId,
    inflectionForEdit,
    loadingInflection,
    mdWorkingOnLoad,
    mdWorkingOnLoadingTables,
    fromParamsRootId,
    fromParamsDbrId,
    fromParamsInfId,
    rootLoading,
    // getOneInflectionById,
    // clearToDefaults,
    // CheckLoadRootsByInflectionId,
    // setInflectionType,
    // setFormData,
    // setVerbType,
  ]);

  // console.log("InflectionEdit.js on check Load ", {
  //   pronouns,
  //   classifiers,
  //   morphemeGroups,
  //   morphemeRanges,
  //   morphemesQuery,
  //   phoneticsTypes,
  //   inflectionTypes,
  //   inflectionBlocks,
  //   morphemeRangesByInflectionBlocks,
  //   nounParadigms,
  //   verbParadigms,
  //   verbTypes,
  //   verbPluralityTypes,
  //   verbRowFilters,
  //   personVariabilityTypes,
  //   verbRowParadigmsByVerbTypes,
  //   curDbrIdVal,
  //   curInfIdVal,
  //   currentRootId,
  //   inflectionForEdit,
  //   loadingInflection,
  //   mdWorkingOnLoad,
  //   mdWorkingOnLoadingTables,
  //   rootLoading,
  //   frm,
  // });

  const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

  if (ApiLoadHaveErrors)
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );

  if (
    loadingInflection ||
    mdWorkingOnLoad ||
    Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
    rootLoading ||
    verbRowParadigmsByVerbTypesLoading
  )
    //თუ ინფორმაციის ჩატვირთვა ჯერ კიდევ მიმდინარეობა
    return <WaitPage />;

  //(curDbrIdVal && !inflectionForEdit) ||
  //8. ჩატვირთვის შემოწმება
  //თუ იდენტიფიკატორი წესიერია და ჩატვირთული ობიექტი ჯერ არ არის, ან საჭირო ცხრილები ჩატვირთული არ არის
  if (
    !pronouns ||
    !classifiers ||
    !morphemeGroups ||
    !morphemeRanges ||
    !morphemesQuery ||
    !phoneticsTypes ||
    !inflectionTypes ||
    !inflectionBlocks ||
    !morphemeRangesByInflectionBlocks ||
    !nounParadigms ||
    !verbParadigms ||
    !verbTypes ||
    !verbPluralityTypes ||
    !verbRowFilters ||
    !personVariabilityTypes ||
    !verbRowParadigmsByVerbTypes ||
    !frm ||
    !frm.inflection
  ) {
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  //morphemeGroups, morphemeRanges, morphemesQuery, phoneticsTypes, inflectionTypes, inflectionBlocks, morphemeRangesByInflectionBlocks

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

    const currentForm = { ...frm } as InflectionData;
    //delete currentForm.formData;

    currentForm.inflectionPredecessors.forEach((pred, index, arr) => {
      if (pred.phoneticsTypeId === 0) arr[index].phoneticsTypeId = null;
    });

    createOrUpdateInflection(curDbrIdVal, currentRootId, currentForm);

    clearUsedTables();
  }

  // console.log("InflectionEdit frm=", frm);

  const inflectionResultName =
    (frm && frm.inflection && frm.inflection.infName
      ? `${frm.inflection.infName}`
      : "") +
    (frm.inflection.infSamples ? ` (${frm.inflection.infSamples})` : "");
  const lemma =
    frm && frm.inflection && frm.inflection.lemma
      ? `${frm.inflection.lemma}`
      : "";
  const userHasConfirmRight =
    user?.appClaims.some((s) => s === "Confirm") ?? false;

  const allowEditAndDelete = isAllowEditAndDelete(
    curInfIdVal,
    user?.userName,
    frm.inflection.creator,
    frm.inflection.recordStatusId,
    userHasConfirmRight
  );

  // console.log(
  //   "InflectionEdit verbRowParadigmsByVerbTypes=",
  //   verbRowParadigmsByVerbTypes
  // );
  // console.log(
  //   "InflectionEdit verbRowParadigmsByVerbTypes=",
  //   verbRowParadigmsByVerbTypes
  // );

  return (
    <Row className="root-editor-row">
      <Col md="8" className="root-editor-column">
        <div id="root-deriv-tree" className="root-editor-scroll">
          <AlertMessages alertKind={EAlertKind.ClientRunTime} />
          <Form onSubmit={handleSubmit}>
            <EditorHeader
              curIdVal={curDbrIdVal}
              EditorName="ფლექსია"
              EditorNameGenitive="ფლექსიის"
              EditedObjectName={inflectionResultName}
              workingOnDelete={workingOnDeleteInflection}
              DeleteFailure={DeleteFailure}
              onDelete={() => {
                deleteInflection(curInfIdVal, curDbrIdVal, currentRootId);
                clearUsedTables();
              }}
              onClearDeletingFailure={() => {
                dispatch(setDeleteFailureInflection(false));
              }}
              allowDelete={allowEditAndDelete}
            />

            {userHasConfirmRight &&
              frm.inflection.recordStatusId !== undefined && (
                <StatusConfirmRejectPart
                  recordStatusId={frm.inflection.recordStatusId}
                  creator={frm.inflection.creator}
                  applier={frm.inflection.applier}
                  workingOnConfirmReject={workingOnConfirmRejectInflection}
                  confirmRejectFailure={confirmRejectFailure}
                  onConfirmRejectClick={(confirm, withAllDescendants) => {
                    confirmRejectInflection(
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
              text={inflectionResultName}
            />

            <OnePlaintextRow controlId="lemma" label="ლემა" text={lemma} />

            <OneNumberControl
              controlId="inflection.infHomonymIndex"
              label="ომონიმიის სორტირების ნომერი"
              value={frm.inflection.infHomonymIndex}
              minv={0}
              getError={getError}
              onChangeValue={changeField}
            />
            <OneTextControl
              controlId="inflection.infNote"
              label="შენიშვნა"
              value={frm.inflection.infNote}
              getError={getError}
              onChangeValue={changeField}
            />

            <OneStrongLabel
              controlId="mainParametersLabel"
              label="მთავარი პარამეტრები"
            />

            <OneComboBoxControl
              controlId="inflection.classifierId"
              label="კლასიფიკატორი"
              value={frm.inflection.classifierId}
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
              controlId="inflection.inflectionTypeId"
              label="ფლექსიის მოდელი"
              value={frm.inflection.inflectionTypeId}
              dataMember={inflectionTypes}
              firstItem={{ id: 0, name: "აირჩიე ფლექსიის მოდელი" }}
              valueMember="iftId"
              displayMember="iftName"
              sortByDisplayMember={true}
              getError={getError}
              onChangeValue={(fieldPath, value) => {
                if (value === 0) return;
                const newForm = setInflectionType(frm, value);
                //console.log("InflectionEdit onChangeValue inflection.inflectionTypeId newForm=",newForm);
                setFormData(newForm);
              }}
            />

            {!!frm.inflection.inflectionTypeId && (
              <div>
                {frm.noun && (
                  <OneComboBoxControl
                    controlId="noun.nounParadigmId"
                    label="სახელის პარადიგმა"
                    value={frm.noun.nounParadigmId}
                    dataMember={nounParadigms}
                    firstItem={{ id: 0, name: "აირჩიე სახელის პარადიგმა" }}
                    valueMember="npnId"
                    displayMember="npnName"
                    sortByDisplayMember={true}
                    getError={getError}
                    onChangeValue={changeField}
                  />
                )}

                {frm.verb && (
                  <div>
                    <OneComboBoxControl
                      controlId="verb.verbTypeId"
                      label="ზმნის ტიპი"
                      value={frm.verb.verbTypeId}
                      dataMember={[...verbTypes].sort(
                        (a, b) => a.sortId - b.sortId
                      )}
                      firstItem={{ id: 0, name: "აირჩიე ზმნის ტიპი" }}
                      valueMember="vtpId"
                      displayMember="vtpName"
                      sortByDisplayMember={false}
                      getError={getError}
                      onChangeValue={(fieldPath, value) => {
                        const newForm = setVerbType(frm, value);
                        //console.log("InflectionEdit onChangeValue verb.verbTypeId newForm=",newForm);
                        setFormData(newForm);
                      }}
                    />

                    <OneComboBoxControl
                      controlId="verb.verbParadigmId"
                      label="ზმნის პარადიგმა"
                      value={frm.verb.verbParadigmId}
                      dataMember={verbParadigms
                        .filter((x) => {
                          if (
                            frm.verb?.verbTypeId &&
                            verbRowParadigmsByVerbTypes
                          )
                            return verbRowParadigmsByVerbTypes[
                              frm.verb.verbTypeId
                            ].includes(x.vpnId);
                          return false;
                        })
                        .map((m) => {
                          return {
                            vpnId: m.vpnId,
                            vpnFullName: `${m.vpnKey} ${m.vpnName}`,
                          };
                        })}
                      firstItem={{ id: 0, name: "აირჩიე ზმნის პარადიგმა" }}
                      valueMember="vpnId"
                      displayMember="vpnFullName"
                      sortByDisplayMember={true}
                      getError={getError}
                      onChangeValue={changeField}
                    />

                    <OneComboBoxControl
                      controlId="verb.verbPluralityTypeId"
                      label="ზმნის მრავლობითობის ტიპი"
                      value={frm.verb.verbPluralityTypeId}
                      dataMember={verbPluralityTypes}
                      firstItem={{
                        id: 0,
                        name: "აირჩიე ზმნის მრავლობითობის ტიპი",
                      }}
                      valueMember="vptId"
                      displayMember="vptName"
                      sortByDisplayMember={true}
                      getError={getError}
                      onChangeValue={changeField}
                    />

                    <OneComboBoxControl
                      controlId="verb.verbRowFilterId"
                      label="ზმნის მწკრივების ფილტრი"
                      value={frm.verb.verbRowFilterId}
                      dataMember={verbRowFilters}
                      firstItem={{ id: 0, name: "აირჩიე მწკრივების ფილტრი" }}
                      valueMember="vrfId"
                      displayMember="vrfName"
                      sortByDisplayMember={true}
                      getError={getError}
                      onChangeValue={changeField}
                    />

                    {frm.personVariabilityTypeIds.length > 0 && (
                      <div>
                        <OneStrongLabel
                          controlId="personVariability"
                          label="პირების ცვალებადობა"
                        />

                        {frm.personVariabilityTypeIds.map((m, i) => (
                          <OneComboBoxControl
                            key={i}
                            controlId={`personVariabilityTypeIds[${i}]`}
                            label={`აქტანტი ${i + 1}`}
                            value={frm.personVariabilityTypeIds[i]}
                            dataMember={personVariabilityTypes}
                            firstItem={{
                              id: 0,
                              name: "აირჩიე პირცვალებადობის ტიპი",
                            }}
                            valueMember="pvtId"
                            displayMember="pvtName"
                            sortByDisplayMember={true}
                            getError={getError}
                            onChangeValue={changeField}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <BasesAndFreeMorphemes
                  ranges={curRanges}
                  morphemes={curMorphemes}
                  morphemesQuery={morphemesQuery}
                  forInflection
                  phoneticsTypes={phoneticsTypes}
                  morphemesdPath="frm.formData.morphemes"
                  getError={getError}
                  selectPhoneticsType={true}
                  predecessors={frm.inflectionPredecessors}
                  onMorphemeChange={(index, value) => {
                    let newForm = { ...frm };
                    curMorphemes[index] = value;
                    // //გავუგზავნოთ ახალი ფორმა ფორმის მენეჯერს.
                    newForm = copyMorphemsToMainData(
                      newForm,
                      curMorphemes,
                      curRanges
                    );
                    //console.log("InflectionEdit onMorphemeChange newForm=",newForm);
                    setFormData(newForm);
                  }}
                  onPredecessorChange={(baseNom, item) => {
                    const newForm = { ...frm };

                    let predByBase = newForm.inflectionPredecessors.find(
                      (pred) => pred.baseNom === baseNom
                    );
                    if (item) {
                      if (!predByBase) {
                        predByBase = {} as InflectionPredecessorRedModel;
                        predByBase.baseNom = baseNom;
                        predByBase.parentBranchId = item.itemId;
                        predByBase.phoneticsTypeId = null;
                        newForm.inflectionPredecessors.push(predByBase);
                      } else {
                        predByBase.parentBranchId = item.itemId;
                      }
                    } else {
                      if (predByBase) {
                        newForm.inflectionPredecessors =
                          newForm.inflectionPredecessors.filter(
                            (pred) => pred.baseNom !== baseNom
                          );
                      }
                    }
                    //console.log("InflectionEdit onPredecessorChange newForm=",newForm);
                    setFormData(newForm);
                  }}
                  onPredecessorPhoneticsTypeChange={(baseNom, value) => {
                    const newForm = { ...frm };
                    const predByBase = newForm.inflectionPredecessors.find(
                      (pred) => pred.baseNom === baseNom
                    );
                    if (!predByBase) return;
                    predByBase.phoneticsTypeId = value;
                    //console.log("InflectionEdit onPredecessorPhoneticsTypeChange newForm=",newForm);
                    setFormData(newForm);
                  }}
                />
              </div>
            )}

            <OneSaveCancelButtons
              curIdVal={curInfIdVal}
              haveErrors={haveErrors}
              savingNow={creatingOrupdatingInflection}
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

      {!!curInfIdVal && <Paradigm InflectionIdentifier={curInfIdVal} />}
    </Row>
  );
};

export default InflectionEdit;
