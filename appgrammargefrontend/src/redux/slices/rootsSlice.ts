//rootsSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  RootLinkQueryModel,
  VerbInflectionModel,
} from "../../derivationTreeEditor/TypesAndSchemas/InflectionDataTypeAndSchema";
import {
  BaseLinkType,
  ParadigmModel,
  RootFullModel,
} from "../types/rootsTypes";

export interface IRootsState {
  memoVerbsDict: { [key: string]: VerbInflectionModel[] };
  memoBasesDict: { [key: string]: BaseLinkType[] };
  memoBaseCounts: { [key: string]: number };
  memoBasePages: { [key: string]: BaseLinkType[] };
  basesForDropdownloading: boolean;
  verbsForDropdownloading: boolean;
  basesPageLoading: boolean;
  paradigm: ParadigmModel | null;
  inflectionWorkingOnLoadParadigm: boolean;
  prdIspMorphemeNom: number;
  prdShowhyphens: boolean;
  prdShowFormulas: boolean;
  rootLoading: boolean;
  rootsRepo: { [key: number]: RootFullModel };
  memoForConfirmRootsPages: {
    [key: string]: RootLinkQueryModel[];
  };
  forConfirmRootsListPageLoading: boolean;
  memoForConfirmRootsCounts: { [key: string]: number };
}

const initialState: IRootsState = {
  memoVerbsDict: {} as { [key: string]: VerbInflectionModel[] },
  memoBasesDict: {} as { [key: string]: BaseLinkType[] },
  memoBaseCounts: {} as { [key: string]: number },
  memoBasePages: {} as { [key: string]: BaseLinkType[] },
  basesForDropdownloading: false,
  verbsForDropdownloading: false,
  basesPageLoading: false,
  paradigm: null,
  inflectionWorkingOnLoadParadigm: false,
  prdIspMorphemeNom: 0,
  prdShowhyphens: false,
  prdShowFormulas: false,
  rootLoading: false,
  rootsRepo: {} as { [key: number]: RootFullModel },
  memoForConfirmRootsPages: {} as {
    [key: string]: RootLinkQueryModel[];
  },
  forConfirmRootsListPageLoading: false,
  memoForConfirmRootsCounts: {} as { [key: string]: number },
};

export interface setBasesPayloadType {
  pagekey: string;
  data: BaseLinkType[];
}

export interface setVerbsPayloadType {
  searchValue: string;
  data: VerbInflectionModel[];
}

export interface setBasesCountPayloadType {
  searchValue: string;
  data: number;
}

export interface setRootByIdPayloadType {
  rootId: number;
  data: RootFullModel;
}

export interface SetForConfirmRootsByPagesPayloadType {
  pagekey: string;
  ForConfirmRootDataArray: RootLinkQueryModel[];
}

