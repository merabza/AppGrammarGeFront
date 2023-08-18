//VerbPersonMarkerFormulaEdit.tsx

import { useState, useEffect, useCallback, useMemo, FC } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import {
  InflectionBlock,
  InflectionType,
  Morpheme,
  MorphemeRange,
  MorphemeRangeByInflectionBlock,
  VerbNumber,
  VerbPerson,
  VerbPluralityType,
} from "../masterData/mdTypes";
import { VerbPersonMarkerParadigm } from "../redux/types/formulasTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useForman } from "../appcarcass/hooks/useForman";
import {
  VerbPersonMarkerFormulaFormData,
  VerbPersonMarkerFormulaFormDataSchema,
} from "./VerbPersonMarkerFormulaData";
import { clearVerbPersonMarkerFormulas } from "../redux/slices/modelDataSlice";
import { createFormulaFormData } from "../derivationTreeEditor/FormulasModule";
import { useNavigate, useParams } from "react-router-dom";
import { NzInt } from "../appcarcass/common/myFunctions";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import {
  useCreateVerbPersonMarkerFormulaMutation,
  useDeleteVerbPersonMarkerFormulaMutation,
  useLazyGetOneVerbPersonMarkerFormulaByIdQuery,
  useUpdateVerbPersonMarkerFormulaMutation,
} from "../redux/api/verbPersonMarkerFormulasCrudApi";
import { useAlert } from "../appcarcass/hooks/useAlert";
import {
  EAlertKind,
  clearAllAlerts,
} from "../appcarcass/redux/slices/alertSlice";
import AlertMessages from "../appcarcass/common/AlertMessages";
import WaitPage from "../appcarcass/common/WaitPage";
import EditorHeader from "../appcarcass/editorParts/EditorHeader";
import OnePlaintextRow from "../appcarcass/editorParts/OnePlaintextRow";
import { getFormulaVisual2 } from "./FormulasModule";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import OneSaveCancelButtons from "../appcarcass/editorParts/OneSaveCancelButtons";
import OneErrorRow from "../appcarcass/editorParts/OneErrorRow";
import { useClearTablesFromRepo } from "../appcarcass/masterdata/masterDataHooks/useClearTablesFromRepo";

