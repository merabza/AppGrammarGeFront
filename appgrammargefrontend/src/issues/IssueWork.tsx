//IssueWork.tsx

import { useState, useEffect, FC } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { useAppSelector } from "../appcarcass/redux/hooks";
import { useCheckLoadOneIssueById } from "./useCheckLoadOneIssueById";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import {
  issueDetailTypes,
  issueDetailTypesGeoNames,
} from "./IssueDetailsEnums";
import { useLazyGetIssueDetailsRowsDataQuery } from "../redux/api/issuesApi";
import { useIssueDetailRootsGridColumns } from "./IssueDetailRootsGridColumns";
import { useIssueDetailNotesGridColumns } from "./IssueDetailNotesGridColumns";
import { useIssueDetailDerivationBranchesGridColumns } from "./IssueDetailDerivationBranchesGridColumns";
import { useIssueDetailInflectionsGridColumns } from "./IssueDetailInflectionsGridColumns";
import { IGridColumn } from "../appcarcass/grid/GridViewTypes";
import GridView from "../appcarcass/grid/GridView";

const IssueWork: FC = () => {
  const [curIssueIdVal, setCurIssueIdVal] = useState<number | null>(null); //1. იდენტიფიკატორი

  const { issueId } = useParams<string>();

  const {
    issuesRepo,
    issuesDetailsRepo,
    loadingIssueDetailRows,
    savedIssueDetailLine,
    offsetsRepo,
  } = useAppSelector((state) => state.issuesState);

  const [curscrollTo, backLigth] = useScroller(savedIssueDetailLine);

  const [getIssueDetailsRowsData, { isLoading: loadingIssueDetails }] =
    useLazyGetIssueDetailsRowsDataQuery();

  const [checkLoadOneIssueById, oneIssueLoading] = useCheckLoadOneIssueById();
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

  if (loadingIssueDetails || oneIssueLoading) {
    return <Loading />;
  }

  // console.log("IssueWork curIssueIdVal=", curIssueIdVal);
  // console.log("IssueWork issuesRepo=", issuesRepo);
  console.log("IssueWork issuesDetailsRepo=", issuesDetailsRepo);

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

  const oneIssue = issuesRepo[curIssueIdVal];
  const oneIssuesDetails = issuesDetailsRepo[curIssueIdVal];

  //console.log("IssueWork issuesRepo[curIssueIdVal]=", issuesRepo[curIssueIdVal]);
  // console.log("IssueWork oneIssueOffsets=", oneIssueOffsets);
  // console.log("IssueWork oneIssue=", oneIssue);
  console.log("IssueWork oneIssuesDetails=", oneIssuesDetails);

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
              <GridView
                showCountColumn
                columns={detailsGridColumns[detName]}
                rowsData={oneIssuesDetails[detName]}
                onLoadRows={(offset, rowsCount, sortByFields, filterFields) =>
                  getIssueDetailsRowsData({
                    issueId: curIssueIdVal,
                    detName: detName,
                    filterSortRequest: {
                      offset,
                      rowsCount,
                      filterFields,
                      sortByFields,
                    },
                  })
                }
                loading={loadingIssueDetails || loadingIssueDetailRows[detName]}
                backLigth={backLigth}
              ></GridView>
            </div>
          );
        })}
    </div>
  );
};

export default IssueWork;
