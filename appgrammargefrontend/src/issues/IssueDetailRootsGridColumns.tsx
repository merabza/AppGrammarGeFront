//IssueDetailRootsGridColumns.tsx

import { Link } from "react-router-dom";
import CustomColumn from "./CustomColumn";
import { issueDetailTypes } from "./IssueDetailsEnums";
import { IRoot } from "./IssueTypes";
import { useAppDispatch } from "../appcarcass/redux/hooks";
import { saveIssueDetailLine } from "../redux/slices/issuesSlice";
import {
  IIssueDetailLine,
  IcheckDetailParameters,
} from "../redux/types/issuesTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckboxColumn from "./CheckboxColumn";
import { useCheckDetailMutation } from "../redux/api/issuesApi";
import { useCallback } from "react";
import { IGridColumn } from "../appcarcass/common/GridViewTypes";

export type fnIssueDetailRootsGridColumns = (issId: number) => IGridColumn[];

export function useIssueDetailRootsGridColumns(): [
  fnIssueDetailRootsGridColumns
] {
  const dispatch = useAppDispatch();
  const [checkDetail] = useCheckDetailMutation();

  const IssueDetailRootsGridColumns = useCallback((issId: number) => {
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
                  #{issId}-R-{value}
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
        fieldName: "rootName",
        control: (
          <CustomColumn
            onGetCell={(value, record, index, offset, showRows) => {
              const rootRecord = record as IRoot;
              return (
                <span>
                  <Link
                    to={`/root/${rootRecord.rootId}`}
                    onClick={(e) => {
                      // e.preventDefault(); ეს საჭირო არ არის, რადგან კლინკზე აღარ გადადის
                      //ვინახავთ სიაში მიმდინარე ადგილს, საიდანაც მოხდა ამ ბმულზე გადასვლა. იმისათვის, რომ "სიაში დაბრუნება" ღილაკის გამოყენებით მოხდეს უკან დაბრუნება
                      dispatch(
                        saveIssueDetailLine({
                          issueId: issId,
                          detailsName: issueDetailTypes.roots,
                          isdId: rootRecord.isdId,
                          index,
                          offset,
                          showRows,
                        } as IIssueDetailLine)
                      );
                    }}
                  >
                    {" "}
                    <FontAwesomeIcon icon="folder-open" size="2x" />{" "}
                  </Link>
                  <Link
                    to={`/rootEdit/${rootRecord.rootId}`}
                    onClick={(e) => {
                      // e.preventDefault(); ეს საჭირო არ არის, რადგან კლინკზე აღარ გადადის
                      //ვინახავთ სიაში მიმდინარე ადგილს, საიდანაც მოხდა ამ ბმულზე გადასვლა. იმისათვის, რომ "სიაში დაბრუნება" ღილაკის გამოყენებით მოხდეს უკან დაბრუნება
                      dispatch(
                        saveIssueDetailLine({
                          issueId: issId,
                          detailsName: issueDetailTypes.roots,
                          isdId: rootRecord.isdId,
                          index,
                          offset,
                          showRows,
                        } as IIssueDetailLine)
                      );
                    }}
                  >
                    {rootRecord.rootName}
                    {rootRecord.rootHomonymIndex > 0 && (
                      <sup>{rootRecord.rootHomonymIndex}</sup>
                    )}
                    {rootRecord.rootNote && <span> {rootRecord.rootNote}</span>}
                  </Link>
                </span>
              );
            }}
          >
            {" "}
          </CustomColumn>
        ),
      } as IGridColumn,
      { caption: "შენიშვნა", visible: true, fieldName: "note" } as IGridColumn,
      {
        caption: "თოლია",
        visible: true,
        sortable: false,
        fieldName: "checked",
        changingFieldName: "checkedChanging",
        control: (
          <CheckboxColumn
            idFieldName="isdId"
            onChangeValue={(id: number, checkedValue: boolean) => {
              checkDetail({
                issueId: issId,
                detailsName: issueDetailTypes.roots,
                id,
                checkedValue,
              } as IcheckDetailParameters);
            }}
          ></CheckboxColumn>
        ),
      } as IGridColumn,
    ];
  }, []);

  return [IssueDetailRootsGridColumns];
}