const VerbPersonMarkerFormulaEdit: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );

  const morphemeRanges = mdRepo.morphemeRanges as MorphemeRange[];
  const morphemesQuery = mdRepo.morphemesQuery as Morpheme[];
  const inflectionBlocks = mdRepo.inflectionBlocks as InflectionBlock[];
  const inflectionTypes = mdRepo.inflectionTypes as InflectionType[];
  const verbPluralityTypes = mdRepo.verbPluralityTypes as VerbPluralityType[];
  const verbPersons = mdRepo.verbPersons as VerbPerson[];
  const verbNumbers = mdRepo.verbNumbers as VerbNumber[];
  const verbPersonMarkerParadigms =
    mdRepo.verbPersonMarkerParadigms as VerbPersonMarkerParadigm[];
  const morphemeRangesByInflectionBlocks =
    mdRepo.morphemeRangesByInflectionBlocks as MorphemeRangeByInflectionBlock[];

  const [morphemes, setMorphemes] = useState<number[]>([] as number[]);
  const [ranges, setRanges] = useState<MorphemeRange[]>([] as MorphemeRange[]);

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const [
    getOneVerbPersonMarkerFormulaById,
    { isLoading: loadingVerbPersonMarkerFormula },
  ] = useLazyGetOneVerbPersonMarkerFormulaByIdQuery();

  const { verbPersonMarkerFormulaForEdit } = useAppSelector(
    (state) => state.verbPersonMarkerFormulasCrudState
  );

  //1. იდენტიფიკატორი
  const [curFormulaIdVal, setCurFormulaIdVal] = useState<number | undefined>(
    undefined
  );
  const [paradigmIdsForClear, setParadigmIdsForClear] = useState<number[]>(
    [] as number[]
  );

  const [formDataPrepared, setFormDataPrepared] = useState(false);

  const [clearTablesFromRepo] = useClearTablesFromRepo();

  const [
    createVerbPersonMarkerFormula,
    { isLoading: creatingVerbPersonMarkerFormula },
  ] = useCreateVerbPersonMarkerFormulaMutation();
  const [
    updateVerbPersonMarkerFormula,
    { isLoading: updatingVerbPersonMarkerFormula },
  ] = useUpdateVerbPersonMarkerFormulaMutation();
  const [
    deleteVerbPersonMarkerFormula,
    { isLoading: deletingVerbPersonMarkerFormula, isError: DeleteFailure },
  ] = useDeleteVerbPersonMarkerFormulaMutation();

  //  console.log("VerbPersonMarkerFormulaEdit props=", props);

  //3. ეს არის ის ცხრილები, რომელზეც მოქმედებს ეს კონკრეტული რედაქტორი
  const tableNamesForClear = useMemo(
    () => ["verbPersonMarkerParadigmRows"],
    []
  );

  //4. ეს არის ის ცხრილები, რომლებიდანაც ინფორმაცია სჭირდება ამ რედაქტრს
  const tableNamesForLoad = useMemo(
    () => [
      "morphemeRanges",
      "morphemesQuery",
      "inflectionBlocks",
      "inflectionTypes",
      "morphemeRangesByInflectionBlocks",
      "verbPersonMarkerParadigms",
      "verbPluralityTypes",
      "verbPersons",
      "verbNumbers",
    ],
    []
  );

  const [checkLoadMdTables] = useCheckLoadMdTables();

  useEffect(() => {
    checkLoadMdTables(tableNamesForLoad);
  }, [tableNamesForLoad]);

  //console.log("VerbPersonMarkerFormulaEdit yupSchema=", yupSchema);

  //6. ფორმის მენეჯერი
  const [
    frm,
    changeField,
    getError,
    getAllErrors,
    clearToDefaults,
    setFormData,
  ] = useForman<
    typeof VerbPersonMarkerFormulaFormDataSchema,
    VerbPersonMarkerFormulaFormData
  >(VerbPersonMarkerFormulaFormDataSchema);

  function clearUsedTables() {
    clearTablesFromRepo(tableNamesForClear, tableNamesForLoad);
    dispatch(clearVerbPersonMarkerFormulas(paradigmIdsForClear));
  }

  const copyMorphemsToMainData = useCallback(
    (forForm: VerbPersonMarkerFormulaFormData, morphemes: number[]) => {
      const newForm = JSON.parse(
        JSON.stringify(forForm)
      ) as VerbPersonMarkerFormulaFormData;

      //console.log("VerbPersonMarkerFormulaEdit copyMorphemsToMainData forForm=", forForm);
      //console.log("VerbPersonMarkerFormulaEdit copyMorphemsToMainData newForm=", newForm);

      newForm.morphemeIds = morphemes
        .map((mrpId) => {
          return mrpId ? morphemesQuery.find((f) => f.mrpId === mrpId) : null;
        })
        .filter((f): f is Morpheme => !!f && !!f.mrpNom)
        .map((m) => m.mrpId);
      //გავუგზავნოთ ახალი ფორმა ფორმის მენეჯერს.
      setFormData(newForm);
    },
    [morphemesQuery, setFormData]
  );

  const addForClearParadigmId = useCallback(
    (paradigmId: number) => {
      if (paradigmIdsForClear.includes(paradigmId)) return;
      const newParadigmIdsForClear = [...paradigmIdsForClear, paradigmId];
      setParadigmIdsForClear(newParadigmIdsForClear);
    },
    [paradigmIdsForClear]
  );

  const prepareFormDataForEdit = useCallback(
    (forForm: VerbPersonMarkerFormulaFormData | null) => {
      const newForm = forForm
        ? forForm
        : (JSON.parse(JSON.stringify(frm)) as VerbPersonMarkerFormulaFormData);

      //მოვძებნოთ ფლექსიის ბლოკის შესაბამისი ობიექტი
      const inflectionBlock = inflectionBlocks.find(
        (f) => f.inbKey === "PersonMarkersBlock"
      );

      if (!inflectionBlock) return;
      // console.log(
      //   "VerbPersonMarkerFormulaEdit prepareFormDataForEdit inflectionBlock=",
      //   inflectionBlock
      // );
      // console.log(
      //   "VerbPersonMarkerFormulaEdit prepareFormDataForEdit inflectionTypes=",
      //   inflectionTypes
      // );

      //ფლექსიის ტიპის პოვნას აზრი აქვს მხოლოდ იმ შემთხვევაში, თუ ფლექსიის ტიპების ცხრილი ჩატვირთულია
      //მოვძებნოთ ფლექსიის ტიპის შესაბამისი ობიექტი
      const inflectionType = inflectionTypes.find(
        (f) => f.iftId === inflectionBlock.inflectionTypeId
      );

      // console.log(
      //   "VerbPersonMarkerFormulaEdit prepareFormDataForEdit inflectionType=",
      //   inflectionType
      // );

      if (!inflectionType) return;

      //ამოვკრიბოთ იმ რანგების შესახებ ინფორმაცია, რომლებიც მონაწილეობენ ამ ტიპის დერივაციის ფორმირებაში
      const MorphemeRangeIdsByIB = morphemeRangesByInflectionBlocks
        .filter((f) => f.inflectionBlockId === inflectionBlock.inbId)
        .map((m) => m.morphemeRangeId);

      const newRangesInGroup = morphemeRanges
        .filter(
          (f) =>
            f.morphemeGroupId === inflectionType.morphemeGroupId &&
            MorphemeRangeIdsByIB.includes(f.mrId)
        )
        .sort((a, b) => a.mrPosition - b.mrPosition);

      const formulaFormDataType = createFormulaFormData(
        ranges,
        morphemes,
        newRangesInGroup,
        newForm.morphemeIds,
        morphemesQuery,
        false,
        true
      );

      // console.log(
      //   "VerbPersonMarkerFormulaEdit prepareFormDataForEdit formulaFormDataType=",
      //   formulaFormDataType
      // );
      setMorphemes(formulaFormDataType.morphemes);
      setRanges(formulaFormDataType.ranges);

      //გავუგზავნოთ ახალი ფორმა ფორმის მენეჯერს.
      //console.log("VerbRowParadigmFormulaEdit prepareFormDataForEdit newForm=", newForm);
      copyMorphemsToMainData(newForm, formulaFormDataType.morphemes);
    },
    [
      morphemesQuery,
      frm,
      ranges,
      morphemes,
      inflectionBlocks,
      inflectionTypes,
      morphemeRanges,
      morphemeRangesByInflectionBlocks,
    ]
  );

  const { formulaId: fromParamsformulaId } = useParams<string>();

  //7. იდენტიფიკატორის ეფექტი
  useEffect(() => {
    const formulaIdVal = NzInt(fromParamsformulaId);
    //console.log("VerbPersonMarkerFormulaEdit useEffect curFormulaIdVal=", curFormulaIdVal);
    //console.log("VerbPersonMarkerFormulaEdit useEffect formulaIdVal=", formulaIdVal);

    //ვამოწმებთ მისამართში შეიცვალა თუ არა იდენტიფიკატორი
    if (curFormulaIdVal !== formulaIdVal) {
      //შეცვლილა
      //დავიმახსოვროთ შეცვლილი იდენტიფიკატორი
      setCurFormulaIdVal(formulaIdVal);
      setFormDataPrepared(false);
      setParadigmIdsForClear([]);
      if (formulaIdVal) {
        //თუ იდენტიფიკატორი კარგია, ჩავტვირთოთ ბაზიდან ინფორმაცია
        getOneVerbPersonMarkerFormulaById(formulaIdVal);
        return;
      }
      //ახალი სარედაქტირებელი ობიექტის შექმნა
      clearToDefaults();
      //console.log("VerbPersonMarkerFormulaEdit useEffect after clearToDefaults frm=", frm);
    }

    //თუ საჭირო ინფორმაცია ჯერ ჩატვირთული არ არის, მაშIნ გაგრეძელებას აზრი არ აქვს
    if (
      mdWorkingOnLoad ||
      mdWorkingOnLoadingTables ||
      !morphemesQuery ||
      !verbPersonMarkerParadigms
    )
      return;

    //console.log("VerbPersonMarkerFormulaEdit useEffect after checkLoad curFormulaIdVal=", curFormulaIdVal);

    //აქ თუ მოვედით, ესეიგი იდენტიფიკატორი იგივეა და კომპონენტის თვისებები შეიცვალა
    //ანუ სავარაუდოდ ჩატვირთვა დამთავრდა
    //თუმცა მაინც უნდა დავრწმუნდეთ
    //ან თუ ახალი ჩანაწერი იქნება, ჩატვირთვას არ ველოდებით
    //ან თუ ჩატვირთვა კი დასრულდა, მაგრამ ჩატვირთული ობიექტი მაინც შევამოწმოთ

    //დავამზადოთ ფორმის ახალი ობიექტი
    if (formulaIdVal) {
      //ტუ ინფომრაცია ჯერ ჩატვირთული არ არის, ვჩერდებით
      if (loadingVerbPersonMarkerFormula || !verbPersonMarkerFormulaForEdit)
        return;
      addForClearParadigmId(
        verbPersonMarkerFormulaForEdit.verbPersonMarkerFormula
          .verbPersonMarkerParadigmId
      );
      if (!formDataPrepared) {
        setFormDataPrepared(true);
        prepareFormDataForEdit(verbPersonMarkerFormulaForEdit);
      }
    } else {
      if (!formDataPrepared) {
        setFormDataPrepared(true);
        prepareFormDataForEdit(null);
      }
    }
  }, [
    curFormulaIdVal,
    verbPersonMarkerParadigms,
    formDataPrepared,
    curFormulaIdVal,
    loadingVerbPersonMarkerFormula,
    mdWorkingOnLoad,
    morphemesQuery,
    verbPersonMarkerFormulaForEdit,
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
    loadingVerbPersonMarkerFormula ||
    mdWorkingOnLoad ||
    mdWorkingOnLoadingTables
  )
    //თუ ინფორმაციის ჩატვირთვა ჯერ კიდევ მიმდინარეობა
    return <WaitPage />;

  //აქ ითვლება, რომ თუ პარადიგმის სახელების დარედაქტირების უფლება აქვს მომხმარებელს
  //მაშინ პარადიგმებზეც უნდა ჰქონდეს.
  //ასე იმიტომ გაკეთდა, რომ არ გამხდარიყო საჭირო პარადიგმების მწკრივის ცხრილის დარეგისტრირება DataType-ებში
  //თუ მომავალში ამ ორი უფლების გამიჯვნა გახდა საჭირო, მოგვიწევს DataType-ებში დავარეგისტრიროთ პარადიგმების მწკრივის ცხრილი
  const dataType = dataTypes.find(
    (f) => f.dtTable === "verbPersonMarkerParadigms"
  );

  //თუ იდენტიფიკატორი წესიერია და ჩატვირთული ობიექტი ჯერ არ არის, ან საჭირო ცხრილები ჩატვირთული არ არის
  if (
    (curFormulaIdVal && !verbPersonMarkerFormulaForEdit) ||
    !morphemeRanges ||
    !morphemesQuery ||
    !inflectionBlocks ||
    !inflectionTypes ||
    !morphemeRangesByInflectionBlocks ||
    !verbPersonMarkerParadigms ||
    !verbPluralityTypes ||
    !verbPersons ||
    !verbNumbers ||
    !verbPersonMarkerParadigms ||
    !dataTypes ||
    !dataType
  ) {
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  //console.log("VerbPersonMarkerFormulaEdit frm=", frm);

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
    //console.log("VerbPersonMarkerFormulaEdit handleSubmit e=",e);
    //console.log("VerbPersonMarkerFormulaEdit handleSubmit frm=",frm);

    const currentForm = JSON.parse(
      JSON.stringify(frm)
    ) as VerbPersonMarkerFormulaFormData;

    if (curFormulaIdVal) updateVerbPersonMarkerFormula(currentForm);
    else createVerbPersonMarkerFormula(currentForm);
    clearUsedTables();
  }

  return (
    <Row>
      <Col md="6">
        <AlertMessages alertKind={EAlertKind.ClientRunTime} />
        <Form onSubmit={handleSubmit}>
          <EditorHeader
            curIdVal={curFormulaIdVal}
            EditorName="ზმნის ცალი პირის პარადიგმის ფორმულა"
            EditorNameGenitive="ზმნის ცალი პირის პარადიგმის ფორმულის"
            EditedObjectName={
              frm &&
              frm.verbPersonMarkerFormula &&
              frm.verbPersonMarkerFormula.formulaName
                ? frm.verbPersonMarkerFormula.formulaName
                : ""
            }
            workingOnDelete={deletingVerbPersonMarkerFormula}
            DeleteFailure={DeleteFailure}
            onDelete={() => {
              if (!!curFormulaIdVal)
                deleteVerbPersonMarkerFormula(curFormulaIdVal);
              clearUsedTables();
            }}
            allowDelete={dataType.delete}
          />
          <OnePlaintextRow
            controlId="result"
            label="შედეგი"
            text={getFormulaVisual2(frm.morphemeIds, ranges, morphemesQuery)}
          />
          <OneStrongLabel
            controlId="mainParametersLabel"
            label="მთავარი პარამეტრები"
          />
          <OneComboBoxControl
            controlId="verbPersonMarkerFormula.verbPluralityTypeId"
            label="მრავლობითობა"
            value={frm.verbPersonMarkerFormula.verbPluralityTypeId}
            dataMember={verbPluralityTypes}
            valueMember="vptId"
            displayMember="vptName"
            getError={getError}
            onChangeValue={changeField}
            firstItem={{ id: 0, name: "აირჩიეთ მრავლობითობა" }}
          />
          <OneComboBoxControl
            controlId="verbPersonMarkerFormula.verbPersonMarkerParadigmId"
            label="პარადიგმა"
            value={frm.verbPersonMarkerFormula.verbPersonMarkerParadigmId}
            dataMember={verbPersonMarkerParadigms.map((m) => {
              return { id: m.vpmpnId, name: `${m.vpmpnKey}` };
            })}
            valueMember="id"
            displayMember="name"
            getError={getError}
            onChangeValue={changeField}
            firstItem={{ id: 0, name: "აირჩიეთ პარადიგმა" }}
          />
          <OneComboBoxControl
            controlId="verbPersonMarkerFormula.verbPersonId"
            label="პირი"
            value={frm.verbPersonMarkerFormula.verbPersonId}
            dataMember={verbPersons}
            valueMember="vprId"
            displayMember="vprName"
            getError={getError}
            onChangeValue={changeField}
            firstItem={{ id: 0, name: "აირჩიეთ ზმნის პირი" }}
          />
          <OneComboBoxControl
            controlId="verbPersonMarkerFormula.verbNumberId"
            label="რიცხვი"
            value={frm.verbPersonMarkerFormula.verbNumberId}
            dataMember={verbNumbers}
            valueMember="vnmId"
            displayMember="vnmName"
            getError={getError}
            onChangeValue={changeField}
            firstItem={{ id: 0, name: "აირჩიეთ ზმნის რიცხვი" }}
          />

          <OneStrongLabel
            controlId="morphemes"
            label="მორფემები რანგების მიხედვით"
          />
          {ranges.map((range, index) => {
            return (
              <OneComboBoxControl
                key={index}
                controlId={`frm.formData.morphemes[${index}]`}
                label={`${range.mrPosition + 1}. ${range.mrName}`}
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
                  ) as VerbPersonMarkerFormulaFormData;
                  morphemes[index] = value;
                  copyMorphemsToMainData(newForm, morphemes);
                }}
              />
            );
          })}
          <OneSaveCancelButtons
            curIdVal={curFormulaIdVal}
            haveErrors={haveErrors}
            savingNow={
              creatingVerbPersonMarkerFormula || updatingVerbPersonMarkerFormula
            }
            onCloseClick={() => {
              dispatch(clearAllAlerts());
              navigate(
                `/verbPersonMarkerFormulas/${frm.verbPersonMarkerFormula.verbPersonMarkerParadigmId}/${curFormulaIdVal}`
              );
            }}
            allowEdit={dataType.update}
          />
          <OneErrorRow allErrors={allErrors} />
        </Form>
      </Col>
    </Row>
  );
};

export default VerbPersonMarkerFormulaEdit;
