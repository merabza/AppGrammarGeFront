//NounParadigmFormulaEdit.tsx

import { useState, useEffect, useCallback, useMemo, FC } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { getFormulaVisual2 } from "./FormulasModule";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import {
  GrammarCase,
  InflectionBlock,
  InflectionType,
  Morpheme,
  MorphemeRange,
  MorphemeRangeByInflectionBlock,
  NounNumber,
  NounParadigm,
} from "../masterData/mdTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useForman } from "../appcarcass/hooks/useForman";
import { useClearTablesFromRepo } from "../appcarcass/masterdata/masterDataHooks/useClearTablesFromRepo";
import { clearNounParadigmFormulas } from "../redux/slices/modelDataSlice";
import {
  NounParadigmFormulaFormData,
  NounParadigmFormulaFormDataSchema,
} from "./NounParadigmFormulaData";
import { createFormulaFormData } from "../derivationTreeEditor/FormulasModule";
import { useNavigate, useParams } from "react-router-dom";
import { NzInt } from "../appcarcass/common/myFunctions";
import {
  useCreateNounParadigmFormulaMutation,
  useDeleteNounParadigmFormulaMutation,
  useLazyGetOneNounParadigmFormulaByIdQuery,
  useUpdateNounParadigmFormulaMutation,
} from "../redux/api/nounParadigmFormulasCrudApi";
import WaitPage from "../appcarcass/common/WaitPage";
import AlertMessages from "../appcarcass/common/AlertMessages";
import {
  EAlertKind,
  clearAllAlerts,
} from "../appcarcass/redux/slices/alertSlice";
import EditorHeader from "../appcarcass/editorParts/EditorHeader";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import OnePlaintextRow from "../appcarcass/editorParts/OnePlaintextRow";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import OneNumberControl from "../appcarcass/editorParts/OneNumberControl";
import OneTextControl from "../appcarcass/editorParts/OneTextControl";
import OneSaveCancelButtons from "../appcarcass/editorParts/OneSaveCancelButtons";
import OneErrorRow from "../appcarcass/editorParts/OneErrorRow";
import { useAlert } from "../appcarcass/hooks/useAlert";

