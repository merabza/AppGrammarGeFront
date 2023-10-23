//issuesSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IIssue,
  OneIssueFullModel,
  IIssueDetailLine,
  IcheckDetailParameters,
  IssueDetailModel,
  IssueModel,
  IssueDetailByRootModel,
  IssueDetailByDerivationBranchModel,
  IssueDetailByInflectionModel,
} from "../types/issuesTypes";
import { issueDetailTypes } from "../../issues/IssueDetailsEnums";
import {
  IFilterSortObject,
  IRowsData,
} from "../../appcarcass/grid/GridViewTypes";

export interface IIssuesState {
  savedIssueDetailLine: IIssueDetailLine | null;
  issues: IIssue[];
  issuesRowsData: IRowsData;
  filterSortRepo: { [key: string]: IFilterSortObject };
  issuesRepo: OneIssueFullModel[];
  issuesDetailsRepo: { [key: string]: IRowsData }[];
  filterSortIds: { [key: string]: number };
  showIssueDetailRows: { [key: string]: number };
  loadingIssueDetailRows: { [key: string]: boolean };
  offsetsRepo: { [key: string]: number }[];
}

const initialState: IIssuesState = {
  savedIssueDetailLine: null,
  issues: [] as IIssue[],
  issuesRowsData: {} as IRowsData,
  filterSortRepo: {} as { [key: string]: IFilterSortObject },
  issuesRepo: [] as OneIssueFullModel[],
  issuesDetailsRepo: [] as { [key: string]: IRowsData }[],
  filterSortIds: {} as { [key: string]: number },
  showIssueDetailRows: {} as { [key: string]: number },
  loadingIssueDetailRows: {} as { [key: string]: boolean },
  offsetsRepo: [] as { [key: string]: number }[],
};

export interface setIssueDetailsFilterSortIdParams {
  filterSortObject: IFilterSortObject;
  issueId: number;
  detailsName: string;
}

export const issuesSlice = createSlice({
  initialState,
  name: "issuesSlice",
  reducers: {
    /////////////////////////////////////
    saveIssueDetailLine: (state, action: PayloadAction<IIssueDetailLine>) => {
      state.savedIssueDetailLine = action.payload;
    },
    /////////////////////////////////////
    setCheckDetail: (state, action: PayloadAction<IcheckDetailParameters>) => {
      const { issueId, detailsName, id, checkedValue } = action.payload;
      const detail = state.issuesDetailsRepo[issueId][detailsName].rows.find(
        (f) => f?.isdId === id
      );
      if (detail) {
        detail.checkedChanging = false;
        detail.checked = checkedValue;
      }
      //console.log("IssuesStore issueCheckingDetailSuccess changing=", false);
    },
    /////////////////////////////////////
    setIssuesTableFilterSortId: (
      state,
      action: PayloadAction<IFilterSortObject>
    ) => {
      const filterSortObject = action.payload;

      const { tableName } = filterSortObject;
      state.filterSortRepo[tableName] = filterSortObject;

      if (tableName in state.filterSortIds)
        state.filterSortIds[tableName] = state.filterSortIds[tableName] + 1;
      else state.filterSortIds[tableName] = 1;

      state.issues = [] as IIssue[];
    },
    /////////////////////////////////////
    setIssueDetailsFilterSortId: (
      state,
      action: PayloadAction<setIssueDetailsFilterSortIdParams>
    ) => {
      const { filterSortObject, issueId, detailsName } = action.payload;

      const { tableName } = filterSortObject;
      state.filterSortRepo[tableName] = filterSortObject;

      if (tableName in state.filterSortIds)
        state.filterSortIds[tableName] = state.filterSortIds[tableName] + 1;
      else state.filterSortIds[tableName] = 1;

      if (detailsName in state.issuesDetailsRepo)
        delete state.issuesDetailsRepo[issueId][detailsName];
    },
    /////////////////////////////////////
    setIssues: (state, action: PayloadAction<IssueModel[]>) => {
      state.issues = action.payload;
    },
    /////////////////////////////////////
    setIssuesRowsData: (state, action: PayloadAction<IRowsData>) => {
      state.issuesRowsData = action.payload;
    },
    /////////////////////////////////////
    setOneIssue: (state, action: PayloadAction<OneIssueFullModel>) => {
      const data = action.payload;
      const issId = data.issId;
      state.issuesRepo[issId] = data;
      state.offsetsRepo[issId] = {} as { [key: string]: number };
      state.issuesDetailsRepo[issId] = {} as {
        [key: string]: IRowsData;
      };
      Object.values(issueDetailTypes).forEach((detName) => {
        state.offsetsRepo[issId][detName] = 0;
      });
    },
    /////////////////////////////////////
    setOneIssueDetails: (
      state,
      action: PayloadAction<{
        issueId: number;
        detName: string;
        data: IRowsData;
      }>
    ) => {
      const { issueId, detName, data } = action.payload;
      state.issuesDetailsRepo[issueId][detName] = data;
      state.loadingIssueDetailRows[detName] = false;
    },
    /////////////////////////////////////
    changeIssueDetailsOffsetAndShowRows: (
      state,
      action: PayloadAction<{
        issueId: number;
        detailsName: string;
        offset: number;
        showRows: number;
      }>
    ) => {
      const { issueId, detailsName, offset, showRows } = action.payload;
      state.showIssueDetailRows[detailsName] = showRows;
      state.offsetsRepo[issueId][detailsName] = offset;
    },
    /////////////////////////////////////
  },
});

export default issuesSlice.reducer;

export const {
  saveIssueDetailLine,
  setIssuesTableFilterSortId,
  setCheckDetail,
  setIssues,
  setIssuesRowsData,
  changeIssueDetailsOffsetAndShowRows,
  setOneIssueDetails,
  setIssueDetailsFilterSortId,
  setOneIssue,
} = issuesSlice.actions;
