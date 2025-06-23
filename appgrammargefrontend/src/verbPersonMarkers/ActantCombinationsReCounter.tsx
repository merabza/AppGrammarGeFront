//ActantCombinationsReCounter.tsx

import { useEffect, useMemo, useCallback, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import type { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import type {
    ActantPosition,
    VerbNumber,
    VerbPerson,
} from "../masterData/mdTypes";
import { useLocation, useParams } from "react-router-dom";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import NameListEditor from "../modelOverview/NameListEditor";
import MdGridView from "../appcarcass/masterdata/MdGridView";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { ETableName } from "../masterData/tableNames";

const ActantCombinationsReCounter: FC = () => {
    // const { alert, isMenuLoading, flatMenu, loadMultipleListData, masterData } =
    //   props;
    const dispatch = useAppDispatch();

    const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
        useAppSelector((state) => state.masterDataState);

    const dataTypesState = useAppSelector((state) => state.dataTypesState);
    const masterData = useAppSelector((state) => state.masterDataState);
    const [checkLoadMdTables] = useCheckLoadMdTables();

    const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

    const actantPositions = mdataRepo[
        ETableName.ActantPositions
    ] as ActantPosition[];
    const verbNumbers = mdataRepo[ETableName.VerbNumbers] as VerbNumber[];

    const verbPersons = mdataRepo[ETableName.VerbPersons] as VerbPerson[];
    // const actantCombinationDetails =
    //   mdRepo.actantCombinationDetails as ActantCombinationDetail[];

    const menLinkKey = useLocation().pathname.split("/")[1];

    const tableNamesForLoad = useMemo(
        () => [
            ETableName.ActantPositions,
            ETableName.VerbNumbers,
            ETableName.VerbPersons,
        ],
        []
    );

    // const listTableNames = useMemo(() => ["actantCombinationDetails"], []); //

    const { isMenuLoading, flatMenu } = useAppSelector(
        (state) => state.navMenuState
    );

    const isValidPage = useCallback(() => {
        if (!flatMenu) {
            return false;
        }
        return flatMenu.find((f) => f.menLinkKey === menLinkKey);
    }, [flatMenu, menLinkKey]);

    // const [loadMultipleListData] = useCheckLoadMultipleListData();

    useEffect(() => {
        const menuItem = isValidPage();
        if (!menuItem) return;

        // loadMultipleListData(listTableNames, tableNamesForLoad, null);
        checkLoadMdTables(tableNamesForLoad);
    }, [isMenuLoading, flatMenu, tableNamesForLoad]);

    const { tabKey, recId, recName } = useParams<string>();

    const recIdNumber = NzInt(recId);

    const [curscrollTo, backLigth] = useScroller<
        | {
              tabKey: string | undefined;
              recId: number;
              recName: string | undefined;
          }
        | undefined
    >({
        tabKey,
        recId: recIdNumber,
        recName,
    });

    function funSaveReturnPageName() {
        dispatch(saveReturnPageName(menLinkKey));
    }

    // const checkedDataTypes = {} as { [key: string]: DataTypeFfModel };
    // const GridRules = {} as { [key: string]: GridModel };
    //let allListsLoaded = true;

    // console.log("ActantCombinationsReCounter listTableNames = ", listTableNames);

    // listTableNames.forEach((listTableName) => {
    //   const checkResult = checkDataLoaded(
    //     masterData,
    //     dataTypesState,
    //     listTableName,
    //     listTableName
    //   );
    //   if (checkResult) {
    //     const { dataType, gridData } = checkResult;
    //     checkedDataTypes[listTableName] = dataType;
    //     const grid = DeserializeGridModel(gridData);
    //     if (grid) GridRules[listTableName] = grid;
    //     else {
    //       allListsLoaded = false;
    //       //console.log("allListsLoaded = false because of grid=", grid);
    //     }
    //   } else {
    //     allListsLoaded = false;
    //     // console.log(
    //     //   "allListsLoaded = false because of checkResult=",
    //     //   checkResult
    //     // );
    //   }
    // });

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
    //   dataTypes,

    //   allListsLoaded,
    // });

    if (
        mdWorkingOnLoad ||
        isMenuLoading ||
        Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s)
    ) {
        return <Loading />;
    }

    if (
        // !allListsLoaded ||
        !actantPositions ||
        !verbNumbers ||
        !verbPersons ||
        // !actantCombinationDetails ||
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

    // const actantPositionsDict = {} as { [key: number]: ActantPosition };

    // actantPositions.forEach((element) => {
    //   actantPositionsDict[element.apnId] = element;
    // });

    const listEditorTableNames = [
        "actantPositions",
        "verbNumbers",
        "verbPersons",
    ];

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
                <strong>ზმნის პირი</strong> - ზმნის პირის განმარტება
                (გასაკეთებელია).
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
            <h4>პროცესის აღწერა</h4>
            <p>
                განიხილება პოზიციების რაოდენობა 1 დან მაქსიმუმამდე (
                {actantPositions.length}). <br />
                თითოეულ შემთხვევაში დაიანგარიშება პირებისა და რიცხვების ყველა
                შესაძლო კომბინაცია. <br />
                თუ პირების რაოდენობა 1-ზე მეტია, არ შეიძლება პირველი ან მეორე
                პირი კომბინაციაში ერთზე მეტჯერ შეგვხვდეს. <br />
                თუ პირების რაოდენობა 2-ზე მეტია, არ შეიძლება კომბინაციაში
                ერთდროულად იყოს პირველი და მეორე პირი. <br />
                სამზე მეტ პირიანებისათვის მესამე პოზიციიდან დაწყებული ყველა პირი
                უნდა იყოს მესამე პირი. <br />
                ყველა არსებული კომბინაციიდან ვტოვებთ მხოლოდ იმათ, რომლებიც ზემოთ
                ჩამოთვლილ კრიტერიუმებს აკმაყოფილებს.
            </p>
            <h4>შედეგი</h4>
            <MdGridView tableName="actantCombinationDetails" readOnly />
        </div>
    );
};

export default ActantCombinationsReCounter;
