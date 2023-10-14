//Issues.tsx

import { useEffect, useMemo, useCallback, FC, useState } from "react";
import { useAppSelector } from "../appcarcass/redux/hooks";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import { IssueKind, IssuePriority, IssueStatus } from "./IssueTypes";
import { useLocation } from "react-router-dom";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import Loading from "../appcarcass/common/Loading";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import { useAlert } from "../appcarcass/hooks/useAlert";
import AlertMessages from "../appcarcass/common/AlertMessages";
import {
  useGetIssuesCountQuery,
  useLazyGetissuesRowsDataQuery,
} from "../redux/api/issuesApi";
import CustomColumn from "./CustomColumn";
import LinkColumn from "./LinkColumn";
import MdLookupColumn from "../appcarcass/grid/MdLookupColumn";
import DateTimeColumn from "./DateTimeColumn";
// import { useCheckLoadIssues } from "./useCheckLoadIssues";
import { useIssuesFilterSort } from "./useIssuesFilterSort";
import {
  IFilterSortRequest,
  IGridColumn,
  IRowsData,
} from "../appcarcass/grid/GridViewTypes";
import GridViewOld from "../appcarcass/grid/GridViewOld";
import GridView from "../appcarcass/grid/GridView";

const Issues: FC = () => {
  // const {
  //   alert,
  //   isMenuLoading,
  //   flatMenu,
  //   masterData,
  //   insideChanging,
  //   checkLoadMdTables,
  //   issuesLoading,
  //   issues,
  //   issuesCount,
  //   issuesLoadingFailure,
  //   loadIssues,
  //   getIssuesCount,
  //   createIssuesFilterSort,
  //   tabWindowId,
  // } = props;

  // const dispatch = useAppDispatch();

  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );
  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  // const { insideChanging } = useAppSelector((state) => state.issuesState);
  // const masterData = useAppSelector((state) => state.masterDataState);
  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const issueKinds = mdRepo.issueKinds as IssueKind[];
  const issuePriorities = mdRepo.issuePriorities as IssuePriority[];
  const issueStatuses = mdRepo.issueStatuses as IssueStatus[];

  // const { insideChanging, issuesLoading, issues, issuesCount, issuesLoadingFailure } = state.issuesStore;

  const { issues } = useAppSelector((state) => state.issuesState);

  // const [checkLoadIssues, LoadingIssues] = useCheckLoadIssues();

  const [
    getIssuesRowsData,
    { data: curRowsData, isLoading: loadingIssuesRowsData },
  ] = useLazyGetissuesRowsDataQuery();

  // const [curRowsData, setCurRowsData] = useState<IRowsData | undefined>(
  //   undefined
  // );

  //console.log("Issues props=", props);

  const menLinkKey = useLocation().pathname.split("/")[1];

  const tableNamesForLoad = useMemo(
    () => ["issueKinds", "issuePriorities", "issueStatuses"],
    []
  );

  const { isMenuLoading, flatMenu } = useAppSelector(
    (state) => state.navMenuState
  );

  const [checkLoadMdTables] = useCheckLoadMdTables();
  const { data: issuesCount, isLoading: issuesCountLoading } =
    useGetIssuesCountQuery();

  const isValidPage = useCallback(() => {
    if (!flatMenu) {
      return false;
    }
    return flatMenu.find((f) => f.menLinkKey === menLinkKey);
  }, [flatMenu, menLinkKey]);

  useEffect(() => {
    const menuItem = isValidPage();
    if (!menuItem) return;

    checkLoadMdTables(tableNamesForLoad);
    // getIssuesCount();
  }, [isMenuLoading, flatMenu, tableNamesForLoad]);

  // const [curscrollTo, backLigth] = useScroller({
  //   tabKey: props.match.params.tabKey,
  //   recName: NzInt(props.match.params.recName)
  // });

  // const [createIssuesFilterSort] = useCreateIssuesFilterSortMutation();

  const [createIssuesTableFilterSort, createIssueDetailsFilterSort] =
    useIssuesFilterSort();

  const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

  if (ApiLoadHaveErrors)
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );

  if (
    mdWorkingOnLoad ||
    isMenuLoading ||
    mdWorkingOnLoadingTables ||
    issuesCountLoading
  ) {
    return <Loading />;
  }

  //|| !curscrollTo
  if (
    !issueKinds ||
    !issuePriorities ||
    !issueStatuses ||
    !dataTypes ||
    !issuesCount
  ) {
    return (
      <div>
        <h5>ინფორმაციის ჩატვირთვის პრობლემა!</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  // const derivationTypesDataType = datatypes.find(f=>f.dtTable === "derivationTypes");
  // const derivationFormulasDataType = datatypes.find(f=>f.dtTable === "derivationFormulas");

  const gridColumns = [
    {
      caption: "#",
      visible: true,
      sortable: true,
      fieldName: "issId",
      isKey: true,
      control: (
        <CustomColumn
          onGetCell={(value?: string) => {
            return <span>#{value}</span>;
          }}
        >
          {" "}
        </CustomColumn>
      ),
    },
    {
      caption: "სათაური",
      visible: true,
      sortable: true,
      fieldName: "issTitle",
      control: (
        <LinkColumn linkBase="issuework" idFieldName="issId"></LinkColumn>
      ),
    },
    {
      caption: "ტიპი",
      visible: true,
      sortable: true,
      fieldName: "issueKindId",
      control: (
        <MdLookupColumn
          dataTable={issueKinds}
          valueMember="iskId"
          displayMember="iskName"
        ></MdLookupColumn>
      ),
    },
    {
      caption: "პრიორიტეტი",
      visible: true,
      sortable: true,
      fieldName: "issuePriorityId",
      control: (
        <MdLookupColumn
          dataTable={issuePriorities}
          valueMember="ispId"
          displayMember="ispName"
        ></MdLookupColumn>
      ),
    },
    {
      caption: "სტატუსი",
      visible: true,
      sortable: true,
      fieldName: "issueStatusId",
      control: (
        <MdLookupColumn
          dataTable={issueStatuses}
          valueMember="istId"
          displayMember="istName"
        ></MdLookupColumn>
      ),
    },
    {
      caption: "ავტორი",
      visible: true,
      sortable: true,
      fieldName: "issCreatorUserName",
    },
    {
      caption: "მიწერა",
      visible: true,
      sortable: true,
      fieldName: "issAssignedUserName",
    },
    {
      caption: "ძ",
      visible: true,
      sortable: true,
      fieldName: "rootsDetailsCount",
    },
    {
      caption: "დ",
      visible: true,
      sortable: true,
      fieldName: "derivationBranchesDetailsCount",
    },
    {
      caption: "ფ",
      visible: true,
      sortable: true,
      fieldName: "inflectionsDetailsCount",
    },
    { caption: "-", visible: true, sortable: true, fieldName: "detailsCount" },
    {
      caption: "შექმნა",
      visible: true,
      sortable: true,
      fieldName: "issCreateDate",
      control: <DateTimeColumn showDate showTime></DateTimeColumn>,
    },
    {
      caption: "განახლება",
      visible: true,
      sortable: true,
      fieldName: "IssUpdateDate",
      control: <DateTimeColumn showDate showTime></DateTimeColumn>,
    },
  ] as IGridColumn[];

  // return (
  //   <div>
  //     <GridViewOld
  //       showCountColumn
  //       columns={gridColumns}
  //       rows={issues}
  //       allRowsCount={issuesCount}
  //       onLoad={(offset, rowsCount) => checkLoadIssues(offset, rowsCount)}
  //       onFilterSortChange={(sortFields) =>
  //         createIssuesTableFilterSort(sortFields)
  //       }
  //       loading={LoadingIssues}
  //     ></GridViewOld>
  //     {/* {insideChanging && <span>&frasl;</span>} */}
  //   </div>
  // );

  return (
    <div>
      <GridView
        showCountColumn
        columns={gridColumns}
        rowsData={curRowsData}
        onLoadRows={(offset, rowsCount, sortByFields, filterFields) => {
          getIssuesRowsData({
            offset,
            rowsCount,
            filterFields,
            sortByFields,
          } as IFilterSortRequest);
        }}
        loading={loadingIssuesRowsData}
      ></GridView>
      {/* {insideChanging && <span>&frasl;</span>} */}
    </div>
  );
};

export default Issues;
