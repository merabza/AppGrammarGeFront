//useIssuesFilterSort.ts

import { useCallback } from "react";
import { useCreateIssuesFilterSortMutation } from "../redux/api/issuesApi";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { issueDetailTableNames } from "./IssueDetailsEnums";
import {
  setIssueDetailsFilterSortId,
  setIssuesTableFilterSortId,
} from "../redux/slices/issuesSlice";
import {
  IFilterSortObject,
  ISortField,
} from "../appcarcass/common/GridViewTypes";

export type fncreateIssuesTableFilterSort = (
  sortFields: ISortField[] | null
) => void;
export type fncreateIssueDetailsFilterSort = (
  issueId: number,
  detName: string,
  sortFields: ISortField[] | null
) => void;

export function useIssuesFilterSort(): [
  fncreateIssuesTableFilterSort,
  fncreateIssueDetailsFilterSort,
  boolean
] {
  const { tabWindowId } = useAppSelector((state) => state.userState);
  const dispatch = useAppDispatch();

  const issuesTableName = "issues";

  const [createIssuesFilterSort] = useCreateIssuesFilterSortMutation();

  const createIssuesTableFilterSort = useCallback(
    async (sortFields: ISortField[] | null) => {
      const filterSortObject = {
        tabWindowId,
        tableName: issuesTableName,
        filterByFields: [] as ISortField[], //ToDo ფილტრები ჯერ არ არის რეალიზებული
        sortByFields: sortFields ?? ([] as ISortField[]),
      } as IFilterSortObject;
      await createIssuesFilterSort(filterSortObject);
      dispatch(setIssuesTableFilterSortId(filterSortObject));
    },
    [tabWindowId]
  );
  const createIssueDetailsFilterSort = useCallback(
    async (
      issueId: number,
      detName: string,
      sortFields: ISortField[] | null
    ) => {
      const filterSortObject = {
        tabWindowId,
        tableName: (issueDetailTableNames as any)[detName],
        filterByFields: [] as ISortField[], //ToDo ფილტრები ჯერ არ არის რეალიზებული
        sortByFields: sortFields ?? ([] as ISortField[]),
      };
      await createIssuesFilterSort(filterSortObject);
      dispatch(
        setIssueDetailsFilterSortId({
          filterSortObject,
          issueId,
          detailsName: detName,
        })
      );
    },
    [tabWindowId]
  );

  return [createIssuesTableFilterSort, createIssueDetailsFilterSort, false];
}
