//useBasesByPages.js

import { useCallback } from "react";

import { useAppDispatch } from "../../appcarcass/redux/hooks";
import { useLazyGetBasesByPagesQuery } from "../../redux/api/rootsApi";
import {
  SetBasesForDropdown,
  SetBasesForDropdownloading,
  SetBasesPageLoading,
  setBasesPayloadType,
} from "../../redux/slices/rootsSlice";
import { BasesByPagesResponse } from "../../redux/types/rootsTypes";

export type fnloadBasesByPages = (
  baseName: string,
  itemsPerPage: number,
  pageNom: number,
  pagekey: string
) => void;

export function useBasesByPages(): [fnloadBasesByPages] {
  const dispatch = useAppDispatch();

  const [getBasesByPages] = useLazyGetBasesByPagesQuery();

  const loadBasesByPages = useCallback(
    async (
      baseName: string,
      itemsPerPage: number,
      pageNom: number,
      pagekey: string
    ) => {
      dispatch(SetBasesPageLoading(true));

      const result = await getBasesByPages({
        searchValue: baseName,
        itemsPerPage,
        pageNom,
      });
      // console.log("result.data=", result.data);
      const data = result.data as BasesByPagesResponse;
      const payload = { pagekey, data: data.baseLinks } as setBasesPayloadType;
      dispatch(SetBasesForDropdown(payload));

      dispatch(SetBasesForDropdownloading(false));
      return pagekey;
    },
    [dispatch, getBasesByPages]
  );

  return [loadBasesByPages];
}
