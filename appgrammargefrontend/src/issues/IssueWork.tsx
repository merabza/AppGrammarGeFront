//IssueWork.tsx

import { useState, useEffect, FC } from "react";

import moment from "moment";
import { useParams } from "react-router-dom";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { useCheckLoadOneIssueById } from "./useCheckLoadOneIssueById";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import {
  issueDetailTableNames,
  issueDetailTypes,
  issueDetailTypesGeoNames,
} from "./IssueDetailsEnums";
import { changeIssueDetailsOffsetAndShowRows } from "../redux/slices/issuesSlice";
import {
  useCheckDetailMutation,
  useLazyLoadIssueDetailsQuery,
} from "../redux/api/issuesApi";
import { useIssuesFilterSort } from "./useIssuesFilterSort";
import { useIssueDetailRootsGridColumns } from "./IssueDetailRootsGridColumns";
import { useIssueDetailNotesGridColumns } from "./IssueDetailNotesGridColumns";
import { useIssueDetailDerivationBranchesGridColumns } from "./IssueDetailDerivationBranchesGridColumns";
import { useIssueDetailInflectionsGridColumns } from "./IssueDetailInflectionsGridColumns";
import { IGridColumn, IGridScrollTo } from "../appcarcass/grid/GridViewTypes";
import GridViewOld from "../appcarcass/grid/GridViewOld";

