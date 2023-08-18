//ActantCombinationsReCounter.tsx

import { useEffect, useMemo, useCallback, FC } from "react";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import {
  ActantCombinationDetail,
  ActantPosition,
  VerbNumber,
  VerbPerson,
} from "../masterData/mdTypes";
import { useLocation, useParams } from "react-router-dom";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import { checkDataLoaded } from "../appcarcass/modules/CheckDataLoaded";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import MdListView from "../appcarcass/masterdata/MdListView";
import { useCheckLoadMultipleListData } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMultipleListData";
import {
  DeserializeGridModel,
  GridModel,
} from "../appcarcass/redux/types/gridTypes";
import NameListEditor from "../modelOverview/NameListEditor";

const ActantCombinationsReCounter: FC = () => {
  // const { alert, isMenuLoading, flatMenu, loadMultipleListData, masterData } =
  //   props;
  const dispatch = useAppDispatch();

  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const masterData = useAppSelector((state) => state.masterDataState);

  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const actantPositions = mdRepo.actantPositions as ActantPosition[];
  const verbNumbers = mdRepo.verbNumbers as VerbNumber[];

  const verbPersons = mdRepo.verbPersons as VerbPerson[];
  const actantCombinationDetails =
    mdRepo.actantCombinationDetails as ActantCombinationDetail[];

  const menLinkKey = useLocation().pathname.split("/")[1];

  const tableNamesForLoad = useMemo(
    () => [
      "actantPositions",
      "verbNumbers",
      "verbPersons",
      "actantCombinationDetails",
    ],
    []
  );

  const listTableNames = useMemo(() => ["actantCombinationDetails"], []); //

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
  let allListsLoaded = true;

  // console.log("ActantCombinationsReCounter listTableNames = ", listTableNames);

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

  // console.log(
  //   "ActantCombinationsReCounter checkedDataTypes = ",
  //   checkedDataTypes
  // );
  // console.log("ActantCombinationsReCounter onCheckLoad ", {
  //   actantPositions,
  //   verbNumbers,
  //   verbPersons,
  //   actantCombinationDetails,
  //   curscrollTo,
  //   mdWorkingOnLoad,
  // });

  if (mdWorkingOnLoad || isMenuLoading || mdWorkingOnLoadingTables) {
    return <Loading />;
  }

  if (
    !allListsLoaded ||
    !curscrollTo ||
    !actantPositions ||
    !verbNumbers ||
    !verbPersons ||
    !actantCombinationDetails ||
    !dataTypes
  ) {
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  //debugger;

  const actantPositionsDict = {} as { [key: number]: ActantPosition };

  actantPositions.forEach((element) => {
    actantPositionsDict[element.apnId] = element;
  });

  const listEditorTableNames = [
    "actantPositions",
    "verbNumbers",
    "verbPersons",
  ];

  const actantCombinationDetailsSorted = actantCombinationDetails
    .slice()
    .sort((a, b) => {
      const f = a.actantCombinationId - b.actantCombinationId;
      if (f) return f;
      return (
        actantPositionsDict[a.actantPositionId].sortId -
        actantPositionsDict[b.actantPositionId].sortId
      );
    });

  return (
    <div>
      <h3>აქტანტების კომბინაციების დაანგარიშება</h3>
      <h4>ტერმინები</h4>
      <p>
        <strong>აქტანტის პოზიცია</strong> - აქტანტის პოზიციის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>ზმნის რიცხვი</strong> - ზმნის რიცხვის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>ზმნის პირი</strong> - ზმნის პირის განმარტება (გასაკეთებელია).
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

      <h4>პროცესის აღწერა</h4>
      <p>
        განიხილება პოზიციების რაოდენობა 1 დან მაქსიმუმამდე (
        {actantPositions.length}). <br />
        თითოეულ შემთხვევაში დაიანგარიშება პირებისა და რიცხვების ყველა შესაძლო
        კომბინაცია. <br />
        თუ პირების რაოდენობა 1-ზე მეტია, არ შეიძლება პირველი ან მეორე პირი
        კომბინაციაში ერთზე მეტჯერ შეგვხვდეს. <br />
        თუ პირების რაოდენობა 2-ზე მეტია, არ შეიძლება კომბინაციაში ერთდროულად
        იყოს პირველი და მეორე პირი. <br />
        სამზე მეტ პირიანებისათვის მესამე პოზიციიდან დაწყებული ყველა პირი უნდა
        იყოს მესამე პირი. <br />
        ყველა არსებული კომბინაციიდან ვტოვებთ მხოლოდ იმათ, რომლებიც ზემოთ
        ჩამოთვლილ კრიტერიუმებს აკმაყოფილებს.
      </p>

      <h4>შედეგი</h4>

      <MdListView
        readOnly
        dataType={checkedDataTypes["actantCombinationDetails"]}
        table={actantCombinationDetailsSorted}
        gridColumns={GridRules["actantCombinationDetails"].cells}
        masterData={masterData}
        curscrollTo={curscrollTo.recId}
        backLigth={backLigth}
        firstFilter={{ actantCombinationId: true }}
      />
    </div>
  );
};

export default ActantCombinationsReCounter;

// function mapStateToProps(state) {
//   const alert = state.alert;
//   const masterData = state.masterData;
//   const { isMenuLoading, flatMenu } = state.navMenu;

//   return { alert, isMenuLoading, flatMenu, masterData };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     saveReturnPageName: (pageName) =>
//       dispatch(MasterDataActions.saveReturnPageName(pageName)),
//     loadMultipleListData: (listTableNames, tableNamesForLoad) =>
//       dispatch(
//         MasterDataActions.loadMultipleListData(
//           listTableNames,
//           listTableNames,
//           tableNamesForLoad
//         )
//       ),
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(ActantCombinationsReCounter);