const NounParadigmFormulaEdit: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //1. იდენტიფიკატორი
  const [curFormulaIdVal, setCurFormulaIdVal] = useState<number | undefined>(
    undefined
  );
  const [paradigmIdsForClear, setParadigmIdsForClear] = useState<number[]>(
    [] as number[]
  );

  const [formDataPrepared, setFormDataPrepared] = useState(false);
  const [clearTables] = useClearTablesFromRepo();

  const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
    useAppSelector((state) => state.masterDataState);

  const morphemeRanges = mdataRepo.morphemeRanges as MorphemeRange[];
  const morphemesQuery = mdataRepo.morphemesQuery as Morpheme[];
  const inflectionBlocks = mdataRepo.inflectionBlocks as InflectionBlock[];
  const inflectionTypes = mdataRepo.inflectionTypes as InflectionType[];
  const nounParadigms = mdataRepo.nounParadigms as NounParadigm[];
  const grammarCases = mdataRepo.grammarCases as GrammarCase[];
  const nounNumbers = mdataRepo.nounNumbers as NounNumber[];
  const morphemeRangesByInflectionBlocks =
    mdataRepo.morphemeRangesByInflectionBlocks as MorphemeRangeByInflectionBlock[];

  const [morphemes, setMorphemes] = useState<number[]>([] as number[]);
  const [ranges, setRanges] = useState<MorphemeRange[]>([] as MorphemeRange[]);

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const [
    getOneNounParadigmFormulaById,
    { isLoading: loadingNounParadigmFormula },
  ] = useLazyGetOneNounParadigmFormulaByIdQuery();

  const { nounParadigmFormulaForEdit } = useAppSelector(
    (state) => state.nounParadigmFormulasCrudState
  );

  const [
    createNounParadigmFormula,
    { isLoading: creatingNounParadigmFormula },
  ] = useCreateNounParadigmFormulaMutation();
  const [
    updateNounParadigmFormula,
    { isLoading: updatingNounParadigmFormula },
  ] = useUpdateNounParadigmFormulaMutation();
  const [
    deleteNounParadigmFormula,
    { isLoading: deletingNounParadigmFormula, isError: DeleteFailure },
  ] = useDeleteNounParadigmFormulaMutation();

  //3. ეს არის ის ცხრილები, რომელზეც მოქმედებს ეს კონკრეტული რედაქტორი
  const tableNamesForClear = useMemo(() => ["NounParadigmRows"], []);

  //4. ეს არის ის ცხრილები, რომლებიდანაც ინფორმაცია სჭირდება ამ რედაქტრს
  const tableNamesForLoad = useMemo(
    () => [
      "morphemeRanges",
      "morphemesQuery",
      "inflectionBlocks",
      "inflectionTypes",
      "morphemeRangesByInflectionBlocks",
      "nounParadigms",
      "grammarCases",
      "nounNumbers",
    ],
    []
  );

  const [checkLoadMdTables] = useCheckLoadMdTables();

  useEffect(() => {
    checkLoadMdTables(tableNamesForLoad);
  }, [tableNamesForLoad]);

  //console.log("NounParadigmFormulaEdit yupSchema=", yupSchema);

  //6. ფორმის მენეჯერი
  const [
    frm,
    changeField,
    getError,
    getAllErrors,
    clearToDefaults,
    setFormData,
  ] = useForman<
    typeof NounParadigmFormulaFormDataSchema,
    NounParadigmFormulaFormData
  >(NounParadigmFormulaFormDataSchema);

  function clearUsedTables() {
    clearTables(tableNamesForClear, tableNamesForLoad);
    dispatch(clearNounParadigmFormulas(paradigmIdsForClear));
  }

  const copyMorphemsToMainData = useCallback(
    (forForm: NounParadigmFormulaFormData, morphemes: number[]) => {
      const newForm = JSON.parse(
        JSON.stringify(forForm)
      ) as NounParadigmFormulaFormData;

      //console.log("NounParadigmFormulaEdit copyMorphemsToMainData forForm=", forForm);
      //console.log("NounParadigmFormulaEdit copyMorphemsToMainData newForm=", newForm);

      newForm.morphemeIds = morphemes
        .map((mrpId) => {
          return mrpId ? morphemesQuery.find((f) => f.mrpId === mrpId) : null;
        })
        .filter((f): f is Morpheme => !!f && !!f.mrpNom)
        .map((m) => m.mrpId);
      //გავუგზავნოთ ახალი ფორმა ფორმის მენეჯერს.
      setFormData(newForm);
    },
    [morphemesQuery]
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
    (forForm: NounParadigmFormulaFormData | null) => {
      const newForm = forForm
        ? forForm
        : (JSON.parse(JSON.stringify(frm)) as NounParadigmFormulaFormData);

      //მოვძებნოთ ფლექსიის ბლოკის შესაბამისი ობიექტი
      const inflectionBlock = inflectionBlocks.find(
        (f) => f.inbKey === "NounRowsBlock"
      );

      if (!inflectionBlock) return;
      // console.log(
      //   "NounParadigmFormulaEdit prepareFormDataForEdit inflectionBlock=",
      //   inflectionBlock
      // );
      // console.log(
      //   "NounParadigmFormulaEdit prepareFormDataForEdit inflectionTypes=",
      //   inflectionTypes
      // );

      //ფლექსიის ტიპის პოვნას აზრი აქვს მხოლოდ იმ შემთხვევაში, თუ ფლექსიის ტიპების ცხრილი ჩატვირთულია
      //მოვძებნოთ ფლექსიის ტიპის შესაბამისი ობიექტი
      const inflectionType = inflectionTypes.find(
        (f) => f.iftId === inflectionBlock.inflectionTypeId
      );

      // console.log(
      //   "NounParadigmFormulaEdit prepareFormDataForEdit inflectionType=",
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
      //   "NounParadigmFormulaEdit prepareFormDataForEdit formulaFormDataType=",
      //   formulaFormDataType
      // );
      setMorphemes(formulaFormDataType.morphemes);
      setRanges(formulaFormDataType.ranges);

      //გავუგზავნოთ ახალი ფორმა ფორმის მენეჯერს.
      // console.log(
      //   "NounParadigmFormulaEdit prepareFormDataForEdit newForm=",
      //   newForm
      // );
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
      // console.log(
      //   "setCurFormulaIdVal(formulaIdVal); formulaIdVal=",
      //   formulaIdVal
      // );
      setCurFormulaIdVal(formulaIdVal);
      setFormDataPrepared(false);
      setParadigmIdsForClear([]);
      if (formulaIdVal) {
        //თუ იდენტიფიკატორი კარგია, ჩავტვირთოთ ბაზიდან ინფორმაცია
        getOneNounParadigmFormulaById(formulaIdVal);
        return;
      }
      //ახალი სარედაქტირებელი ობიექტის შექმნა
      clearToDefaults();
      //console.log("NounParadigmFormulaEdit useEffect after clearToDefaults frm=", frm);
    }

    //თუ საჭირო ინფორმაცია ჯერ ჩატვირთული არ არის, მაშIნ გაგრეძელებას აზრი არ აქვს
    if (
      mdWorkingOnLoad ||
      Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
      !morphemesQuery ||
      !nounParadigms
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
      if (loadingNounParadigmFormula || !nounParadigmFormulaForEdit) return;
      addForClearParadigmId(
        nounParadigmFormulaForEdit.nounParadigmFormula.nounParadigmId
      );
      if (!formDataPrepared) {
        setFormDataPrepared(true);
        prepareFormDataForEdit(nounParadigmFormulaForEdit);
      }
    } else {
      if (!formDataPrepared) {
        setFormDataPrepared(true);
        prepareFormDataForEdit(null);
      }
    }
  }, [
    morphemesQuery,
    nounParadigms,
    curFormulaIdVal,
    loadingNounParadigmFormula,
    mdWorkingOnLoad,
    mdWorkingOnLoadingTables,
    nounParadigmFormulaForEdit,
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
  if (
    loadingNounParadigmFormula ||
    mdWorkingOnLoad ||
    Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s)
  )
    //თუ ინფორმაციის ჩატვირთვა ჯერ კიდევ მიმდინარეობა
    return <WaitPage />;

  //აქ ითვლება, რომ თუ პარადიგმის სახელების დარედაქტირების უფლება აქვს მომხმარებელს
  //მაშინ პარადიგმებზეც უნდა ჰქონდეს.
  //ასე იმიტომ გაკეთდა, რომ არ გამხდარიყო საჭირო პარადიგმების მწკრივის ცხრილის დარეგისტრირება DataType-ებში
  //თუ მომავალში ამ ორი უფლების გამიჯვნა გახდა საჭირო, მოგვიწევს DataType-ებში დავარეგისტრიროთ პარადიგმების მწკრივის ცხრილი
  const dataType = dataTypes.find((f) => f.dtTable === "nounParadigms");

  //თუ იდენტიფიკატორი წესიერია და ჩატვირთული ობიექტი ჯერ არ არის, ან საჭირო ცხრილები ჩატვირთული არ არის
  if (
    (curFormulaIdVal && !nounParadigmFormulaForEdit) ||
    !morphemeRanges ||
    !morphemesQuery ||
    !inflectionBlocks ||
    !inflectionTypes ||
    !morphemeRangesByInflectionBlocks ||
    !nounParadigms ||
    !grammarCases ||
    !nounNumbers ||
    !dataType
  ) {
    return (
      <div>
        <h5>ინფორმაციის ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  //console.log("NounParadigmFormulaEdit frm=", frm);

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
    ) as NounParadigmFormulaFormData;

    if (curFormulaIdVal)
      updateNounParadigmFormula({
        nounParadigmFormulaFormData: currentForm,
        navigate,
      });
    else
      createNounParadigmFormula({
        nounParadigmFormulaFormData: currentForm,
        navigate,
      });
    clearUsedTables();
  }

  return (
    <Row>
      <Col md="6">
        <AlertMessages alertKind={EAlertKind.ClientRunTime} />
        <Form onSubmit={handleSubmit}>
          <EditorHeader
            curIdVal={curFormulaIdVal}
            EditorName="სახელის პარადიგმის ფორმულა"
            EditorNameGenitive="სახელის პარადიგმის ფორმულის"
            EditedObjectName={
              frm &&
              frm.nounParadigmFormula &&
              frm.nounParadigmFormula.nprSample
                ? frm.nounParadigmFormula.nprSample
                : ""
            }
            workingOnDelete={deletingNounParadigmFormula}
            DeleteFailure={DeleteFailure}
            onDelete={() => {
              // console.log("onDelete curFormulaIdVal=", curFormulaIdVal);
              if (!!curFormulaIdVal)
                deleteNounParadigmFormula({ nprId: curFormulaIdVal, navigate });
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
            controlId="nounParadigmFormula.nounParadigmId"
            label="პარადიგმა"
            value={frm.nounParadigmFormula.nounParadigmId}
            dataMember={nounParadigms}
            valueMember="npnId"
            displayMember="npnName"
            getError={getError}
            onChangeValue={changeField}
            firstItem={{ id: 0, name: "აირჩიეთ პარადიგმა" }}
          />
          <OneNumberControl
            controlId="nounParadigmFormula.nprOrderInParadigm"
            label="რიგითი ნომერი"
            value={frm.nounParadigmFormula.nprOrderInParadigm + 1}
            getError={getError}
            onChangeValue={(id, value) => {
              changeField(id, value - 1);
            }}
          />
          <OneComboBoxControl
            controlId="nounParadigmFormula.grammarCaseId"
            label="ბრუნვა"
            value={frm.nounParadigmFormula.grammarCaseId}
            dataMember={grammarCases}
            valueMember="grcId"
            displayMember="grcName"
            getError={getError}
            onChangeValue={changeField}
            firstItem={{ id: 0, name: "აირჩიეთ ბრუნვა" }}
          />
          <OneComboBoxControl
            controlId="nounParadigmFormula.nounNumberId"
            label="რიცხვი"
            value={frm.nounParadigmFormula.nounNumberId}
            dataMember={nounNumbers}
            valueMember="nnnId"
            displayMember="nnnName"
            getError={getError}
            onChangeValue={changeField}
            firstItem={{ id: 0, name: "აირჩიეთ რიცხვი" }}
          />
          <OneTextControl
            controlId="nounParadigmFormula.nprSample"
            label="ნიმუში"
            value={frm.nounParadigmFormula.nprSample}
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
                  ) as NounParadigmFormulaFormData;
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
              creatingNounParadigmFormula || updatingNounParadigmFormula
            }
            onCloseClick={() => {
              dispatch(clearAllAlerts());
              if (frm.nounParadigmFormula.nounParadigmId === 0) navigate(-1);
              navigate(
                `/nounParadigmFormulas/${frm.nounParadigmFormula.nounParadigmId}/${curFormulaIdVal}`
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

export default NounParadigmFormulaEdit;
