//VerbPersonMarkersOverview.tsx

import { useEffect, useMemo, useCallback, type FC } from "react";
import NameListEditor from "./NameListEditor";
import ParadigmListEditor from "./ParadigmListEditor";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import type { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import type {
    ActantGroups,
    ParadigmNameModel,
    VerbNumbers,
    VerbPersons,
    VerbPluralityType,
} from "../masterData/mdTypes";
import { useLocation, useParams } from "react-router-dom";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import { ETableName } from "../masterData/tableNames";

const VerbPersonMarkersOverview: FC = () => {
    const dispatch = useAppDispatch();

    const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
        useAppSelector((state) => state.masterDataState);
    const dataTypesState = useAppSelector((state) => state.dataTypesState);
    const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

    const verbPluralityTypes = mdataRepo[
        ETableName.VerbPluralityTypes
    ] as VerbPluralityType[];
    const actantGroups = mdataRepo[ETableName.ActantGroups] as ActantGroups[];
    const verbPersons = mdataRepo[ETableName.VerbPersons] as VerbPersons[];
    const verbNumbers = mdataRepo[ETableName.VerbNumbers] as VerbNumbers[];
    const verbPersonMarkerParadigmNames = mdataRepo[
        ETableName.VerbPersonMarkerParadigmNamesQuery
    ] as ParadigmNameModel[];

    //console.log("VerbPersonMarkersOverview props=", props);

    const menLinkKey = useLocation().pathname.split("/")[1];

    const tableNamesForLoad = useMemo(
        () => [
            ETableName.VerbPluralityTypes,
            ETableName.ActantGroups,
            ETableName.VerbPersons,
            ETableName.VerbNumbers,
            ETableName.VerbPersonMarkerParadigmNamesQuery,
        ],
        []
    );

    const [checkLoadMdTables] = useCheckLoadMdTables();

    const { isMenuLoading, flatMenu } = useAppSelector(
        (state) => state.navMenuState
    );

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

    const verbPersonMarkerParadigmsDataType = dataTypes.find(
        (f) => f.dtTable === "verbPersonMarkerParadigms"
    );

    if (
        mdWorkingOnLoad ||
        // verbPersonMarkerParadigmNamesLoading ||
        isMenuLoading ||
        Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s)
    ) {
        return <Loading />;
    }

    if (
        !verbPluralityTypes ||
        !actantGroups ||
        !verbPersons ||
        !verbNumbers ||
        !verbPersonMarkerParadigmNames ||
        !curscrollTo ||
        !dataTypes ||
        !verbPersonMarkerParadigmsDataType
    ) {
        return (
            <div>
                <h5>ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );
    }

    const listEditorTableNames = [
        "verbPluralityTypes",
        "actantGroups",
        "verbPersons",
        "verbNumbers",
    ];
    return (
        <div>
            <h3>ზმნის ცალი პირის ნიშნების პარადიგმების მიმოხილვა</h3>
            <h4>ტერმინები</h4>
            <p>
                <strong>მრალობითობა</strong> - მრალობითობის განმარტება
                (გასაკეთებელია).
            </p>
            <p>
                <strong>აქტანტების ჯგუფი</strong> - აქტანტების ჯგუფის განმარტება
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
                <strong>ცალი პირის ნიშნის პარადიგმა</strong> - ცალი პირის ნიშნის
                პარადიგმის განმარტება (გასაკეთებელია).
            </p>

            {listEditorTableNames.map((tn) => {
                const dataType = dataTypes.find((f) => f.dtTable === tn);
                if (!dataType) {
                    return <div></div>;
                }
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
            })}

            <ParadigmListEditor
                dataType={verbPersonMarkerParadigmsDataType}
                paradigmNamesTable={verbPersonMarkerParadigmNames}
                paradigmNamesTableName={"verbPersonMarkerParadigmNamesQuery"}
                formulasTableName="verbPersonMarkerFormulas"
                curscrollTo={curscrollTo}
                backLigth={backLigth}
                saveReturnPageName={funSaveReturnPageName}
            />
        </div>
    );
};

export default VerbPersonMarkersOverview;