const IssueWork: FC = () => {
  const dispatch = useAppDispatch();

  const [curIssueIdVal, setCurIssueIdVal] = useState<number | null>(null); //1. იდენტიფიკატორი

  const { issueId } = useParams<string>();

  const { tabWindowId } = useAppSelector((state) => state.userState);

  const {
    issuesRepo,
    issuesDetailsRepo,
    showIssueDetailRows,
    loadingIssueDetailRows,
    filterSortRepo,
    filterSortIds,
    savedIssueDetailLine,
    offsetsRepo,
  } = useAppSelector((state) => state.issuesState);

  const [curscrollTo, backLigth] = useScroller(savedIssueDetailLine);

  const [loadIssueDetails] = useLazyLoadIssueDetailsQuery();

  const [, createIssueDetailsFilterSort] = useIssuesFilterSort();

  const [checkLoadOneIssueById, oneIssueLoading] = useCheckLoadOneIssueById();
  const [checkDetail] = useCheckDetailMutation();
  const [IssueDetailRootsGridColumns] = useIssueDetailRootsGridColumns();
  const [IssueDetailNotesGridColumns] = useIssueDetailNotesGridColumns();
  const [IssueDetailDerivationBranchesGridColumns] =
    useIssueDetailDerivationBranchesGridColumns();
  const [IssueDetailInflectionsGridColumns] =
    useIssueDetailInflectionsGridColumns();
  //7. იდენტიფიკატორის ეფექტი
  useEffect(() => {
    const issueIdVal = issueId ? parseInt(issueId) : 0;
    // console.log("IssueWork useEffect issueIdVal=", issueIdVal);
    // console.log("IssueWork useEffect curIssueIdVal=", curIssueIdVal);

    //ვამოწმებთ მისამართში შეიცვალა თუ არა იდენტიფიკატორი
    if (curIssueIdVal !== issueIdVal) {
      //შეცვლილა
      //დავიმახსოვროთ შეცვლილი იდენტიფიკატორი
      setCurIssueIdVal(issueIdVal);
      if (issueIdVal) {
        //თუ იდენტიფიკატორი კარგია, ჩავტვირთოთ ბაზიდან ინფორმაცია
        checkLoadOneIssueById(issueIdVal);
        return;
      }
      return;
    }
  }, [curIssueIdVal, issueId]);

  if (oneIssueLoading) {
    return <Loading />;
  }

  // console.log("IssueWork curIssueIdVal=", curIssueIdVal);
  // console.log("IssueWork issuesRepo=", issuesRepo);
  // console.log("IssueWork issuesDetailsRepo=", issuesDetailsRepo);

  if (
    !curIssueIdVal ||
    !issuesRepo ||
    !issuesRepo[curIssueIdVal] ||
    !offsetsRepo ||
    !offsetsRepo[curIssueIdVal] ||
    !issuesDetailsRepo ||
    !issuesDetailsRepo[curIssueIdVal]
  ) {
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  const oneIssueOffsets = offsetsRepo[curIssueIdVal];
  const oneIssue = issuesRepo[curIssueIdVal];
  const oneIssuesDetails = issuesDetailsRepo[curIssueIdVal];

  //console.log("IssueWork issuesRepo[curIssueIdVal]=", issuesRepo[curIssueIdVal]);
  // console.log("IssueWork oneIssueOffsets=", oneIssueOffsets);
  // console.log("IssueWork oneIssue=", oneIssue);
  // console.log("IssueWork oneIssuesDetails=", oneIssuesDetails);

  const strFormat = "YYYY-MM-DDTHH:mm:ss";

  const detailsGridColumns = {} as { [key: string]: IGridColumn[] };

  detailsGridColumns[issueDetailTypes.roots] =
    IssueDetailRootsGridColumns(curIssueIdVal);

  detailsGridColumns[issueDetailTypes.notes] =
    IssueDetailNotesGridColumns(curIssueIdVal);

  detailsGridColumns[issueDetailTypes.derivationBranches] =
    IssueDetailDerivationBranchesGridColumns(curIssueIdVal);

  detailsGridColumns[issueDetailTypes.inflections] =
    IssueDetailInflectionsGridColumns(curIssueIdVal);

  return (
    <div>
      <h5>
        <strong>საკითხი:</strong> #{oneIssue.issId}-{oneIssue.issTitle}
      </h5>
      <h6>
        <strong>ავტორი: </strong> {oneIssue.issCreatorUserName}.
        <strong> მიწერა: </strong>{" "}
        {oneIssue.issAssignedUserName ?? "საკითხი არავისზე არ არის მიწერილი"}
        <strong> შეიქმნა: </strong>{" "}
        {moment(oneIssue.issCreateDate).format(strFormat)}.
        <strong> განახლება: </strong>{" "}
        {moment(oneIssue.issUpdateDate).format(strFormat)}.
      </h6>
      {!!oneIssue.issDescription && (
        <p>
          <strong> მოკლე აღწერა: </strong>
          {oneIssue.issDescription}
        </p>
      )}
      <p>
        <strong> საკითხის ტიპი: </strong>
        {oneIssue.issueKindName}
        <strong> პრიორიტეტი: </strong>
        {oneIssue.issuePriorityName}
        <strong> სტატუსი: </strong>
        {oneIssue.issueStatusName}
      </p>

      {Object.values(issueDetailTypes)
        .filter((f) => oneIssue.detailsCounts[f])
        .map((detName) => {
          return (
            <div key={detName}>
              <p>
                <span>
                  <strong>
                    {" "}
                    {(issueDetailTypesGeoNames as any)[detName]}:{" "}
                  </strong>
                  {oneIssue.detailsCounts[detName]}
                </span>
              </p>
              <GridViewOld
                showCountColumn
                columns={detailsGridColumns[detName]}
                rows={oneIssuesDetails[detName]}
                offset={oneIssueOffsets[detName]}
                showRows={showIssueDetailRows[detName]}
                allRowsCount={oneIssue.detailsCounts[detName]}
                onChangeOffsetAndShowRows={(offset, showRows) =>
                  dispatch(
                    changeIssueDetailsOffsetAndShowRows({
                      issueId: curIssueIdVal,
                      detailsName: detName,
                      offset,
                      showRows,
                    })
                  )
                }
                onLoad={(offset, rowsCount) =>
                  loadIssueDetails({
                    issueId: curIssueIdVal,
                    detailsName: detName,
                    tabWindowId,
                    offset,
                    rowsCount,
                  })
                }
                onFilterSortChange={(sortFields) =>
                  createIssueDetailsFilterSort(
                    curIssueIdVal,
                    detName,
                    sortFields
                  )
                }
                loading={loadingIssueDetailRows[detName]}
                filterSortObject={
                  filterSortRepo[(issueDetailTableNames as any)[detName]]
                }
                filterSortId={
                  filterSortIds[(issueDetailTableNames as any)[detName]]
                }
                curscrollTo={
                  curscrollTo?.detailsName === detName
                    ? ({ index: curscrollTo.index } as IGridScrollTo)
                    : undefined
                }
                backLigth={backLigth}
              ></GridViewOld>
            </div>
          );
        })}
    </div>
  );
};

export default IssueWork;
