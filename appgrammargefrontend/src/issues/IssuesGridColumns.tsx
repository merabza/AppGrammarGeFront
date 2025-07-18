//IssuesGridColumns.tsx

import CustomColumn from "../appcarcass/grid/columns/CustomColumn";
import { useAppSelector } from "../appcarcass/redux/hooks";
import { useCallback } from "react";
import type { IGridColumn } from "../appcarcass/grid/GridViewTypes";
import DateTimeColumn from "../appcarcass/grid/columns/DateTimeColumn";
import LinkColumn from "./LinkColumn";
import { ETableName } from "../masterData/tableNames";

export type fnIssuesGridColumns = () => IGridColumn[];

export function useIssuesGridColumns(): [fnIssuesGridColumns] {
    const { mdLookupRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
        useAppSelector((state) => state.masterDataState);
    const issueKinds = mdLookupRepo[ETableName.IssueKinds];
    const issuePriorities = mdLookupRepo[ETableName.IssuePriorities];
    const issueStatuses = mdLookupRepo[ETableName.IssueStatuses];

    const IssuesGridColumns = useCallback(() => {
        if (
            mdWorkingOnLoad ||
            Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
            !issueKinds ||
            !issuePriorities ||
            !issueStatuses
        )
            return [] as IGridColumn[];

        return [
            {
                caption: "#",
                visible: true,
                sortable: true,
                nullable: false,
                fieldName: "issId",
                isKey: true,
                control: (
                    <CustomColumn
                        onGetCell={(value?: string) => {
                            return <span>#{value}</span>;
                        }}
                    >
                        {" "}
                    </CustomColumn>
                ),
            },
            {
                caption: "სათაური",
                visible: true,
                sortable: true,
                nullable: false,
                fieldName: "issTitle",
                control: (
                    <LinkColumn
                        linkBase="issuework"
                        idFieldName="issId"
                    ></LinkColumn>
                ),
            },
            {
                caption: "ტიპი",
                visible: true,
                sortable: true,
                nullable: false,
                fieldName: "issueKindId",
                lookupColumnPart: issueKinds,
            } as IGridColumn,
            {
                caption: "პრიორიტეტი",
                visible: true,
                sortable: true,
                nullable: false,
                fieldName: "issuePriorityId",
                lookupColumnPart: issuePriorities,
            },
            {
                caption: "სტატუსი",
                visible: true,
                sortable: true,
                nullable: false,
                fieldName: "issueStatusId",
                lookupColumnPart: issueStatuses,
            },
            {
                caption: "ავტორი",
                visible: true,
                sortable: true,
                nullable: false,
                fieldName: "issCreatorUserName",
            },
            {
                caption: "მიწერა",
                visible: true,
                sortable: true,
                nullable: false,
                fieldName: "issAssignedUserName",
            },
            {
                caption: "ძ",
                visible: true,
                sortable: false,
                nullable: false,
                fieldName: "rootsDetailsCount",
            },
            {
                caption: "დ",
                visible: true,
                sortable: false,
                nullable: false,
                fieldName: "derivationBranchesDetailsCount",
            },
            {
                caption: "ფ",
                visible: true,
                sortable: false,
                nullable: false,
                fieldName: "inflectionsDetailsCount",
            },
            {
                caption: "-",
                visible: true,
                sortable: false,
                fieldName: "detailsCount",
            },
            {
                caption: "შექმნა",
                visible: true,
                sortable: true,
                nullable: false,
                fieldName: "issCreateDate",
                control: <DateTimeColumn showDate showTime></DateTimeColumn>,
            },
            {
                caption: "განახლება",
                visible: true,
                sortable: true,
                nullable: false,
                fieldName: "IssUpdateDate",
                control: <DateTimeColumn showDate showTime></DateTimeColumn>,
            },
        ] as IGridColumn[];
    }, [
        mdWorkingOnLoad,
        mdWorkingOnLoadingTables,
        issueKinds,
        issuePriorities,
        issueStatuses,
    ]);

    return [IssuesGridColumns];
}
