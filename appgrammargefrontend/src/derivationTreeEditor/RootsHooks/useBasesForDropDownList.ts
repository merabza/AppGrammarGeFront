//useBasesForDropDownList.ts

import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../appcarcass/redux/hooks";
import { useLazyGetBasesByPagesQuery } from "../../redux/api/rootsApi";
import {
  SetBasesForDropdown,
  SetBasesForDropdownloading,
  setBasesPayloadType,
} from "../../redux/slices/rootsSlice";
import { BasesByPagesResponse } from "../../redux/types/rootsTypes";

export type fnloadBasesForDropDown = (searchValue: string) => void;

export function useBasesForDropDownList(): [fnloadBasesForDropDown] {
  const dispatch = useAppDispatch();
  const rootsState = useAppSelector((state) => state.rootsState);
  const dropdownLinesCount = 8;

  const [getBasesByPages] = useLazyGetBasesByPagesQuery();

  const loadBasesForDropDownList = useCallback(
    async (searchValue: string) => {
      if (rootsState.basesForDropdownloading) return;

      dispatch(SetBasesForDropdownloading(true));

      const result = await getBasesByPages({
        searchValue,
        itemsPerPage: dropdownLinesCount,
        pageNom: 1,
      });
      // console.log("result.data=", result.data);
      if (result.data) {
        const data = result.data as BasesByPagesResponse;
        const payload = {
          pagekey: searchValue,
          data: data.baseLinks,
        } as setBasesPayloadType;
        dispatch(SetBasesForDropdown(payload));
      }

      dispatch(SetBasesForDropdownloading(false));
    },
    [rootsState, dispatch, getBasesByPages]
  );

  return [loadBasesForDropDownList];
}
