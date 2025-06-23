//NounParadigmsOverview.tsx

import { useEffect, useMemo, useCallback, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import type {
    GrammarCase,
    NounNumber,
    ParadigmNameModel,
} from "../masterData/mdTypes";
import { useLocation, useParams } from "react-router-dom";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { NzInt } from "../appcarcass/common/myFunctions";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import type { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import NameListEditor from "./NameListEditor";
import ParadigmListEditor from "./ParadigmListEditor";
import { useAlert } from "../appcarcass/hooks/useAlert";
import { ETableName } from "../masterData/tableNames";

const NounParadigmsOverview: FC = () => {
    const dispatch = useAppDispatch();

    const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
        useAppSelector((state) => state.masterDataState);

    // const { nounParadigmNames } = useAppSelector((state) => state.modelDataState);
    const dataTypesState = useAppSelector((state) => state.dataTypesState);
    const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

    // const { mdWorkingOnLoad, datatypesLoading, datatypes } = masterData;
    const grammarCases = mdataRepo[ETableName.GrammarCases] as GrammarCase[];
    const nounNumbers = mdataRepo[ETableName.NounNumbers] as NounNumber[];
    const nounParadigmNames = mdataRepo[
        ETableName.NounParadigmNamesQuery
    ] as ParadigmNameModel[];

    //console.log("NounParadigmsOverview props=", props);

    const menLinkKey = useLocation().pathname.split("/")[1];
    //console.log("NounParadigmsOverview menLinkKey=", menLinkKey);

    const tableNamesForLoad = useMemo(
        () => [
            ETableName.GrammarCases,
            ETableName.NounNumbers,
            ETableName.NounParadigmNamesQuery,
        ],
        []
    );

    const [checkLoadMdTables] = useCheckLoadMdTables();

    const { isMenuLoading, flatMenu } = useAppSelector(
        (state) => state.navMenuState
    );

    // const [checkLoadNounParadigmNames, nounParadigmNamesLoading] =
    //   useCheckLoadNounParadigmNames();

    const isValidPage = useCallback(() => {
        if (!flatMenu) {
            return false;
        }
        return flatMenu.find((f) => f.menLinkKey === menLinkKey);
    }, [flatMenu, menLinkKey]);

    useEffect(() => {
        const menuItem = isValidPage();
        if (!menuItem) return;

        checkLoadMdTables(tableNamesForLoad);
        // checkLoadNounParadigmNames();
    }, [
        isMenuLoading,
        flatMenu,
        // isValidPage,
        // checkLoadMdTables,
        // checkLoadNounParadigmNames,
        tableNamesForLoad,
    ]);

    const { tabKeyParam, recIdParam, recNameParam } = useParams<string>();
    const recIdNumber = NzInt(recIdParam);
    const [curscrollTo, backLigth] = useScroller<{
        tabKey: string | undefined;
        recId: number;
        recName: string | undefined;
    }>({
        tabKey: tabKeyParam,
        recId: recIdNumber,
        recName: recNameParam,
    });

    function funSaveReturnPageName() {
        dispatch(saveReturnPageName(menLinkKey));
    }

    const nounParadigmsDataType = dataTypes.find(
        (f) => f.dtTable === "nounParadigms"
    );

    const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

    if (ApiLoadHaveErrors)
        return (
            <div>
                <h5>ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );

    //console.log("NounParadigmsOverview onCheckLoad ", {grammarCases, nounNumbers, nounParadigmNames, curscrollTo, mdWorkingOnLoad, nounParadigmNamesLoading});

    if (
        mdWorkingOnLoad ||
        Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
        // nounParadigmNamesLoading ||
        isMenuLoading
    ) {
        return <Loading />;
    }

    if (
        !grammarCases ||
        !nounNumbers ||
        !nounParadigmNames ||
        !curscrollTo ||
        !nounParadigmsDataType
    ) {
        return (
            <div>
                <h5>ინფორმაციის ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );
    }

    const listEditorTableNames = ["grammarCases", "nounNumbers"];

    return (
        <div>
            <h3>სახელის ფლექსიის პარადიგმების მიმოხილვა</h3>
            <h4>ტერმინები</h4>
            <p>
                <strong>ბრუნვა</strong> - ბრუნვის განმარტება (გასაკეთებელია).
            </p>
            <p>
                <strong>რიცხვი</strong> - რიცხვის განმარტება (გასაკეთებელია).
            </p>
            <p>
                <strong>პარადიგმა</strong> - პარადიგმის განმარტება
                (გასაკეთებელია).
            </p>

            {listEditorTableNames.map((tn) => {
                const dataType = dataTypes.find((f) => f.dtTable === tn);

                if (dataType) {
                    return (
                        <NameListEditor
                            key={dataType.dtName}
                            dataType={dataType}
                            tableForEdit={mdataRepo[tn]}
                            curscrollTo={curscrollTo}
                            backLigth={backLigth}
                            saveReturnPageName={funSaveReturnPageName}
                        />
                    );
                }
            })}

            <ParadigmListEditor
                dataType={nounParadigmsDataType}
                paradigmNamesTable={nounParadigmNames}
                paradigmNamesTableName={"nounParadigmNamesQuery"}
                formulasTableName="nounParadigmFormulas"
                curscrollTo={curscrollTo}
                backLigth={backLigth}
                saveReturnPageName={funSaveReturnPageName}
            />
        </div>
    );
};

export default NounParadigmsOverview;
