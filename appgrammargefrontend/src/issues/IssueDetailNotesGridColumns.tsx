//IssueDetailNotesGridColumns.tsx

//IssueDetailNotesGridColumns.tsx
import type { IGridColumn } from "../appcarcass/grid/GridViewTypes";
import CustomColumn from "../appcarcass/grid/columns/CustomColumn";
import { useCallback } from "react";

export type fnIssueDetailNotesGridColumns = (issId: number) => IGridColumn[];

export function useIssueDetailNotesGridColumns(): [
    fnIssueDetailNotesGridColumns
] {
    const IssueDetailNotesGridColumns = useCallback((issId: number) => {
        return [
            {
                caption: "#",
                visible: true,
                sortable: true,
                fieldName: "isdId",
                isKey: true,
                control: (
                    <CustomColumn
                        onGetCell={(value, record) => {
                            return (
                                <span>
                                    #{issId}-N-{value}
                                </span>
                            );
                        }}
                    >
                        {" "}
                    </CustomColumn>
                ),
            } as IGridColumn,
            {
                caption: "შენიშვნა",
                visible: true,
                fieldName: "note",
            } as IGridColumn,
        ];
    }, []);

    return [IssueDetailNotesGridColumns];
}
