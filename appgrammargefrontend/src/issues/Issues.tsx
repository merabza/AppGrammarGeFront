//Issues.tsx

import { useEffect, useMemo, useCallback, type FC } from "react";
import { useAppSelector } from "../appcarcass/redux/hooks";
import type { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import { useLocation } from "react-router-dom";
import Loading from "../appcarcass/common/Loading";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import { useAlert } from "../appcarcass/hooks/useAlert";
import AlertMessages from "../appcarcass/common/AlertMessages";
import {
    useGetIssuesCountQuery,
    useLazyGetissuesRowsDataQuery,
} from "../redux/api/issuesApi";
import type { IFilterSortRequest } from "../appcarcass/grid/GridViewTypes";
import GridView from "../appcarcass/grid/GridView";
import { useIssuesGridColumns } from "./IssuesGridColumns";
import { useCheckLoadLookupTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadLookupTables";
import { ETableName } from "../masterData/tableNames";

const Issues: FC = () => {
    const { mdLookupRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
        useAppSelector((state) => state.masterDataState);
    const dataTypesState = useAppSelector((state) => state.dataTypesState);
    const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;
    const issueKinds = mdLookupRepo[ETableName.IssueKinds];
    const issuePriorities = mdLookupRepo[ETableName.IssuePriorities];
    const issueStatuses = mdLookupRepo[ETableName.IssueStatuses];

    const [
        getIssuesRowsData,
        { data: curRowsData, isLoading: loadingIssuesRowsData },
    ] = useLazyGetissuesRowsDataQuery();

    const menLinkKey = useLocation().pathname.split("/")[1];

    const tableNamesForLoad = useMemo(
        () => [
            ETableName.IssueKinds,
            ETableName.IssuePriorities,
            ETableName.IssueStatuses,
        ],
        []
    );

    const { isMenuLoading, flatMenu } = useAppSelector(
        (state) => state.navMenuState
    );

    const [checkLoadMdTables] = useCheckLoadLookupTables();
    const { data: issuesCount, isLoading: issuesCountLoading } =
        useGetIssuesCountQuery();

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

    const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

    const [IssuesGridColumns] = useIssuesGridColumns();

    if (ApiLoadHaveErrors)
        return (
            <div>
                <h5>ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );

    if (
        mdWorkingOnLoad ||
        isMenuLoading ||
        Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
        issuesCountLoading
    ) {
        return <Loading />;
    }

    // console.log("Issues Before Alert ", {
    //   issueKinds,
    //   issuePriorities,
    //   issueStatuses,
    //   dataTypes,
    //   issuesCount,
    // });

    if (
        !issueKinds ||
        !issuePriorities ||
        !issueStatuses ||
        !dataTypes ||
        !issuesCount
    ) {
        return (
            <div>
                <h5>ინფორმაციის ჩატვირთვის პრობლემა!</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );
    }

    const gridColumns = IssuesGridColumns();

    return (
        <div>
            <GridView
                showCountColumn
                columns={gridColumns}
                rowsData={curRowsData}
                onLoadRows={(offset, rowsCount, sortByFields, filterFields) => {
                    getIssuesRowsData({
                        offset,
                        rowsCount,
                        filterFields,
                        sortByFields,
                    } as IFilterSortRequest);
                }}
                loading={loadingIssuesRowsData}
            ></GridView>
            {/* {insideChanging && <span>&frasl;</span>} */}
        </div>
    );
};

export default Issues;
