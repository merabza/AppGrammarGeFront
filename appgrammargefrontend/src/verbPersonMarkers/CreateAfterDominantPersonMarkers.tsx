//CreateAfterDominantPersonMarkers.tsx

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
  AfterDominantPersonMarker,
  DominantActant,
  VerbNumber,
  VerbPerson,
  VerbSeries,
  VerbTransition,
  VerbType,
} from "../masterData/mdTypes";
import { useLocation, useParams } from "react-router-dom";
import { useCheckLoadMultipleListData } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMultipleListData";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import {
  DeserializeGridModel,
  GridModel,
} from "../appcarcass/redux/types/gridTypes";
import { checkDataLoaded } from "../appcarcass/modules/CheckDataLoaded";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import MdListView from "../appcarcass/masterdata/MdListView";
import NameListEditor from "../modelOverview/NameListEditor";

const CreateAfterDominantPersonMarkers: FC = () => {
  const dispatch = useAppDispatch();

  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const masterData = useAppSelector((state) => state.masterDataState);

  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const actantGrammarCasesByActantTypes =
    mdRepo.actantGrammarCasesByActantTypes as ActantGrammarCasesByActantType[];
  const actantTypesByVerbTypes =
    mdRepo.actantTypesByVerbTypes as ActantTypesByVerbType[];
  const dominantActants = mdRepo.dominantActants as DominantActant[];
  const afterDominantPersonMarkers =
    mdRepo.afterDominantPersonMarkers as AfterDominantPersonMarker[];
  const actantGrammarCases = mdRepo.actantGrammarCases as ActantGrammarCase[];
  const actantGroups = mdRepo.actantGroups as ActantGroup[];
  const actantPositions = mdRepo.actantPositions as ActantPosition[];
  const actantTypes = mdRepo.actantTypes as ActantType[];
  const verbNumbers = mdRepo.verbNumbers as VerbNumber[];
  const verbPersons = mdRepo.verbPersons as VerbPerson[];
  const verbSeries = mdRepo.verbSeries as VerbSeries[];
  const verbTransitions = mdRepo.verbTransitions as VerbTransition[];
  const verbTypes = mdRepo.verbTypes as VerbType[];

  //console.log("CreateAfterDominantPersonMarkers props=", props);

  const menLinkKey = useLocation().pathname.split("/")[1];

  const tableNamesForLoad = useMemo(
    () => [
      "actantGrammarCases",
      "actantGroups",
      "actantPositions",
      "actantTypes",
      "verbNumbers",
      "verbPersons",
      "verbSeries",
      "verbTransitions",
      "verbTypes",
      "actantGrammarCasesByActantTypes",
      "actantTypesByVerbTypes",
      "dominantActants",
      "afterDominantPersonMarkers",
    ],
    []
  );

  const listTableNames = useMemo(
    () => [
      "actantGrammarCasesByActantTypes",
      "actantTypesByVerbTypes",
      "dominantActants",
      "afterDominantPersonMarkers",
    ],
    []
  ); //

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

    loadMultipleListData(listTableNames, tableNamesForLoad, null);
  }, [isMenuLoading, flatMenu, listTableNames, tableNamesForLoad]);

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
  const GridRules = {} as { [key: string]: GridModel };
  let allListsLoaded = false;

  if (!mdWorkingOnLoad) {
    allListsLoaded = true;
    listTableNames.forEach((listTableName) => {
      const checkResult = checkDataLoaded(
        masterData,
        dataTypesState,
        listTableName,
        listTableName
      );
      if (checkResult) {
        const { dataType, gridData } = checkResult;
        checkedDataTypes[listTableName] = dataType;
        const grid = DeserializeGridModel(gridData);
        if (grid) GridRules[listTableName] = grid;
        else allListsLoaded = false;
      } else allListsLoaded = false;
    });
  }
  //console.log("CreateAfterDominantPersonMarkers allListsLoaded=", allListsLoaded);
  //debugger;

  //console.log("CreateAfterDominantPersonMarkers before check load allListsLoaded=", allListsLoaded);
  //console.log("CreateAfterDominantPersonMarkers before check load curscrollTo=", curscrollTo);

  if (mdWorkingOnLoad || isMenuLoading || mdWorkingOnLoadingTables) {
    return <Loading />;
  }

  // console.log("CreateAfterDominantPersonMarkers Before Check ", {
  //   allListsLoaded,
  //   curscrollTo,
  //   actantGrammarCases,
  //   actantGrammarCasesByActantTypes,
  //   actantGroups,
  //   actantPositions,
  //   actantTypes,
  //   actantTypesByVerbTypes,
  //   dominantActants,
  //   verbNumbers,
  //   verbPersons,
  //   verbSeries,
  //   verbTransitions,
  //   verbTypes,
  //   afterDominantPersonMarkers,
  //   dataTypes,
  // });

  if (
    !allListsLoaded ||
    !curscrollTo ||
    !actantGrammarCases ||
    !actantGrammarCasesByActantTypes ||
    !actantGroups ||
    !actantPositions ||
    !actantTypes ||
    !actantTypesByVerbTypes ||
    !dominantActants ||
    !verbNumbers ||
    !verbPersons ||
    !verbSeries ||
    !verbTransitions ||
    !verbTypes ||
    !afterDominantPersonMarkers ||
    !dataTypes
  ) {
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  const verbTypesDict = {} as { [key: number]: VerbType };

  verbTypes.forEach((element) => {
    verbTypesDict[element.vtpId] = element;
  });

  const actantTypesDict = {} as { [key: number]: ActantType };

  actantTypes.forEach((element) => {
    actantTypesDict[element.attId] = element;
  });

  const verbSeriesDict = {} as { [key: number]: VerbSeries };

  verbSeries.forEach((element) => {
    verbSeriesDict[element.vsrId] = element;
  });

  const actantGroupsDict = {} as { [key: number]: ActantGroup };

  actantGroups.forEach((element) => {
    actantGroupsDict[element.agrId] = element;
  });

  const verbPersonsDict = {} as { [key: number]: VerbPerson };

  verbPersons.forEach((element) => {
    verbPersonsDict[element.vprId] = element;
  });

  const actantPositionsDict = {} as { [key: number]: ActantPosition };

  actantPositions.forEach((element) => {
    actantPositionsDict[element.apnId] = element;
  });

  //console.log("actantTypesDict=", actantTypesDict);
  //console.log("verbSeriesDict=", verbSeriesDict);
  //console.log("actantGroupsDict=", actantGroupsDict);
  //console.log("verbPersonsDict=", verbPersonsDict);

  const listEditorTableNames = [
    "actantGrammarCases",
    "actantPositions",
    "actantTypes",
    "actantGroups",
    "verbTransitions",
    "verbPersons",
    "verbNumbers",
    "verbTypes",
    "verbSeries",
  ];

  const actantGrammarCasesByActantTypesSorted = actantGrammarCasesByActantTypes
    .slice()
    .sort((a, b) => {
      const f =
        actantTypesDict[a.actantTypeId].sortId -
        actantTypesDict[b.actantTypeId].sortId;
      if (f) return f;
      return (
        verbSeriesDict[a.verbSeriesId].sortId -
        verbSeriesDict[b.verbSeriesId].sortId
      );
    });

  return (
    <div>
      <h3>პირის ნიშნების დათვლა დომინანტების გათვალისწინებით</h3>
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
        table={actantGrammarCasesByActantTypesSorted}
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
        dataType={checkedDataTypes["dominantActants"]}
        table={dominantActants.slice().sort((a, b) => {
          const f = actantGroupsDict[a.actantGroupId].agrKey.localeCompare(
            actantGroupsDict[b.actantGroupId].agrKey
          );
          if (f) return f;
          return (
            verbPersonsDict[a.verbPersonId].sortId -
            verbPersonsDict[b.verbPersonId].sortId
          );
        })}
        gridColumns={GridRules["dominantActants"].cells}
        masterData={masterData}
        curscrollTo={curscrollTo.recId}
        backLigth={backLigth}
      />

      <h4>პროცესის აღწერა</h4>
      <p>
        ყოველი ზმნის ტიპის მიხედვით და იმის მიხედვით რა პოზიციაზე დგას აქტანტი,
        განისაზღვრება აქტანტის ტიპი. <br />
        აქტანტის ყოველი ტიპისათვის, იმის მიხედვით რომელ სერიაში არის
        გამოყენებული, განისაზღვრება ბრუნვა და აქტანტის ჯგუფი. (ანუ სუბიექტია თუ
        ობიექტი). <br />
        აქტანტების ჯგუფის, ზმნის პირის და აქტანტის ტიპის მიხედვით განისაზღვრება
        არის თუ არა აქტანტი დომინანტი. <br />
        ზემოთ ჩამოთვლილ ინფორმაციაზე დაყრდნობით თითოეული ზმნის ტიპისათვის,
        სერიისთვის და აქტანტის კომბინაციისთვის განისაზღვრება დომინანტი აქტანტი,
        რიცხვი და პირი
      </p>

      <h4>შედეგი</h4>

      <MdListView
        readOnly
        dataType={checkedDataTypes["afterDominantPersonMarkers"]}
        table={afterDominantPersonMarkers.slice().sort((a, b) => {
          const f =
            verbTypesDict[a.verbTypeId].sortId -
            verbTypesDict[b.verbTypeId].sortId;
          if (f) return f;
          return (
            verbSeriesDict[a.verbSeriesId].sortId -
            verbSeriesDict[b.verbSeriesId].sortId
          );
        })}
        gridColumns={GridRules["afterDominantPersonMarkers"].cells}
        masterData={masterData}
        curscrollTo={curscrollTo.recId}
        backLigth={backLigth}
        firstFilter={{ verbTypeId: true, verbSeriesId: true }}
      />
    </div>
  );
};

export default CreateAfterDominantPersonMarkers;