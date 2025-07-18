//CreateAfterDominantPersonMarkers.tsx

import { useEffect, useMemo, useCallback, type FC } from "react";

import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import type { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import type {
    ActantGrammarCase,
    ActantGroup,
    ActantPosition,
    ActantType,
    VerbNumber,
    VerbPerson,
    VerbSeries,
    VerbTransition,
    VerbType,
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

const CreateAfterDominantPersonMarkers: FC = () => {
    const dispatch = useAppDispatch();

    const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
        useAppSelector((state) => state.masterDataState);

    const dataTypesState = useAppSelector((state) => state.dataTypesState);
    const masterData = useAppSelector((state) => state.masterDataState);

    const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

    const actantGrammarCases = mdataRepo[
        ETableName.ActantGrammarCases
    ] as ActantGrammarCase[];
    const actantGroups = mdataRepo[ETableName.ActantGroups] as ActantGroup[];
    const actantPositions = mdataRepo[
        ETableName.ActantPositions
    ] as ActantPosition[];
    const actantTypes = mdataRepo[ETableName.ActantTypes] as ActantType[];
    const verbNumbers = mdataRepo[ETableName.VerbNumbers] as VerbNumber[];
    const verbPersons = mdataRepo[ETableName.VerbPersons] as VerbPerson[];
    const verbSeries = mdataRepo[ETableName.VerbSeries] as VerbSeries[];
    const verbTransitions = mdataRepo[
        ETableName.VerbTransitions
    ] as VerbTransition[];
    const verbTypes = mdataRepo[ETableName.VerbTypes] as VerbType[];

    //console.log("CreateAfterDominantPersonMarkers props=", props);

    const menLinkKey = useLocation().pathname.split("/")[1];

    const tableNamesForLoad = useMemo(
        () => [
            ETableName.ActantGrammarCases,
            ETableName.ActantGroups,
            ETableName.ActantPositions,
            ETableName.ActantTypes,
            ETableName.VerbNumbers,
            ETableName.VerbPersons,
            ETableName.VerbSeries,
            ETableName.VerbTransitions,
            ETableName.VerbTypes,
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

    // const checkedDataTypes = {} as { [key: string]: DataTypeFfModel };
    // const GridRules = {} as { [key: string]: GridModel };
    // let allListsLoaded = false;

    // if (!mdWorkingOnLoad) {
    //   allListsLoaded = true;
    //   listTableNames.forEach((listTableName) => {
    //     const checkResult = checkDataLoaded(
    //       masterData,
    //       dataTypesState,
    //       listTableName,
    //       listTableName
    //     );
    //     if (checkResult) {
    //       const { dataType, gridData } = checkResult;
    //       checkedDataTypes[listTableName] = dataType;
    //       const grid = DeserializeGridModel(gridData);
    //       if (grid) GridRules[listTableName] = grid;
    //       else allListsLoaded = false;
    //     } else allListsLoaded = false;
    //   });
    // }
    //console.log("CreateAfterDominantPersonMarkers allListsLoaded=", allListsLoaded);
    //debugger;

    //console.log("CreateAfterDominantPersonMarkers before check load allListsLoaded=", allListsLoaded);
    //console.log("CreateAfterDominantPersonMarkers before check load curscrollTo=", curscrollTo);

    if (
        mdWorkingOnLoad ||
        isMenuLoading ||
        Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s)
    ) {
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
        // !allListsLoaded ||
        !curscrollTo ||
        !actantGrammarCases ||
        // !actantGrammarCasesByActantTypes ||
        !actantGroups ||
        !actantPositions ||
        !actantTypes ||
        // !actantTypesByVerbTypes ||
        // !dominantActants ||
        !verbNumbers ||
        !verbPersons ||
        !verbSeries ||
        !verbTransitions ||
        !verbTypes ||
        // !afterDominantPersonMarkers ||
        !dataTypes
    ) {
        return (
            <div>
                <h5>ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );
    }

    // const verbTypesDict = {} as { [key: number]: VerbType };

    // verbTypes.forEach((element) => {
    //   verbTypesDict[element.vtpId] = element;
    // });

    // const actantTypesDict = {} as { [key: number]: ActantType };

    // actantTypes.forEach((element) => {
    //   actantTypesDict[element.attId] = element;
    // });

    // const verbSeriesDict = {} as { [key: number]: VerbSeries };

    // verbSeries.forEach((element) => {
    //   verbSeriesDict[element.vsrId] = element;
    // });

    // const actantGroupsDict = {} as { [key: number]: ActantGroup };

    // actantGroups.forEach((element) => {
    //   actantGroupsDict[element.agrId] = element;
    // });

    // const verbPersonsDict = {} as { [key: number]: VerbPerson };

    // verbPersons.forEach((element) => {
    //   verbPersonsDict[element.vprId] = element;
    // });

    // const actantPositionsDict = {} as { [key: number]: ActantPosition };

    // actantPositions.forEach((element) => {
    //   actantPositionsDict[element.apnId] = element;
    // });

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

    // const actantGrammarCasesByActantTypesSorted = actantGrammarCasesByActantTypes
    //   .slice()
    //   .sort((a, b) => {
    //     const f =
    //       actantTypesDict[a.actantTypeId].sortId -
    //       actantTypesDict[b.actantTypeId].sortId;
    //     if (f) return f;
    //     return (
    //       verbSeriesDict[a.verbSeriesId].sortId -
    //       verbSeriesDict[b.verbSeriesId].sortId
    //     );
    //   });

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
                <strong>ზმნის პირი</strong> - ზმნის პირის განმარტება
                (გასაკეთებელია).
            </p>
            <p>
                <strong>ზმნის რიცხვი</strong> - ზმნის რიცხვის განმარტება
                (გასაკეთებელია).
            </p>
            <p>
                <strong>ზმნის ტიპი</strong> - ზმნის ტიპის განმარტება
                (გასაკეთებელია).
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
            <MdGridView tableName="dominantActants" />

            <h4>პროცესის აღწერა</h4>
            <p>
                ყოველი ზმნის ტიპის მიხედვით და იმის მიხედვით რა პოზიციაზე დგას
                აქტანტი, განისაზღვრება აქტანტის ტიპი. <br />
                აქტანტის ყოველი ტიპისათვის, იმის მიხედვით რომელ სერიაში არის
                გამოყენებული, განისაზღვრება ბრუნვა და აქტანტის ჯგუფი. (ანუ
                სუბიექტია თუ ობიექტი). <br />
                აქტანტების ჯგუფის, ზმნის პირის და აქტანტის ტიპის მიხედვით
                განისაზღვრება არის თუ არა აქტანტი დომინანტი. <br />
                ზემოთ ჩამოთვლილ ინფორმაციაზე დაყრდნობით თითოეული ზმნის
                ტიპისათვის, სერიისთვის და აქტანტის კომბინაციისთვის განისაზღვრება
                დომინანტი აქტანტი, რიცხვი და პირი
            </p>

            <h4>შედეგი</h4>

            <MdGridView tableName="afterDominantPersonMarkers" readOnly />
        </div>
    );
};

export default CreateAfterDominantPersonMarkers;
