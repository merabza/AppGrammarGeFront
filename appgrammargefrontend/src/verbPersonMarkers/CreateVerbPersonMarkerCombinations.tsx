//CreateVerbPersonMarkerCombinations.tsx

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
  PluralityChangesByVerbType,
  VerbPersonMarkerCombination,
  VerbPluralityType,
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
import {
  DeserializeGridModel,
  GridModel,
} from "../appcarcass/redux/types/gridTypes";
import { checkDataLoaded } from "../appcarcass/modules/CheckDataLoaded";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import NameListEditor from "../modelOverview/NameListEditor";
import MdListView from "../appcarcass/masterdata/MdListView";

const CreateVerbPersonMarkerCombinations: FC = () => {
  // const { alert, isMenuLoading, flatMenu, masterData, loadMultipleListData } =
  //   props;

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
  const pluralityChangesByVerbTypes =
    mdRepo.pluralityChangesByVerbTypes as PluralityChangesByVerbType[];
  const verbPersonMarkerCombinations =
    mdRepo.verbPersonMarkerCombinations as VerbPersonMarkerCombination[];
  const actantGrammarCases = mdRepo.actantGrammarCases as ActantGrammarCase[];
  const actantGroups = mdRepo.actantGroups as ActantGroup[];
  const actantPositions = mdRepo.actantPositions as ActantPosition[];
  const actantTypes = mdRepo.actantTypes as ActantType[];
  const verbTransitions = mdRepo.verbTransitions as VerbTransition[];
  const verbPluralityTypes = mdRepo.verbPluralityTypes as VerbPluralityType[];
  const verbTypes = mdRepo.verbTypes as VerbType[];
  const verbSeries = mdRepo.verbSeries as VerbSeries[];
  const verbPersonMarkerParadigms =
    mdRepo.verbPersonMarkerParadigms as VerbPersonMarkerParadigm[];

  //console.log("CreateVerbPersonMarkerCombinations props=", props);

  const menLinkKey = useLocation().pathname.split("/")[1];

  const tableNamesForLoad = useMemo(
    () => [
      "actantGrammarCases",
      "actantPositions",
      "actantTypes",
      "actantGroups",
      "verbTransitions",
      "verbPluralityTypes",
      "verbTypes",
      "verbSeries",
      "verbPersonMarkerParadigms",
      "actantGrammarCasesByActantTypes",
      "actantTypesByVerbTypes",
      "pluralityChangesByVerbTypes",
      "verbPersonMarkerCombinations",
    ],
    []
  );

  const listTableNames = useMemo(
    () => [
      "actantGrammarCasesByActantTypes",
      "actantTypesByVerbTypes",
      "pluralityChangesByVerbTypes",
      "verbPersonMarkerCombinations",
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

  const [loadMultipleListData] = useCheckLoadMultipleListData();

  useEffect(() => {
    const menuItem = isValidPage();
    if (!menuItem) return;

    loadMultipleListData(listTableNames, listTableNames, tableNamesForLoad);
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

  let allGridsLoaded = true;
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
      else allGridsLoaded = false;
      // console.log("AfterCheck grid=", grid);
      // console.log("AfterCheck listTableName=", listTableName);
      // console.log("AfterCheck GridRules=", GridRules);
    } else allGridsLoaded = false;
  });

  if (mdWorkingOnLoad || isMenuLoading || mdWorkingOnLoadingTables) {
    return <Loading />;
  }

  // console.log("CreateVerbPersonMarkerCombinations Loaded Data => ", {
  //   GridRules,
  //   curscrollTo,
  //   actantGrammarCasesByActantTypes,
  //   actantTypesByVerbTypes,
  //   pluralityChangesByVerbTypes,
  //   verbPersonMarkerCombinations,
  //   actantGrammarCases,
  //   actantPositions,
  //   actantTypes,
  //   actantGroups,
  //   verbTransitions,
  //   verbPluralityTypes,
  //   verbTypes,
  //   verbSeries,
  //   verbPersonMarkerParadigms,
  //   dataTypes,
  // });

  if (
    // !allDataTypesLoaded ||
    // !allListTablessLoaded ||
    !allGridsLoaded ||
    !curscrollTo ||
    !actantGrammarCasesByActantTypes ||
    !actantTypesByVerbTypes ||
    !pluralityChangesByVerbTypes ||
    !verbPersonMarkerCombinations ||
    !actantGrammarCases ||
    !actantPositions ||
    !actantTypes ||
    !actantGroups ||
    !verbTransitions ||
    !verbPluralityTypes ||
    !verbTypes ||
    !verbSeries ||
    !verbPersonMarkerParadigms ||
    !dataTypes
  ) {
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  const actantTypesDict = {} as { [key: number]: ActantType };

  actantTypes.forEach((element) => {
    actantTypesDict[element.attId] = element;
  });

  const verbSeriesDict = {} as { [key: number]: VerbSeries };

  verbSeries.forEach((element) => {
    verbSeriesDict[element.vsrId] = element;
  });

  const verbTypesDict = {} as { [key: number]: VerbType };

  verbTypes.forEach((element) => {
    verbTypesDict[element.vtpId] = element;
  });

  const actantPositionsDict = {} as { [key: number]: ActantPosition };

  actantPositions.forEach((element) => {
    actantPositionsDict[element.apnId] = element;
  });

  const verbPluralityTypesDict = {} as { [key: number]: VerbPluralityType };

  verbPluralityTypes.forEach((element) => {
    verbPluralityTypesDict[element.vptId] = element;
  });

  const verbPersonMarkerParadigmsDict = {} as {
    [key: number]: VerbPersonMarkerParadigm;
  };

  verbPersonMarkerParadigms.forEach((element) => {
    verbPersonMarkerParadigmsDict[element.vpmpnId] = element;
  });

  const listEditorTableNames = [
    "actantGrammarCases",
    "actantPositions",
    "actantTypes",
    "actantGroups",
    "verbTransitions",
    "verbPluralityTypes",
    "verbTypes",
    "verbPersonMarkerParadigms",
    "verbSeries",
  ];

  return (
    <div>
      <h3>პირის ნიშნების კომბინაციების დათვლა</h3>
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

      <h4>პროცესის აღწერა</h4>
      <p>
        აქტანტების თითოეული კომბინაციისთვის ხდება შემდეგი კომბინაციის
        დაანგარიშება:
        <br />
        ზმნის მრავლობითობის ტიპი, ზმნის პირის პარადიგმა, ზმნის ტიპი, სერია,
        აქტანტების კომბინაცია.
        <br />
        ამ ინფორმაციის დასაანგარიშებლად გამოიყენება:
      </p>
      <ul>
        <li>
          ზმნის მრავლობითობის, ზმნის ტიპისა და სერიების კომბინაცია. რომელიც
          გვაძლევს ინფორმაციას საბოლოოდ რა მარვლობითობის ტიპი მიიღება.
        </li>
        <li>
          ზმნის პირის ნიშნების პარადიგმის ზტრიქონები: ზმნის მრავლობითობა, ზმნის
          პირის პარადიგმა, პირი, რიცხვი.
        </li>
        <li>ზმნის ტიპისა და პოზიციის მიხედვით აქტანტის ტიპის განსაზღვრა.</li>
      </ul>

      <h4>შედეგი</h4>

      <MdListView
        readOnly
        dataType={checkedDataTypes["verbPersonMarkerCombinations"]}
        table={verbPersonMarkerCombinations.slice().sort((a, b) => {
          let f =
            verbPluralityTypesDict[a.verbPluralityTypeId].sortId -
            verbPluralityTypesDict[b.verbPluralityTypeId].sortId;
          if (f) return f;
          f =
            verbPersonMarkerParadigmsDict[a.verbPersonMarkerParadigmId].sortId -
            verbPersonMarkerParadigmsDict[b.verbPersonMarkerParadigmId].sortId;
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
        gridColumns={GridRules["verbPersonMarkerCombinations"].cells}
        masterData={masterData}
        curscrollTo={curscrollTo.recId}
        backLigth={backLigth}
        firstFilter={{
          verbPluralityTypeId: true,
          verbPersonMarkerParadigmId: true,
          verbTypeId: true,
          verbSeriesId: true,
        }}
      />
    </div>
  );
};

export default CreateVerbPersonMarkerCombinations;

// function mapStateToProps(state) {1
//   const alert = state.alert;
//   const { isMenuLoading, flatMenu } = state.navMenu;
//   const masterData = state.masterData;

//   return { alert, isMenuLoading, flatMenu, masterData };

// }

// function mapDispatchToProps(dispatch) {
//   return {
//     saveReturnPageName: (pageName) => dispatch(MasterDataActions.saveReturnPageName(pageName)),
//     loadMultipleListData: (listTableNames, tableNamesForLoad) => dispatch(MasterDataActions.loadMultipleListData(listTableNames, listTableNames, tableNamesForLoad))
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(CreateVerbPersonMarkerCombinations);
