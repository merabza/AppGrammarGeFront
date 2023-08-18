//issuesTypes.ts

export interface IIssue {}

export interface OneIssueFullModel {
  issId: number;
  issTitle: string;
  issDescription: string | null;
  issCreateDate: string;
  issUpdateDate: string;
  issCreatorUserName: string;
  issAssignedUserName: string | null;
  issueKindName: string;
  issuePriorityName: string;
  issueStatusName: string;
  detailsCounts: { [key: string]: number };
}

export interface IIssueDetailLine {
  issueId: number;
  detailsName: string;
  isdId: number;
  index: number;
  offset: number;
  showRows: number;
}

export interface IcheckDetailParameters {
  issueId: number;
  detailsName: string;
  id: number;
  checkedValue: boolean;
}

export interface IssueDetailModel {
  isdId: number;
  note: string | null;
  checked: boolean;
  checkedChanging: boolean;
}

export interface IssueModel {
  issId: number;
  issTitle: string;
  issDescription: string | null;
  issCreateDate: string;
  issUpdateDate: string;
  issCreatorUserName: string;
  issAssignedUserName: string | null;
  issueKindId: number;
  issuePriorityId: number;
  issueStatusId: number;
  rootsDetailsCount: number;
  derivationBranchesDetailsCount: number;
  inflectionsDetailsCount: number;
  detailsCount: number;
}

export interface IssueDetailByDerivationBranchModel extends IssueDetailModel {
  derivationBranchId: number | null;
  dbrBaseName: string | null;
  roots: RootModel[];
}

export interface RootModel {
  rootId: number;
  rootName: string | null;
  rootHomonymIndex: number;
  rootNote: string | null;
}

export interface IssueDetailByInflectionModel extends IssueDetailModel {
  inflectionId: number | null;
  infName: string | null;
  infSamples: string | null;
  derivationBranches: DerivationBranchModel[];
}

export interface DerivationBranchModel {
  derivationBranchId: number;
  dbrBaseName: string | null;
  rootId: number;
  rootName: string | null;
  rootHomonymIndex: number;
  rootNote: string | null;
}

export interface IssueDetailByRootModel extends IssueDetailModel {
  rootId: number | null;
  rootName: string;
  rootHomonymIndex: number;
  rootNote: string | null;
}
