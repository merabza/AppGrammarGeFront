//VerbRowParadigmFormulaEdit.tsx

import { useState, useEffect, useCallback, useMemo, FC } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import {
  InflectionBlock,
  InflectionType,
  Morpheme,
  MorphemeRange,
  MorphemeRangeByInflectionBlock,
  VerbParadigm,
  VerbRow,
  VerbType,
} from "../masterData/mdTypes";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import { VerbPersonMarkerParadigm } from "../redux/types/formulasTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useForman } from "../appcarcass/hooks/useForman";
import {
  VerbParadigmFormulaFormData,
  VerbParadigmFormulaFormDataSchema,
} from "./VerbParadigmFormulaData";
import { useClearTablesFromRepo } from "../appcarcass/masterdata/masterDataHooks/useClearTablesFromRepo";
import { clearVerbParadigmFormulas } from "../redux/slices/modelDataSlice";
import { createFormulaFormData } from "../derivationTreeEditor/FormulasModule";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateVerbParadigmFormulaMutation,
  useDeleteVerbParadigmFormulaMutation,
  useLazyGetOneVerbParadigmFormulaByIdQuery,
  useUpdateVerbParadigmFormulaMutation,
} from "../redux/api/verbParadigmFormulasCrudApi";
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

const VerbRowParadigmFormulaEdit: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );

  const morphemeRanges = mdRepo.morphemeRanges as MorphemeRange[];
  const morphemesQuery = mdRepo.morphemesQuery as Morpheme[];
  const inflectionBlocks = mdRepo.inflectionBlocks as InflectionBlock[];
  const inflectionTypes = mdRepo.inflectionTypes as InflectionType[];
  const verbParadigms = mdRepo.verbParadigms as VerbParadigm[];
  const verbTypes = mdRepo.verbTypes as VerbType[];
  const verbRows = mdRepo.verbRows as VerbRow[];
  const verbPersonMarkerParadigms =
    mdRepo.verbPersonMarkerParadigms as VerbPersonMarkerParadigm[];
  const morphemeRangesByInflectionBlocks =
    mdRepo.morphemeRangesByInflectionBlocks as MorphemeRangeByInflectionBlock[];

  const [morphemes, setMorphemes] = useState<number[]>([] as number[]);
  const [ranges, setRanges] = useState<MorphemeRange[]>([] as MorphemeRange[]);

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const [
    getOneVerbParadigmFormulaById,
    { isLoading: loadingVerbParadigmFormula },
  ] = useLazyGetOneVerbParadigmFormulaByIdQuery();

  const { verbParadigmFormulaForEdit } = useAppSelector(
    (state) => state.verbParadigmFormulasCrudState
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

  //  console.log("VerbRowParadigmFormulaEdit props=", props);

  const [
    createVerbParadigmFormula,
    { isLoading: creatingVerbParadigmFormula },
  ] = useCreateVerbParadigmFormulaMutation();
  const [
    updateVerbParadigmFormula,
    { isLoading: updatingVerbParadigmFormula },
  ] = useUpdateVerbParadigmFormulaMutation();
  const [
    deleteVerbParadigmFormula,
    { isLoading: deletingVerbParadigmFormula, isError: DeleteFailure },
  ] = useDeleteVerbParadigmFormulaMutation();

  //3. ეს არის ის ცხრილები, რომელზეც მოქმედებს ეს კონკრეტული რედაქტორი
  const tableNamesForClear = useMemo(() => ["VerbRowParadigmRows"], []);

  //4. ეს არის ის ცხრილები, რომლებიდანაც ინფორმაცია სჭირდება ამ რედაქტრს
  const tableNamesForLoad = useMemo(
    () => [
      "morphemeRanges",
      "morphemesQuery",
      "inflectionBlocks",
      "inflectionTypes",
      "morphemeRangesByInflectionBlocks",
      "verbParadigms",
      "verbTypes",
      "verbRows",
      "verbPersonMarkerParadigms",
    ],
    []
  );

  const [checkLoadMdTables] = useCheckLoadMdTables();

  useEffect(() => {
    checkLoadMdTables(tableNamesForLoad);
  }, [tableNamesForLoad]);

  //console.log("VerbRowParadigmFormulaEdit yupSchema=", yupSchema);

  //6. ფორმის მენეჯერი
  const [
    frm,
    changeField,
    getError,
    getAllErrors,
    clearToDefaults,
    setFormData,
  ] = useForman<
    typeof VerbParadigmFormulaFormDataSchema,
    VerbParadigmFormulaFormData
  >(VerbParadigmFormulaFormDataSchema);

  function clearUsedTables() {
    clearTablesFromRepo(tableNamesForClear, tableNamesForLoad);
    dispatch(clearVerbParadigmFormulas(paradigmIdsForClear));
  }

  const copyMorphemsToMainData = useCallback(
    (forForm: VerbParadigmFormulaFormData, morphemes: number[]) => {
      const newForm = JSON.parse(
        JSON.stringify(forForm)
      ) as VerbParadigmFormulaFormData;

      //console.log("VerbRowParadigmFormulaEdit copyMorphemsToMainData forForm=", forForm);
      //console.log("VerbRowParadigmFormulaEdit copyMorphemsToMainData newForm=", newForm);

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
    (forForm: VerbParadigmFormulaFormData | null) => {
      const newForm = forForm
        ? forForm
        : (JSON.parse(JSON.stringify(frm)) as VerbParadigmFormulaFormData);

      //მოვძებნოთ ფლექსიის ბლოკის შესაბამისი ობიექტი
      const inflectionBlock = inflectionBlocks.find(
        (f) => f.inbKey === "VerbRowsBlock"
      );

      if (!inflectionBlock) return;
      // console.log(
      //   "VerbParadigmFormulaEdit prepareFormDataForEdit inflectionBlock=",
      //   inflectionBlock
      // );
      // console.log(
      //   "VerbParadigmFormulaEdit prepareFormDataForEdit inflectionTypes=",
      //   inflectionTypes
      // );

      //ფლექსიის ტიპის პოვნას აზრი აქვს მხოლოდ იმ შემთხვევაში, თუ ფლექსიის ტიპების ცხრილი ჩატვირთულია
      //მოვძებნოთ ფლექსიის ტიპის შესაბამისი ობიექტი
      const inflectionType = inflectionTypes.find(
        (f) => f.iftId === inflectionBlock.inflectionTypeId
      );

      // console.log(
      //   "VerbParadigmFormulaEdit prepareFormDataForEdit inflectionType=",
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
      //   "VerbParadigmFormulaEdit prepareFormDataForEdit formulaFormDataType=",
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

    //ვამოწმებთ მისამართში შეიცვალა თუ არა იდენტიფიკატორი
    if (curFormulaIdVal !== formulaIdVal) {
      //შეცვლილა
      //დავიმახსოვროთ შეცვლილი იდენტიფიკატორი
      setCurFormulaIdVal(formulaIdVal);
      setFormDataPrepared(false);
      setParadigmIdsForClear([]);
      if (formulaIdVal) {
        //თუ იდენტიფიკატორი კარგია, ჩავტვირთოთ ბაზიდან ინფორმაცია
        getOneVerbParadigmFormulaById(formulaIdVal);
        return;
      }
      //ახალი სარედაქტირებელი ობიექტის შექმნა
      clearToDefaults();
      //console.log("VerbRowParadigmFormulaEdit useEffect after clearToDefaults frm=", frm);
    }

    //თუ საჭირო ინფორმაცია ჯერ ჩატვირთული არ არის, მაშIნ გაგრეძელებას აზრი არ აქვს
    if (
      mdWorkingOnLoad ||
      mdWorkingOnLoadingTables ||
      !morphemesQuery ||
      !verbParadigms
    )
      return;

    //აქ თუ მოვედით, ესეიგი იდენტიფიკატორი იგივეა და კომპონენტის თვისებები შეიცვალა
    //ანუ სავარაუდოდ ჩატვირთვა დამთავრდა
    //თუმცა მაინც უნდა დავრწმუნდეთ
    //ან თუ ახალი ჩანაწერი იქნება, ჩატვირთვას არ ველოდებით
    //ან თუ ჩატვირთვა კი დასრულდა, მაგრამ ჩატვირთული ობიექტი მაინც შევამოწმოთ

    //დავამზადოთ ფორმის ახალი ობიექტი
    if (formulaIdVal) {
      //ტუ ინფომრაცია ჯერ ჩატვირთული არ არის, ვჩერდებით
      if (loadingVerbParadigmFormula || !verbParadigmFormulaForEdit) return;
      addForClearParadigmId(
        verbParadigmFormulaForEdit.verbParadigmFormula.verbParadigmId
      );
      if (!formDataPrepared) {
        setFormDataPrepared(true);
        prepareFormDataForEdit(verbParadigmFormulaForEdit);
      }
    } else {
      if (!formDataPrepared) {
        setFormDataPrepared(true);
        prepareFormDataForEdit(null);
      }
    }
  }, [
    morphemesQuery,
    verbParadigms,
    curFormulaIdVal,
    loadingVerbParadigmFormula,
    mdWorkingOnLoad,
    verbParadigmFormulaForEdit,
    formDataPrepared,
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
  if (loadingVerbParadigmFormula || mdWorkingOnLoad || mdWorkingOnLoadingTables)
    //თუ ინფორმაციის ჩატვირთვა ჯერ კიდევ მიმდინარეობა
    return <WaitPage />;

  //აქ ითვლება, რომ თუ პარადიგმის სახელების დარედაქტირების უფლება აქვს მომხმარებელს
  //მაშინ პარადიგმებზეც უნდა ჰქონდეს.
  //ასე იმიტომ გაკეთდა, რომ არ გამხდარიყო საჭირო პარადიგმების მწკრივის ცხრილის დარეგისტრირება DataType-ებში
  //თუ მომავალში ამ ორი უფლების გამიჯვნა გახდა საჭირო, მოგვიწევს DataType-ებში დავარეგისტრიროთ პარადიგმების მწკრივის ცხრილი
  const dataType = dataTypes.find((f) => f.dtTable === "verbParadigms");

  //თუ იდენტიფიკატორი წესიერია და ჩატვირთული ობიექტი ჯერ არ არის, ან საჭირო ცხრილები ჩატვირთული არ არის
  if (
    (curFormulaIdVal && !verbParadigmFormulaForEdit) ||
    !morphemeRanges ||
    !morphemesQuery ||
    !inflectionBlocks ||
    !inflectionTypes ||
    !morphemeRangesByInflectionBlocks ||
    !verbParadigms ||
    !verbTypes ||
    !verbRows ||
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

  //console.log("VerbRowParadigmFormulaEdit frm=", frm);

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
    ) as VerbParadigmFormulaFormData;

    if (curFormulaIdVal) updateVerbParadigmFormula(currentForm);
    else createVerbParadigmFormula(currentForm);
    clearUsedTables();
  }

  const verbPersonMarkerParadigmsSorted = verbPersonMarkerParadigms
    .slice()
    .sort((a, b) => a.sortId - b.sortId);

  return (
    <Row>
      <Col md="6">
        <AlertMessages alertKind={EAlertKind.ClientRunTime} />
        <Form onSubmit={handleSubmit}>
          <EditorHeader
            curIdVal={curFormulaIdVal}
            EditorName="ზმნის მწკრივის პარადიგმის ფორმულა"
            EditorNameGenitive="ზმნის მწკრივის პარადიგმის ფორმულის"
            EditedObjectName={
              frm &&
              frm.verbParadigmFormula &&
              frm.verbParadigmFormula.vprSample
                ? frm.verbParadigmFormula.vprSample
                : ""
            }
            workingOnDelete={deletingVerbParadigmFormula}
            DeleteFailure={DeleteFailure}
            onDelete={() => {
              if (!!curFormulaIdVal) deleteVerbParadigmFormula(curFormulaIdVal);
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
            controlId="verbParadigmFormula.verbParadigmId"
            label="პარადიგმა"
            value={frm.verbParadigmFormula.verbParadigmId}
            dataMember={verbParadigms.map((m) => {
              return { id: m.vpnId, name: `${m.vpnKey} - ${m.vpnName}` };
            })}
            valueMember="id"
            displayMember="name"
            getError={getError}
            onChangeValue={changeField}
            firstItem={{ id: 0, name: "აირჩიეთ პარადიგმა" }}
          />
          <OneComboBoxControl
            controlId="verbParadigmFormula.verbTypeId"
            label="ზმნის ტიპი"
            value={frm.verbParadigmFormula.verbTypeId}
            dataMember={verbTypes}
            valueMember="vtpId"
            displayMember="vtpName"
            getError={getError}
            onChangeValue={changeField}
            firstItem={{ id: 0, name: "აირჩიეთ ზმნის ტიპი" }}
          />
          <OneComboBoxControl
            controlId="verbParadigmFormula.verbRowId"
            label="მწკრივი"
            value={frm.verbParadigmFormula.verbRowId}
            dataMember={verbRows}
            valueMember="vrwId"
            displayMember="vrwName"
            getError={getError}
            onChangeValue={changeField}
            firstItem={{ id: 0, name: "აირჩიეთ მწკრივი" }}
          />
          <OneComboBoxControl
            controlId="verbParadigmFormula.verbPersonMarkerParadigmId"
            label="პირის ნიშნების პარადიგმა"
            value={frm.verbParadigmFormula.verbPersonMarkerParadigmId}
            dataMember={verbPersonMarkerParadigmsSorted}
            valueMember="vpmpnId"
            displayMember="vpmpnKey"
            getError={getError}
            onChangeValue={changeField}
            sortByDisplayMember={false}
            firstItem={{ id: 0, name: "აირჩიეთ პირის ნიშნების პარადიგმა" }}
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
                  ) as VerbParadigmFormulaFormData;
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
              creatingVerbParadigmFormula || updatingVerbParadigmFormula
            }
            onCloseClick={() => {
              dispatch(clearAllAlerts());
              navigate(
                `/verbParadigmFormulas/${frm.verbParadigmFormula.verbParadigmId}/${curFormulaIdVal}`
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

export default VerbRowParadigmFormulaEdit;
