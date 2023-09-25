//IssueTypes.ts

export interface IssueKind {}
export interface IssuePriority {}
export interface IssueStatus {}
export interface IRecord {
  isdId: number;
}

export interface IRoot extends IRecord {
  rootId: number;
  rootName: string;
  rootHomonymIndex: number;
  rootNote: string;
}
