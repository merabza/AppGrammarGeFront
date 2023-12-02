//CreateForRecountVerbPersonMarkers.tsx

import { useEffect, useMemo, useCallback, FC } from "react";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import {
  ActantGrammarCase,
  ActantGroup,
  ActantPosition,
  ActantType,
  DominantActant,
  Morpheme,
  VerbNumber,
  VerbPerson,
  VerbPluralityType,
  VerbSeries,
  VerbTransition,
  VerbType,
} from "../masterData/mdTypes";
import { VerbPersonMarkerParadigm } from "../redux/types/formulasTypes";
import { useLocation, useParams } from "react-router-dom";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import { useCheckLoadFilteredForRecountVerbPersonMarkers } from "./useCheckLoadFilteredForRecountVerbPersonMarkers";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import NameListEditor from "../modelOverview/NameListEditor";
import MdGridView from "../appcarcass/masterdata/MdGridView";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";

const CreateForRecountVerbPersonMarkers: FC = () => {
  // const {
  //   alert,
  //   isMenuLoading,
  //   flatMenu,
  //   masterData,
  //   loadingForRecountVerbPersonMarkers,
  //   forRecountVerbPersonMarkers,
  //   loadMultipleListData,
  //   getFilteredForRecountVerbPersonMarkers,
  // } = props;

  const dispatch = useAppDispatch();

  const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
    useAppSelector((state) => state.masterDataState);

  const { forRecountVerbPersonMarkers } = useAppSelector(
    (state) => state.filteredState
  );

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const masterData = useAppSelector((state) => state.masterDataState);

  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const actantTypes = mdataRepo.actantTypes as ActantType[];
  const verbSeries = mdataRepo.verbSeries as VerbSeries[];
  const actantGrammarCases =
    mdataRepo.actantGrammarCases as ActantGrammarCase[];
  const actantGroups = mdataRepo.actantGroups as ActantGroup[];
  const verbTypes = mdataRepo.verbTypes as VerbType[];
  const verbTransitions = mdataRepo.verbTransitions as VerbTransition[];
  const actantPositions = mdataRepo.actantPositions as ActantPosition[];
  const verbPluralityTypes =
    mdataRepo.verbPluralityTypes as VerbPluralityType[];
  const verbPersonMarkerParadigms =
    mdataRepo.verbPersonMarkerParadigms as VerbPersonMarkerParadigm[];
  const verbNumbers = mdataRepo.verbNumbers as VerbNumber[];
  const verbPersons = mdataRepo.verbPersons as VerbPerson[];
  // const dominantActantsQuery =
  //   mdataRepo.dominantActantsQuery as DominantActant[];
  // const morphemesQuery = mdataRepo.morphemesQuery as Morpheme[];

  //console.log("CreateForRecountVerbPersonMarkers props=", props);

  const menLinkKey = useLocation().pathname.split("/")[1];

  const tableNamesForLoad = useMemo(
    () => [
      "actantTypes",
      "verbSeries",
      "actantGrammarCases",
      "actantGroups",
      "verbTypes",
      "verbTransitions",
      "actantPositions",
      "verbPluralityTypes",
      "verbPersonMarkerParadigms",
      "verbNumbers",
      "verbPersons",
      // "dominantActantsQuery",
      // "morphemesQuery",
    ],
    []
  );

  const { isMenuLoading, flatMenu } = useAppSelector(
    (state) => state.navMenuState
  );

  const isValidPage = useCallback(() => {
    if (!flatMenu) {
      return false;
    }
    return flatMenu.find((f) => f.menLinkKey === menLinkKey);
  }, [flatMenu, menLinkKey]);

  const [checkLoadMdTables] = useCheckLoadMdTables();

  useEffect(() => {
    const menuItem = isValidPage();
    if (!menuItem) return;

    checkLoadMdTables(tableNamesForLoad);
  }, [isMenuLoading, flatMenu, tableNamesForLoad]);

  const [
    checkLoadFilteredForRecountVerbPersonMarkers,
    LoadingFilteredForRecountVerbPersonMarkers,
  ] = useCheckLoadFilteredForRecountVerbPersonMarkers();

  useEffect(() => {
    checkLoadFilteredForRecountVerbPersonMarkers(1);
  }, []);

  const { tabKey, recId, recName } = useParams<string>();

  const recIdNumber = NzInt(recId);

  const [curscrollTo, backLigth] = useScroller<{
    tabKey: string | undefined;
    recId: number;
    recName: string | undefined;
  }>({
    tabKey,
    recId: recIdNumber,
    recName,
  });

  function funSaveReturnPageName() {
    dispatch(saveReturnPageName(menLinkKey));
  }

  if (
    mdWorkingOnLoad ||
    LoadingFilteredForRecountVerbPersonMarkers ||
    isMenuLoading ||
    Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s)
  ) {
    return <Loading />;
  }

  // console.log("CreateForRecountVerbPersonMarkers LoadCheck ", {
  //   curscrollTo,
  //   actantTypes,
  //   verbSeries,
  //   actantGrammarCases,
  //   actantGroups,
  //   verbTypes,
  //   verbTransitions,
  //   actantPositions,
  //   verbPluralityTypes,
  //   verbPersonMarkerParadigms,
  //   verbNumbers,
  //   verbPersons,
  //   dataTypes,
  //   forRecountVerbPersonMarkers,
  // });

  if (
    !curscrollTo ||
    !actantTypes ||
    !verbSeries ||
    !actantGrammarCases ||
    !actantGroups ||
    !verbTypes ||
    !verbTransitions ||
    !actantPositions ||
    !verbPluralityTypes ||
    !verbPersonMarkerParadigms ||
    !verbNumbers ||
    !verbPersons ||
    // !dominantActantsQuery ||
    // !morphemesQuery ||
    !dataTypes ||
    !forRecountVerbPersonMarkers
  ) {
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  // const actantGroupsDict = {} as { [key: number]: ActantGroup };

  // actantGroups.forEach((element) => {
  //   actantGroupsDict[element.agrId] = element;
  // });

  // const actantPositionsDict = {} as { [key: number]: ActantPosition };

  // actantPositions.forEach((element) => {
  //   actantPositionsDict[element.apnId] = element;
  // });

  // const actantTypesDict = {} as { [key: number]: ActantType };

  // actantTypes.forEach((element) => {
  //   actantTypesDict[element.attId] = element;
  // });

  // const verbNumbersDict = {} as { [key: number]: VerbNumber };

  // verbNumbers.forEach((element) => {
  //   verbNumbersDict[element.vnmId] = element;
  // });

  // const verbPluralityTypesDict = {} as { [key: number]: VerbPluralityType };

  // verbPluralityTypes.forEach((element) => {
  //   verbPluralityTypesDict[element.vptId] = element;
  // });

  // const verbPersonsDict = {} as { [key: number]: VerbPerson };

  // verbPersons.forEach((element) => {
  //   verbPersonsDict[element.vprId] = element;
  // });

  // const verbPersonMarkerParadigmsDict = {} as {
  //   [key: number]: VerbPersonMarkerParadigm;
  // };

  // verbPersonMarkerParadigms.forEach((element) => {
  //   verbPersonMarkerParadigmsDict[element.vpmpnId] = element;
  // });

  // const verbSeriesDict = {} as { [key: number]: VerbSeries };

  // verbSeries.forEach((element) => {
  //   verbSeriesDict[element.vsrId] = element;
  // });

  // const verbTypesDict = {} as { [key: number]: VerbType };

  // verbTypes.forEach((element) => {
  //   verbTypesDict[element.vtpId] = element;
  // });

  const listEditorTableNames = [
    "actantGrammarCases",
    "actantPositions",
    "actantTypes",
    "actantGroups",
    "verbTransitions",
    "verbPluralityTypes",
    "verbPersons",
    "verbNumbers",
    "verbTypes",
    "verbPersonMarkerParadigms",
    "verbSeries",
  ];

  return (
    <div>
      <h3>პირის ნიშნების ფორმულების დათვლის პირველი ფაზა</h3>
      <h4>ტერმინები</h4>
      <p>
        <strong>აქტანტის ბრუნვა</strong> - აქტანტის ბრუნვის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>აქტანტის პოზიცია</strong> - აქტანტის პოზიციის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>აქტანტის ტიპი</strong> - აქტანტის ტიპის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>აქტანტის ჯგუფი</strong> - აქტანტის ჯგუფის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>გარდამავლობა</strong> - გარდამავლობის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>ზმნის მრავლობითობის ტიპი</strong> - ზმნის მრავლობითობის ტიპის
        განმარტება (გასაკეთებელია).
      </p>
      <p>
        <strong>ზმნის პირი</strong> - ზმნის პირის განმარტება (გასაკეთებელია).
      </p>
      <p>
        <strong>ზმნის რიცხვი</strong> - ზმნის რიცხვის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>ზმნის ტიპი</strong> - ზმნის ტიპის განმარტება (გასაკეთებელია).
      </p>
      <p>
        <strong>ზმნის ცალი პირის ნიშნების პარადიგმა</strong> - ზმნის ცალი პირის
        ნიშნების პარადიგმის განმარტება (გასაკეთებელია).
      </p>
      <p>
        <strong>სერია</strong> - სერიის განმარტება (გასაკეთებელია).
      </p>

      {listEditorTableNames.map((tn) => {
        const dataType = dataTypes.find((f) => f.dtTable === tn);
        if (dataType) {
          return (
            <NameListEditor
              key={dataType.dtName}
              dataType={dataType}
              tableForEdit={masterData.mdataRepo[tn]}
              curscrollTo={curscrollTo}
              backLigth={backLigth}
              saveReturnPageName={funSaveReturnPageName}
            />
          );
        }
        return <></>;
      })}

      <MdGridView tableName="actantGrammarCasesByActantTypes" />
      <MdGridView tableName="actantTypesByVerbTypes" />
      <MdGridView tableName="pluralityChangesByVerbTypes" />
      <MdGridView tableName="verbPersonMarkerParadigmChanges" />
      <MdGridView tableName="verbPluralityTypeChanges" />

      <h4>პროცესის აღწერა</h4>
      <p>
        რთული გამოთვლებით ხდება შემდეგი კომბინაციების დაანგარიშება: პირების
        კომბინაციის იდენტიფიკატორი, დომინანტი აქტანტი, მორფემა
      </p>

      <MdGridView tableName="forRecountVerbPersonMarkers" readOnly />
    </div>
  );
};

export default CreateForRecountVerbPersonMarkers;
