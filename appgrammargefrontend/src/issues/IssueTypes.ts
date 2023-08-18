//IssueTypes.ts

export interface IssueKind {}
export interface IssuePriority {}
export interface IssueStatus {}
export interface IRecord {
  isdId: number;
}

export interface IGridColumn {
  caption: string;
  visible: boolean;
  sortable: boolean;
  fieldName: string;
  isKey: boolean;
  control: React.ReactNode;
  changingFieldName: string;
}

export interface IGridScrollTo {
  index: number;
}

export interface IFilterSortObject {
  tabWindowId: number;
  filterByFields: ISortField[];
  sortByFields: ISortField[];
  tableName: string;
}

export interface ISortField {
  fieldName: string;
  ascending: boolean;
}

export interface IRoot extends IRecord {
  rootId: number;
  rootName: string;
  rootHomonymIndex: number;
  rootNote: string;
}
