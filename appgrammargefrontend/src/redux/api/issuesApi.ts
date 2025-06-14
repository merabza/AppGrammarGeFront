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
    setIssuesRowsData,
    setOneIssueDetails,
} from "../slices/issuesSlice";
import type {
    IcheckDetailParameters,
    IssueModel,
    OneIssueFullModel,
} from "../types/issuesTypes";
import type {
    IFilterSortObject,
    IFilterSortRequest,
    IRowsData,
} from "../../appcarcass/grid/GridViewTypes";

export interface IloadIssueDetailsParameters {
    issueId: number;
    detailsName: string;
    tabWindowId: number;
    offset: number;
    rowsCount: number;
}

export interface IGetIssueDetailsRowsDataParameters {
    issueId: number;
    detName: string;
    filterSortRequest: IFilterSortRequest;
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
        getissuesRowsData: builder.query<IRowsData, IFilterSortRequest>({
            query(filterSortRequest) {
                // console.log("getissuesRowsData filterSortRequest=", filterSortRequest);
                // console.log(
                //   "getissuesRowsData JSON.stringify(filterSortRequest)=",
                //   JSON.stringify(filterSortRequest)
                // );
                // console.log(
                //   "getissuesRowsData btoa(JSON.stringify(filterSortRequest)=",
                //   btoa(JSON.stringify(filterSortRequest))
                // );
                return {
                    url: `/issues/getissuesrowsdata?filterSortRequest=${btoa(
                        JSON.stringify(filterSortRequest)
                    )}`,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // console.log(
                    //   "getissuesRowsData onQueryStarted queryFulfilled data=",
                    //   data
                    // );
                    dispatch(setIssuesRowsData(data));
                } catch (error) {
                    dispatch(setAlertApiLoadError(buildErrorMessage(error)));
                }
            },
        }),
        //////////////////////////////////////////////////////
        getIssueDetailsRowsData: builder.query<
            IRowsData,
            IGetIssueDetailsRowsDataParameters
        >({
            query(args) {
                //console.log("getIssueDetailsRowsData args=", args);
                const { issueId, detName, filterSortRequest } = args;

                // console.log(
                //   "getissuesRowsData JSON.stringify(filterSortRequest)=",
                //   JSON.stringify(filterSortRequest)
                // );
                // console.log(
                //   "getissuesRowsData btoa(JSON.stringify(filterSortRequest)=",
                //   btoa(JSON.stringify(filterSortRequest))
                // );
                return {
                    url: `/issues/getissuedetailsrowsdata/${issueId}/${detName}?filterSortRequest=${btoa(
                        JSON.stringify(filterSortRequest)
                    )}`,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { issueId, detName } = args;
                    const { data } = await queryFulfilled;
                    // console.log("issuesApi getIssueDetailsRowsData data=", data);
                    dispatch(setOneIssueDetails({ issueId, detName, data }));
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
            async onQueryStarted(
                filterSortObject,
                { dispatch, queryFulfilled }
            ) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
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
        // //////////////////////////////////////////////////////
        checkDetail: builder.mutation<void, IcheckDetailParameters>({
            query({ detailsName, id, checkedValue }) {
                return {
                    url: `/issues/checkdetail/${detailsName}/${id}/${checkedValue}`,
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
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
                }
            },
        }),
        //////////////////////////////////////////////////////
    }),
});

export const {
    useGetIssuesCountQuery,
    useLazyGetissuesQuery,
    useLazyGetissuesRowsDataQuery,
    useLazyGetIssueDetailsRowsDataQuery,
    useCreateIssuesFilterSortMutation,
    useLazyGetOneIssueByIdQuery,
    useCheckDetailMutation,
    // useLazyLoadIssueDetailsQuery,
} = issuesApi;
