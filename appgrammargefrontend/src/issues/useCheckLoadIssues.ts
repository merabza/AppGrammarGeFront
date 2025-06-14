//useCheckLoadIssues.ts

import { useCallback } from "react";
import { useAppSelector } from "../appcarcass/redux/hooks";
import { useLazyGetissuesQuery } from "../redux/api/issuesApi";

export type fnLoadIssues = (offset: number, rowsCount: number) => void;

export function useCheckLoadIssues(): [fnLoadIssues, boolean] {
    const { issues } = useAppSelector((state) => state.issuesState);

    const [getIssues, { isLoading: LoadingIssues }] = useLazyGetissuesQuery();
    const { tabWindowId } = useAppSelector((state) => state.userState);

    const checkLoadIssues = useCallback(
        async (offset: number, rowsCount: number) => {
            // console.log(
            //   "useCheckLoadIssues checkLoadIssues modelDataState.Issues checked"
            // );

            await getIssues({
                tabWindowId,
                offset,
                rowsCount,
            });

            // console.log(
            //   "useCheckLoadIssues checkLoadIssues finished"
            // );
        },
        [issues, LoadingIssues]
    );

    return [checkLoadIssues, LoadingIssues];
}
