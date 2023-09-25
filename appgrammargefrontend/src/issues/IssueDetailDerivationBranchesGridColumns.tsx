//IssueDetailDerivationBranchesGridColumns.tsx

import CustomColumn from "./CustomColumn";
import { useCallback } from "react";
import LinkColumn from "./LinkColumn";
import { saveIssueDetailLine } from "../redux/slices/issuesSlice";
import { issueDetailTypes } from "./IssueDetailsEnums";
import { IIssueDetailLine } from "../redux/types/issuesTypes";
import { Link } from "react-router-dom";
import CheckboxColumn from "./CheckboxColumn";
import { useCheckDetailMutation } from "../redux/api/issuesApi";
import { IGridColumn } from "../appcarcass/common/GridViewTypes";

export type fnIssueDetailDerivationBranchesGridColumns = (
  issId: number
) => IGridColumn[];

export function useIssueDetailDerivationBranchesGridColumns(): [
  fnIssueDetailDerivationBranchesGridColumns
] {
  const [checkDetail] = useCheckDetailMutation();

  const IssueDetailDerivationBranchesGridColumns = useCallback(
    (issId: number) => {
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
                    #{issId}-D-{value}
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
          fieldName: "dbrBaseName",
          control: (
            <LinkColumn
              linkBase="derivEdit"
              idFieldName="derivationBranchId"
              onClick={(record, index, offset, showRows) => {
                //ვინახავთ სიაში მიმდინარე ადგილს, საიდანაც მოხდა ამ ბმულზე გადასვლა. იმისათვის, რომ "სიაში დაბრუნება" ღილაკის გამოყენებით მოხდეს უკან დაბრუნება
                saveIssueDetailLine({
                  issueId: issId,
                  detailsName: issueDetailTypes.derivationBranches,
                  isdId: record.isdId,
                  index,
                  offset,
                  showRows,
                } as IIssueDetailLine);
              }}
            ></LinkColumn>
          ),
        } as IGridColumn,
        {
          caption: "შენიშვნა",
          visible: true,
          sortable: true,
          fieldName: "note",
        } as IGridColumn,
        {
          caption: "ძირები",
          visible: true,
          sortable: false,
          fieldName: "derivationBranchId",
          control: (
            <CustomColumn
              onGetCell={(value, record, index, offset, showRows) => {
                if (record && record.roots && record.roots.length > 0) {
                  return record.roots.map((rootItem: any, indx: number) => {
                    return (
                      <span key={indx}>
                        {indx > 0 && "; "}
                        <Link
                          to={`/root/${rootItem.rootId}/${value}`}
                          onClick={(e) => {
                            // e.preventDefault(); ეს საჭირო არ არის, რადგან კლინკზე აღარ გადადის
                            //ვინახავთ სიაში მიმდინარე ადგილს, საიდანაც მოხდა ამ ბმულზე გადასვლა. იმისათვის, რომ "სიაში დაბრუნება" ღილაკის გამოყენებით მოხდეს უკან დაბრუნება
                            saveIssueDetailLine({
                              issueId: issId,
                              detailsName: issueDetailTypes.derivationBranches,
                              isdId: record.isdId,
                              index,
                              offset,
                              showRows,
                            } as IIssueDetailLine);
                          }}
                        >
                          {rootItem.rootName}
                          {rootItem.rootHomonymIndex > 0 && (
                            <sup>{rootItem.rootHomonymIndex}</sup>
                          )}
                          {rootItem.rootNote && (
                            <span> {rootItem.rootNote}</span>
                          )}
                        </Link>
                      </span>
                    );
                  });
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
                  detailsName: issueDetailTypes.derivationBranches,
                  id,
                  checkedValue,
                });
              }}
            ></CheckboxColumn>
          ),
        } as IGridColumn,
      ];
    },
    []
  );

  return [IssueDetailDerivationBranchesGridColumns];
}
