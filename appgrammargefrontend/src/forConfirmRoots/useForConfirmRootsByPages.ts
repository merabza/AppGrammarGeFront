//useForConfirmRootsByPages.ts

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { createUrlForConfirmRoots } from "./ForConfirmRootsListModule";
import {
  useLazyGetForConfirmRootsByPagesQuery,
  useLazyGetForConfirmRootsCountQuery,
} from "../redux/api/rootsApi";
import {
  SetForConfirmRootsByPages,
  SetForConfirmRootsByPagesPayloadType,
  SetForConfirmRootsListPageLoading,
  SetMemoForConfirmRootsCounts,
} from "../redux/slices/rootsSlice";
import { RootLinkQueryModel } from "../derivationTreeEditor/TypesAndSchemas/InflectionDataTypeAndSchema";

export type fnCheckForConfirmRootsByPages = (
  rootStartsWith: string | null | undefined,
  createdUserName: string | null | undefined,
  itemsPerPage: number,
  pageNom: number,
  pagekey: string
) => void;

export function useForConfirmRootsByPages(): [fnCheckForConfirmRootsByPages] {
  const dispatch = useAppDispatch();

  const { memoForConfirmRootsCounts, memoForConfirmRootsPages } =
    useAppSelector((state) => state.rootsState);

  const [getForConfirmRootsCount] = useLazyGetForConfirmRootsCountQuery();
  const [getForConfirmRootsByPages] = useLazyGetForConfirmRootsByPagesQuery();

  const CheckForConfirmRootsByPages = useCallback(
    async (
      rootStartsWith: string | null | undefined,
      createdUserName: string | null | undefined,
      itemsPerPage: number,
      pageNom: number,
      pagekey: string
    ) => {
      dispatch(SetForConfirmRootsListPageLoading(true));

      const val = `${rootStartsWith}_${createdUserName}`;
      //შევამოწმოთ შესაბამისი რაოდენობა ჩატვირთულია თუ არა
      if (!memoForConfirmRootsCounts[val]) {
        const url = createUrlForConfirmRoots(
          "",
          rootStartsWith,
          createdUserName
        );
        //console.log('DerivationTreeStore.js apiClient.Get', url);
        const count = await getForConfirmRootsCount(url).unwrap();
        dispatch(SetMemoForConfirmRootsCounts({ val, count }));
      }

      //შევამოწმოთ შესაბამისი გვერდი ჩატვირთულია თუ არა
      if (!memoForConfirmRootsPages[pagekey]) {
        const url = createUrlForConfirmRoots(
          `/${itemsPerPage}/${pageNom}`,
          rootStartsWith,
          createdUserName
        );
        // console.log(
        //   "useForConfirmRootsByPages CheckForConfirmRootsByPages url=",
        //   url
        // );
        const ForConfirmRootDataArray = (await getForConfirmRootsByPages(
          url
        ).unwrap()) as RootLinkQueryModel[];
        // console.log(
        //   "useForConfirmRootsByPages CheckForConfirmRootsByPages pagekey=",
        //   pagekey
        // );
        // console.log(
        //   "useForConfirmRootsByPages CheckForConfirmRootsByPages ForConfirmRootDataArray=",
        //   ForConfirmRootDataArray
        // );
        dispatch(
          SetForConfirmRootsByPages({
            pagekey,
            ForConfirmRootDataArray,
          } as SetForConfirmRootsByPagesPayloadType)
        );
      }

      dispatch(SetForConfirmRootsListPageLoading(false));
    },
    []
  );

  return [CheckForConfirmRootsByPages];
}