export const rootsSlice = createSlice({
  initialState,
  name: "rootsSlice",
  reducers: {
    //////////////////////////////////////
    SetBasesForDropdown: (
      state,
      action: PayloadAction<setBasesPayloadType>
    ) => {
      const { pagekey, data } = action.payload;
      // console.log("setBasesForDropdown { pagekey, data } = ", {
      //   pagekey,
      //   data,
      // });
      state.memoBasesDict[pagekey] = data;
    },
    //////////////////////////////////////
    SetBasesForPages: (state, action: PayloadAction<setBasesPayloadType>) => {
      const { pagekey, data } = action.payload;
      // console.log("setBasesForDropdown { pagekey, data } = ", {
      //   pagekey,
      //   data,
      // });
      state.memoBasePages[pagekey] = data;
    },
    //////////////////////////////////////
    SetVerbsForDropdown: (
      state,
      action: PayloadAction<setVerbsPayloadType>
    ) => {
      const { searchValue, data } = action.payload;
      // console.log("setVerbsForDropdown { searchValue, data } = ", {
      //   searchValue,
      //   data,
      // });
      state.memoVerbsDict[searchValue] = data;
    },
    //////////////////////////////////////
    SetBasesForDropdownloading: (state, action: PayloadAction<boolean>) => {
      state.basesForDropdownloading = action.payload;
    },
    //////////////////////////////////////
    SetVerbsForDropdownloading: (state, action: PayloadAction<boolean>) => {
      state.verbsForDropdownloading = action.payload;
    },
    //////////////////////////////////////
    SetBasesPageLoading: (state, action: PayloadAction<boolean>) => {
      state.basesPageLoading = action.payload;
    },

    //////////////////////////////////////
    setBasesCount: (state, action: PayloadAction<setBasesCountPayloadType>) => {
      const { searchValue, data } = action.payload;
      state.memoBaseCounts[searchValue] = data;
    },

    //////////////////////////////////////
    setParadigm: (state, action: PayloadAction<ParadigmModel>) => {
      state.paradigm = action.payload;
      state.inflectionWorkingOnLoadParadigm = false;
    },

    //////////////////////////////////////
    clearParadigm: (state) => {
      state.paradigm = null;
      state.inflectionWorkingOnLoadParadigm = false;
    },
    //////////////////////////////////////
    setinflectionWorkingOnLoadParadigm: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.inflectionWorkingOnLoadParadigm = action.payload;
    },

    //////////////////////////////////////
    swithcIspMorphemeNom: (state, action: PayloadAction<number>) => {
      state.prdIspMorphemeNom = action.payload;
    },

    //////////////////////////////////////
    showhyphens: (state, action: PayloadAction<boolean>) => {
      state.prdShowhyphens = action.payload;
    },

    //////////////////////////////////////
    showFormulas: (state, action: PayloadAction<boolean>) => {
      state.prdShowFormulas = action.payload;
    },

    //////////////////////////////////////
    setRootLoading: (state, action: PayloadAction<boolean>) => {
      state.rootLoading = action.payload;
    },

    //////////////////////////////////////
    setRootById: (state, action: PayloadAction<setRootByIdPayloadType>) => {
      state.rootsRepo[action.payload.rootId] = action.payload.data;
    },

    //////////////////////////////////////
    clearRoot: (state, action: PayloadAction<number | undefined>) => {
      const rootId = action.payload;
      if (rootId) delete state.rootsRepo[rootId];
    },

    //////////////////////////////////////
    clearMemo: (state) => {
      state.memoBasesDict = {} as { [key: string]: BaseLinkType[] };
      state.memoBaseCounts = {} as { [key: string]: number };
      state.memoBasePages = {} as { [key: string]: BaseLinkType[] };
    },

    //////////////////////////////////////
    clearForConfirmRootsPagesMemo: (state) => {
      state.memoBasesDict = {} as { [key: string]: BaseLinkType[] };
      state.memoBaseCounts = {} as { [key: string]: number };
      state.memoBasePages = {} as { [key: string]: BaseLinkType[] };
    },

    //////////////////////////////////////
    removeRootsFromRepo: (state, action: PayloadAction<number[]>) => {
      const predRootIds = action.payload;
      predRootIds.forEach((rootId) => {
        delete state.rootsRepo[rootId];
      });
    },
    //////////////////////////////////////
    SetForConfirmRootsListPageLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.forConfirmRootsListPageLoading = action.payload;
    },
    //////////////////////////////////////
    SetMemoForConfirmRootsCounts: (
      state,
      action: PayloadAction<{ val: string; count: number }>
    ) => {
      const { val, count } = action.payload;
      state.memoForConfirmRootsCounts[val] = count;
    },
    //////////////////////////////////////
    SetForConfirmRootsByPages: (
      state,
      action: PayloadAction<SetForConfirmRootsByPagesPayloadType>
    ) => {
      const { pagekey, ForConfirmRootDataArray } = action.payload;
      // console.log(
      //   "SetForConfirmRootsByPages { pagekey, ForConfirmRootDataArray }=",
      //   { pagekey, ForConfirmRootDataArray }
      // );
      state.memoForConfirmRootsPages[pagekey] = ForConfirmRootDataArray;
    },

    //////////////////////////////////////
  },
});

export default rootsSlice.reducer;

export const {
  SetBasesForDropdown,
  SetBasesForPages,
  SetVerbsForDropdown,
  SetBasesForDropdownloading,
  SetVerbsForDropdownloading,
  SetBasesPageLoading,
  setBasesCount,
  swithcIspMorphemeNom,
  showhyphens,
  showFormulas,
  setRootLoading,
  setRootById,
  clearParadigm,
  setParadigm,
  clearRoot,
  clearMemo,
  clearForConfirmRootsPagesMemo,
  removeRootsFromRepo,
  SetForConfirmRootsListPageLoading,
  SetMemoForConfirmRootsCounts,
  SetForConfirmRootsByPages,
} = rootsSlice.actions;
