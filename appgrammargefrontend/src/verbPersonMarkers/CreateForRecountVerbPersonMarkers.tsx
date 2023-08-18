//CreateForRecountVerbPersonMarkers.tsx

import { useEffect, useMemo, useCallback, FC } from "react";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import {
  ActantGrammarCase,
  ActantGrammarCasesByActantType,
  ActantGroup,
  ActantPosition,
  ActantType,
  ActantTypesByVerbType,
  DominantActant,
  Morpheme,
  PluralityChangesByVerbType,
  VerbNumber,
  VerbPerson,
  VerbPersonMarkerParadigmChange,
  VerbPluralityType,
  VerbPluralityTypeChange,
  VerbSeries,
  VerbTransition,
  VerbType,
} from "../masterData/mdTypes";
import { VerbPersonMarkerParadigm } from "../redux/types/formulasTypes";
import { useLocation, useParams } from "react-router-dom";
import { useCheckLoadMultipleListData } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMultipleListData";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import { useCheckLoadFilteredForRecountVerbPersonMarkers } from "./useCheckLoadFilteredForRecountVerbPersonMarkers";
import {
  checkDataTableLoaded,
  checkDataTypeLoaded,
  checkGridLoaded,
} from "../appcarcass/modules/CheckDataLoaded";
import {
  DeserializeGridModel,
  GridModel,
} from "../appcarcass/redux/types/gridTypes";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import NameListEditor from "../modelOverview/NameListEditor";
import MdListView from "../appcarcass/masterdata/MdListView";

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

  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );

  const { forRecountVerbPersonMarkers } = useAppSelector(
    (state) => state.filteredState
  );

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const masterData = useAppSelector((state) => state.masterDataState);

  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const actantGrammarCasesByActantTypes =
    mdRepo.actantGrammarCasesByActantTypes as ActantGrammarCasesByActantType[];
  const actantTypesByVerbTypes =
    mdRepo.actantTypesByVerbTypes as ActantTypesByVerbType[];
  const pluralityChangesByVerbTypes =
    mdRepo.pluralityChangesByVerbTypes as PluralityChangesByVerbType[];
  const verbPersonMarkerParadigmChanges =
    mdRepo.verbPersonMarkerParadigmChanges as VerbPersonMarkerParadigmChange[];
  const verbPluralityTypeChanges =
    mdRepo.verbPluralityTypeChanges as VerbPluralityTypeChange[];
  const actantTypes = mdRepo.actantTypes as ActantType[];
  const verbSeries = mdRepo.verbSeries as VerbSeries[];
  const actantGrammarCases = mdRepo.actantGrammarCases as ActantGrammarCase[];
  const actantGroups = mdRepo.actantGroups as ActantGroup[];
  const verbTypes = mdRepo.verbTypes as VerbType[];
  const verbTransitions = mdRepo.verbTransitions as VerbTransition[];
  const actantPositions = mdRepo.actantPositions as ActantPosition[];
  const verbPluralityTypes = mdRepo.verbPluralityTypes as VerbPluralityType[];
  const verbPersonMarkerParadigms =
    mdRepo.verbPersonMarkerParadigms as VerbPersonMarkerParadigm[];
  const verbNumbers = mdRepo.verbNumbers as VerbNumber[];
  const verbPersons = mdRepo.verbPersons as VerbPerson[];
  const dominantActantsQuery = mdRepo.dominantActantsQuery as DominantActant[];
  const morphemesQuery = mdRepo.morphemesQuery as Morpheme[];

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
      "dominantActantsQuery",
      "morphemesQuery",
      "actantGrammarCasesByActantTypes",
      "actantTypesByVerbTypes",
      "pluralityChangesByVerbTypes",
      "verbPersonMarkerParadigmChanges",
      "verbPluralityTypeChanges",
    ],
    []
  );

  const listTableNames = useMemo(
    () => [
      "actantGrammarCasesByActantTypes",
      "actantTypesByVerbTypes",
      "pluralityChangesByVerbTypes",
      "verbPersonMarkerParadigmChanges",
      "verbPluralityTypeChanges",
    ],
    []
  );

  const onlygridRuleNames = useMemo(() => ["forRecountVerbPersonMarkers"], []);

  const gridRuleNames = useMemo(
    () => listTableNames.concat(onlygridRuleNames),
    [listTableNames, onlygridRuleNames]
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

  const [loadMultipleListData] = useCheckLoadMultipleListData();

  useEffect(() => {
    const menuItem = isValidPage();
    if (!menuItem) return;

    loadMultipleListData(gridRuleNames, listTableNames, tableNamesForLoad);
  }, [
    isMenuLoading,
    flatMenu,
    listTableNames,
    tableNamesForLoad,
    gridRuleNames,
  ]);

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

  const checkedDataTypes = {} as { [key: string]: DataTypeFfModel };

  let allDataTypesLoaded = true;
  gridRuleNames.forEach((listTableName) => {
    const checkResult = checkDataTypeLoaded(
      masterData,
      dataTypesState,
      listTableName
    );
    if (checkResult) {
      checkedDataTypes[listTableName] = checkResult;
    } else allDataTypesLoaded = false;
  });

  let allListTablessLoaded = true;
  listTableNames.forEach((listTableName) => {
    const checkResult = checkDataTableLoaded(masterData, listTableName);
    if (!checkResult) allListTablessLoaded = false;
  });

  const GridRules = {} as { [key: string]: GridModel };

  let allGridsLoaded = true;
  gridRuleNames.forEach((gridRuleName) => {
    const checkResult = checkGridLoaded(
      masterData,
      dataTypesState,
      gridRuleName
    );
    if (checkResult) {
      const grid = DeserializeGridModel(checkResult);
      if (grid) GridRules[gridRuleName] = grid;
    } else allGridsLoaded = false;
  });

  if (
    mdWorkingOnLoad ||
    LoadingFilteredForRecountVerbPersonMarkers ||
    isMenuLoading ||
    mdWorkingOnLoadingTables
  ) {
    return <Loading />;
  }

  if (
    !allDataTypesLoaded ||
    !allListTablessLoaded ||
    !allGridsLoaded ||
    !curscrollTo ||
    !actantGrammarCasesByActantTypes ||
    !actantTypesByVerbTypes ||
    !pluralityChangesByVerbTypes ||
    !verbPersonMarkerParadigmChanges ||
    !verbPluralityTypeChanges ||
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
    !dominantActantsQuery ||
    !morphemesQuery ||
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

  const actantGroupsDict = {} as { [key: number]: ActantGroup };

  actantGroups.forEach((element) => {
    actantGroupsDict[element.agrId] = element;
  });

  const actantPositionsDict = {} as { [key: number]: ActantPosition };

  actantPositions.forEach((element) => {
    actantPositionsDict[element.apnId] = element;
  });

  const actantTypesDict = {} as { [key: number]: ActantType };

  actantTypes.forEach((element) => {
    actantTypesDict[element.attId] = element;
  });

  const verbNumbersDict = {} as { [key: number]: VerbNumber };

  verbNumbers.forEach((element) => {
    verbNumbersDict[element.vnmId] = element;
  });

  const verbPluralityTypesDict = {} as { [key: number]: VerbPluralityType };

  verbPluralityTypes.forEach((element) => {
    verbPluralityTypesDict[element.vptId] = element;
  });

  const verbPersonsDict = {} as { [key: number]: VerbPerson };

  verbPersons.forEach((element) => {
    verbPersonsDict[element.vprId] = element;
  });

  const verbPersonMarkerParadigmsDict = {} as {
    [key: number]: VerbPersonMarkerParadigm;
  };

  verbPersonMarkerParadigms.forEach((element) => {
    verbPersonMarkerParadigmsDict[element.vpmpnId] = element;
  });

  const verbSeriesDict = {} as { [key: number]: VerbSeries };

  verbSeries.forEach((element) => {
    verbSeriesDict[element.vsrId] = element;
  });

  const verbTypesDict = {} as { [key: number]: VerbType };

  verbTypes.forEach((element) => {
    verbTypesDict[element.vtpId] = element;
  });

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
              tableForEdit={masterData.mdRepo[tn]}
              curscrollTo={curscrollTo}
              backLigth={backLigth}
              saveReturnPageName={funSaveReturnPageName}
            />
          );
        }
        return <></>;
      })}

      <MdListView
        dataType={checkedDataTypes["actantGrammarCasesByActantTypes"]}
        table={actantGrammarCasesByActantTypes.slice().sort((a, b) => {
          const f =
            actantTypesDict[a.actantTypeId].sortId -
            actantTypesDict[b.actantTypeId].sortId;
          if (f) return f;
          return (
            verbSeriesDict[a.verbSeriesId].sortId -
            verbSeriesDict[b.verbSeriesId].sortId
          );
        })}
        gridColumns={GridRules["actantGrammarCasesByActantTypes"].cells}
        masterData={masterData}
        curscrollTo={curscrollTo.recId}
        backLigth={backLigth}
      />

      <MdListView
        dataType={checkedDataTypes["actantTypesByVerbTypes"]}
        table={actantTypesByVerbTypes.slice().sort((a, b) => {
          const f =
            verbTypesDict[a.verbTypeId].sortId -
            verbTypesDict[b.verbTypeId].sortId;
          if (f) return f;
          return (
            actantPositionsDict[a.actantPositionId].sortId -
            actantPositionsDict[b.actantPositionId].sortId
          );
        })}
        gridColumns={GridRules["actantTypesByVerbTypes"].cells}
        masterData={masterData}
        curscrollTo={curscrollTo.recId}
        backLigth={backLigth}
      />

      <MdListView
        dataType={checkedDataTypes["pluralityChangesByVerbTypes"]}
        table={pluralityChangesByVerbTypes.slice().sort((a, b) => {
          let f =
            verbPluralityTypesDict[a.pluralityTypeIdStart].sortId -
            verbPluralityTypesDict[b.pluralityTypeIdStart].sortId;
          if (f) return f;
          f =
            verbTypesDict[a.verbTypeId].sortId -
            verbTypesDict[b.verbTypeId].sortId;
          if (f) return f;
          return (
            verbSeriesDict[a.verbSeriesId].sortId -
            verbSeriesDict[b.verbSeriesId].sortId
          );
        })}
        gridColumns={GridRules["pluralityChangesByVerbTypes"].cells}
        masterData={masterData}
        curscrollTo={curscrollTo.recId}
        backLigth={backLigth}
      />

      <MdListView
        dataType={checkedDataTypes["verbPersonMarkerParadigmChanges"]}
        table={verbPersonMarkerParadigmChanges.slice().sort((a, b) => {
          const f = actantGroupsDict[a.actantGroupId].agrKey.localeCompare(
            actantGroupsDict[b.actantGroupId].agrKey
          );
          if (f) return f;
          return (
            verbPersonMarkerParadigmsDict[a.verbPersonMarkerParadigmIdStart]
              .sortId -
            verbPersonMarkerParadigmsDict[b.verbPersonMarkerParadigmIdStart]
              .sortId
          );
        })}
        gridColumns={GridRules["verbPersonMarkerParadigmChanges"].cells}
        masterData={masterData}
        curscrollTo={curscrollTo.recId}
        backLigth={backLigth}
      />

      <MdListView
        dataType={checkedDataTypes["verbPluralityTypeChanges"]}
        table={verbPluralityTypeChanges.slice().sort((a, b) => {
          let f =
            verbPluralityTypesDict[a.pluralityTypeIdStart].sortId -
            verbPluralityTypesDict[b.pluralityTypeIdStart].sortId;
          if (f) return f;
          f = a.pluralityTypeDominantId - b.pluralityTypeDominantId;
          if (f) return f;
          f = actantGroupsDict[a.actantGroupId].agrKey.localeCompare(
            actantGroupsDict[b.actantGroupId].agrKey
          );
          if (f) return f;
          f =
            verbNumbersDict[a.verbNumberId].sortId -
            verbNumbersDict[b.verbNumberId].sortId;
          if (f) return f;
          f =
            verbPersonsDict[a.verbPersonId].sortId -
            verbPersonsDict[b.verbPersonId].sortId;
          if (f) return f;
          return (
            actantTypesDict[a.actantTypeId].sortId -
            actantTypesDict[b.actantTypeId].sortId
          );
        })}
        gridColumns={GridRules["verbPluralityTypeChanges"].cells}
        masterData={masterData}
        curscrollTo={curscrollTo.recId}
        backLigth={backLigth}
      />

      <h4>პროცესის აღწერა</h4>
      <p>
        რთული გამოთვლებით ხდება შემდეგი კომბინაციების დაანგარიშება: პირების
        კომბინაციის იდენტიფიკატორი, დომინანტი აქტანტი, მორფემა
      </p>

      {/* ეს ცხრილი ძალიან დიდია, ამიტომ საჭიროა ნაწილ ნაწილ ჩატვირთვის უზრუნველყოფა */}
      {/* თვითონ ფილტრის არჩევანიც ცალკე უნდა ჩაიტვირთოს */}
      <MdListView
        readOnly
        dataType={checkedDataTypes["forRecountVerbPersonMarkers"]}
        table={forRecountVerbPersonMarkers.slice().sort((a, b) => {
          const f =
            a.verbPersonMarkerCombinationId - b.verbPersonMarkerCombinationId;
          if (f) return f;
          return a.dominantActantId - b.dominantActantId;
        })}
        gridColumns={GridRules["forRecountVerbPersonMarkers"].cells}
        masterData={masterData}
        curscrollTo={curscrollTo.recId}
        backLigth={backLigth}
        firstFilter={{ verbPersonMarkerCombinationId: true }}
        filterChanged={(frm) => {
          //console.log("CreateForRecountVerbPersonMarkers filterChanged frm=", frm);
          checkLoadFilteredForRecountVerbPersonMarkers(
            frm.verbPersonMarkerCombinationId,
            frm.dominantActantId,
            frm.morphemeId
          );
        }}
      />
    </div>
  );
};

export default CreateForRecountVerbPersonMarkers;

// function mapStateToProps(state) {
//   const alert = state.alert;
//   const {isMenuLoading, flatMenu} = state.navMenu;
//   const masterData = state.masterData;
//   const {loadingForRecountVerbPersonMarkers, forRecountVerbPersonMarkers} = state.modelOverviewsStore;

//   return {alert, isMenuLoading, flatMenu, masterData, loadingForRecountVerbPersonMarkers, forRecountVerbPersonMarkers};
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     saveReturnPageName: (pageName) => dispatch(MasterDataActions.saveReturnPageName(pageName)),
//     loadMultipleListData: (gridRuleNames, listTableNames, tableNamesForLoad) => dispatch(MasterDataActions.loadMultipleListData(gridRuleNames, listTableNames, tableNamesForLoad)),
//     getFilteredForRecountVerbPersonMarkers: (verbPersonMarkerCombinationId, dominantActantId, morphemeId) =>
//       dispatch(ModelOverviewsStoreActions.getFilteredForRecountVerbPersonMarkers(verbPersonMarkerCombinationId, dominantActantId, morphemeId))
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(CreateForRecountVerbPersonMarkers);
