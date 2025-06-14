//useCheckLoadOneIssueById.ts

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { useLazyGetOneIssueByIdQuery } from "../redux/api/issuesApi";
import type { OneIssueFullModel } from "../redux/types/issuesTypes";
import { setOneIssue } from "../redux/slices/issuesSlice";

export type fnLoadOneIssueById = (issueId: number) => void;

export function useCheckLoadOneIssueById(): [fnLoadOneIssueById, boolean] {
    const { issuesRepo } = useAppSelector((state) => state.issuesState);
    const dispatch = useAppDispatch();

    const [getOneIssueById, { isLoading: oneIssueLoading }] =
        useLazyGetOneIssueByIdQuery();

    const checkLoadOneIssueById = useCallback(
        async (issueId: number) => {
            // console.log(
            //   "useCheckLoadOneIssueById checkLoadOneIssueById issueId=",
            //   issueId
            // );
            if (oneIssueLoading || issuesRepo[issueId]) return; //წესით ასეი შემთხვევა არ უნდა მოხდეს, მაგრამ მაინც

            const result = await getOneIssueById(issueId);
            const data = result.data as OneIssueFullModel;

            // console.log("useCheckLoadOneIssueById checkLoadOneIssueById data=", data);

            dispatch(setOneIssue(data));

            // console.log("useCheckLoadOneIssueById checkLoadOneIssueById finished");
        },
        [issuesRepo, oneIssueLoading]
    );

    return [checkLoadOneIssueById, oneIssueLoading];
}
