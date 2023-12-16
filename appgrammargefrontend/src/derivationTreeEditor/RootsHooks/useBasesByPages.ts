//useBasesByPages.js

import { useCallback } from "react";
import {
  useLazyGetBasesByPagesQuery,
  useLazyGetBasesCountQuery,
} from "../../redux/api/rootsApi";

// import { useCallback } from "react";

// import { useAppDispatch } from "../../appcarcass/redux/hooks";
// import { useLazyGetBasesByPagesQuery } from "../../redux/api/rootsApi";
// import {
//   SetBasesForDropdown,
//   SetBasesForDropdownloading,
//   SetBasesPageLoading,
//   setBasesPayloadType,
// } from "../../redux/slices/rootsSlice";
// import { BasesByPagesResponse } from "../../redux/types/rootsTypes";

export type fnloadBasesByPages = (
  baseName: string,
  itemsPerPage: number,
  pageNom: number,
  pagekey: string
) => void;

export function useBasesByPages(): [fnloadBasesByPages, boolean] {
  const [getBasesByPages, { isLoading: loadingBasesByPages }] =
    useLazyGetBasesByPagesQuery();
  const [getBasesCount, { isLoading: loadingBasesCount }] =
    useLazyGetBasesCountQuery();

  const loadBasesByPages = useCallback(
    (
      baseName: string,
      itemsPerPage: number,
      pageNom: number,
      pagekey: string
    ) => {
      if (!loadingBasesCount) getBasesCount(baseName);
      if (!loadingBasesByPages)
        getBasesByPages({
          searchValue: baseName,
          itemsPerPage,
          pageNom,
          pagekey,
        });
    },
    []
  );

  return [loadBasesByPages, loadingBasesByPages || loadingBasesCount];
}
