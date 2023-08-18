//useVerbsForDropDown.ts

import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../appcarcass/redux/hooks";
import { useLazyGetVerbsForDropDownQuery } from "../../redux/api/rootsApi";
import {
  SetVerbsForDropdownloading,
  setVerbsPayloadType,
} from "../../redux/slices/rootsSlice";
import { VerbsByPagesResponse } from "../../redux/types/rootsTypes";
// import { useLazyGetBasesByPagesQuery } from "../../redux/api/rootsApi";
// import {
//   setBasesForDropdown,
//   SetBasesForDropdownloading,
//   setBasesPayloadType,
// } from "../../redux/slices/rootsSlice";
// import { BasesByPagesResponse } from "../../redux/types/rootsTypes";

export type fnloadVerbsForDropDown = (searchValue: string) => void;

export function useVerbsForDropDown(): [fnloadVerbsForDropDown] {
  const dispatch = useAppDispatch();
  const rootsState = useAppSelector((state) => state.rootsState);
  const dropdownLinesCount = 8;

  const [getVerbsForDropDown] = useLazyGetVerbsForDropDownQuery();

  const loadVerbsForDropDownList = useCallback(
    async (searchValue: string) => {
      if (rootsState.basesForDropdownloading) return;

      dispatch(SetVerbsForDropdownloading(true));

      const result = await getVerbsForDropDown({
        searchValue,
        dropdownLinesCount: dropdownLinesCount,
      });
      // console.log("result.data=", result.data);
      const data = result.data as VerbsByPagesResponse;
      const payload = {
        searchValue: searchValue,
        data: data.verbLinks,
      } as setVerbsPayloadType;
      dispatch(SetVerbsForDropdown(payload));

      dispatch(SetVerbsForDropdownloading(false));
    },
    [rootsState, dispatch, getVerbsForDropDown]
  );

  return [loadVerbsForDropDownList];
}
function SetVerbsForDropdown(payload: setVerbsPayloadType): any {
  throw new Error("Function not implemented.");
}
