//issuesApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import {
  setCheckDetail,
  setIssues,
  setOneIssueDetails,
} from "../slices/issuesSlice";
import {
  IcheckDetailParameters,
  IssueModel,
  OneIssueFullModel,
} from "../types/issuesTypes";
import { IFilterSortObject } from "../../appcarcass/common/GridViewTypes";

export interface IloadIssueDetailsParameters {
  issueId: number;
  detailsName: string;
  tabWindowId: number;
  offset: number;
  rowsCount: number;
}

export const issuesApi = createApi({
  reducerPath: "issuesApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    getIssuesCount: builder.query<number, void>({
      query() {
        return {
          url: "/issues/getissuescount",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    getissues: builder.query<
      IssueModel[],
      { tabWindowId: number; offset: number; rowsCount: number }
    >({
      query({ tabWindowId, offset, rowsCount }) {
        return {
          url: `/issues/getissues/${tabWindowId}/${offset}/${rowsCount}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setIssues(data));
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    createIssuesFilterSort: builder.mutation<void, IFilterSortObject>({
      query(filterSortObject) {
        return {
          url: `/issues/createfiltersort`,
          method: "POST",
          body: filterSortObject,
        };
      },
      async onQueryStarted(filterSortObject, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    getOneIssueById: builder.query<OneIssueFullModel, number>({
      query(issueId) {
        return {
          url: `/issues/getoneissue/${issueId}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          // const result =
          await queryFulfilled;
          //console.log("issuesApi getOneIssueById result=", result);
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    loadIssueDetails: builder.query<any[], IloadIssueDetailsParameters>({
      query(args) {
        const { issueId, detailsName, tabWindowId, offset, rowsCount } = args;
        return {
          url: `/issues/getdetails/${issueId}/${detailsName}/${tabWindowId}/${offset}/${rowsCount}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { issueId, detailsName, offset } = args;
          const { data } = await queryFulfilled;
          // console.log("issuesApi loadIssueDetails data=", data);
          dispatch(setOneIssueDetails({ issueId, detailsName, offset, data }));
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    checkDetail: builder.mutation<void, IcheckDetailParameters>({
      query({ issueId, detailsName, id, checkedValue }) {
        return {
          url: `/issues/checkdetail/${issueId}/${detailsName}/${id}/${checkedValue}`,
          method: "PATCH",
        };
      },
      async onQueryStarted(
        { issueId, detailsName, id, checkedValue },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            setCheckDetail({
              issueId,
              detailsName,
              id,
              checkedValue,
            })
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
  }),
});

export const {
  useGetIssuesCountQuery,
  useLazyGetissuesQuery,
  useCreateIssuesFilterSortMutation,
  useLazyGetOneIssueByIdQuery,
  useCheckDetailMutation,
  useLazyLoadIssueDetailsQuery,
} = issuesApi;
