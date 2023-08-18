//IssueDetailInflectionsGridColumns.tsx

import { Link } from "react-router-dom";
import CustomColumn from "./CustomColumn";
import { IGridColumn } from "./IssueTypes";
import { useCallback } from "react";
import CheckboxColumn from "./CheckboxColumn";
import { useCheckDetailMutation } from "../redux/api/issuesApi";
import { issueDetailTypes } from "./IssueDetailsEnums";
import { IcheckDetailParameters } from "../redux/types/issuesTypes";

export type fnIssueDetailInflectionsGridColumns = (
  issId: number
) => IGridColumn[];

export function useIssueDetailInflectionsGridColumns(): [
  fnIssueDetailInflectionsGridColumns
] {
  const [checkDetail] = useCheckDetailMutation();

  const IssueDetailInflectionsGridColumns = useCallback((issId: number) => {
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
                  #{issId}-I-{value}
                </span>
              );
            }}
          >
            {" "}
          </CustomColumn>
        ),
      } as IGridColumn,
      {
        caption: "ბმული",
        visible: true,
        sortable: true,
        fieldName: "inflectionId",
        control: (
          <CustomColumn
            onGetCell={(value, record) => {
              return (
                <Link to={`/inflEdit/${value}`}>
                  {record.infName} ({record.infSamples})
                </Link>
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
        sortable: true,
        fieldName: "note",
      } as IGridColumn,

      {
        caption: "დერივაცია-ძირი",
        visible: true,
        sortable: false,
        fieldName: "derivationBranches",
        control: (
          <CustomColumn
            onGetCell={(value, record) => {
              if (
                record &&
                record.derivationBranches &&
                record.derivationBranches.length > 0
              ) {
                return record.derivationBranches.map(
                  (derItem: any, indx: number) => {
                    return (
                      <span key={indx}>
                        {indx > 0 && "; "}
                        <Link
                          to={`/root/${derItem.rootId}/${derItem.derivationBranchId}`}
                        >
                          {derItem.dbrBaseName} -{derItem.rootName}
                          {derItem.rootHomonymIndex > 0 && (
                            <sup>{derItem.rootHomonymIndex}</sup>
                          )}
                          {derItem.rootNote && <span> {derItem.rootNote}</span>}
                        </Link>
                      </span>
                    );
                  }
                );
              }
              return value;
            }}
          >
            {" "}
          </CustomColumn>
        ),
      } as IGridColumn,

      {
        caption: "თოლია",
        visible: true,
        sortable: false,
        fieldName: "checked",
        changingFieldName: "checkedChanging",
        control: (
          <CheckboxColumn
            idFieldName="isdId"
            onChangeValue={(id, checkedValue) => {
              checkDetail({
                issueId: issId,
                detailsName: issueDetailTypes.inflections,
                id,
                checkedValue,
              } as IcheckDetailParameters);
            }}
          ></CheckboxColumn>
        ),
      } as IGridColumn,
    ];
  }, []);

  return [IssueDetailInflectionsGridColumns];
}
