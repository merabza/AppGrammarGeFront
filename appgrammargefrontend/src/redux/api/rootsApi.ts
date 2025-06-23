//rootsApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
    setAlertApiLoadError,
    setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import {
    SetBasesForDropdownloading,
    SetBasesForPages,
    clearParadigm,
    setBasesCount,
    type setBasesCountPayloadType,
    type setBasesPayloadType,
    setParadigm,
} from "../slices/rootsSlice";
import type {
    BasesByPagesResponse,
    ParadigmModel,
    RootFullModel,
    SamplePositionModel,
    VerbsByPagesResponse,
} from "../types/rootsTypes";
import type { RootLinkQueryModel } from "../../derivationTreeEditor/TypesAndSchemas/InflectionDataTypeAndSchema";

// import {
//   setDataTypes,
//   setGrid,
//   setMultipleGrids,
// } from "../slices/dataTypesSlice";
// import { DataTypeFfModel } from "../types/dataTypesTypes";
// import { ISetGridAction, ISetMultipleGrids } from "../types/rightsTypes";
// import { setWorkingOnLoad } from "../slices/masterdataSlice";

export interface GetBasesbypagesReqType {
    searchValue: string;
    itemsPerPage: number;
    pageNom: number;
    pagekey: string;
}

export interface GetVerbsbypagesReqType {
    searchValue: string;
    dropdownLinesCount: number;
}

export interface saveParadigmSamplePositionsReqType {
    infId: number;
    samples: SamplePositionModel[];
}

export interface saveVerbCompositionParadigmSamplePositionsReqType {
    ivcId: number;
    samples: SamplePositionModel[];
}

export const rootsApi = createApi({
    reducerPath: "rootsApi",
    baseQuery: jwtBaseQuery,
    endpoints: (builder) => ({
        //////////////////////////////////////////////////////
        getBasesByPages: builder.query<
            BasesByPagesResponse,
            GetBasesbypagesReqType
        >({
            query({ searchValue, itemsPerPage, pageNom }) {
                return {
                    url: `/roots/getbasesbypages/${searchValue}/${itemsPerPage}/${pageNom}`,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    dispatch(SetBasesForDropdownloading(true));
                    const result = await queryFulfilled;
                    const data = result.data as BasesByPagesResponse;
                    // console.log("rootsApi getBasesByPages data=", data);
                    const payload = {
                        pagekey: args.pagekey,
                        data: data.baseLinks,
                    } as setBasesPayloadType;
                    // console.log("rootsApi getBasesByPages payload=", payload);
                    dispatch(SetBasesForPages(payload));
                    dispatch(SetBasesForDropdownloading(false));
                } catch (error) {
                    dispatch(setAlertApiLoadError(buildErrorMessage(error)));
                }
            },
        }),
        //////////////////////////////////////////////////////
        getVerbsForDropDown: builder.query<
            VerbsByPagesResponse,
            GetVerbsbypagesReqType
        >({
            query({ searchValue, dropdownLinesCount }) {
                return {
                    url: `/roots/getverbsbypages/${searchValue}/${dropdownLinesCount}`,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    // const queryResult =
                    await queryFulfilled;
                    // const { data } = queryResult;
                    // dispatch(setVerbsForDropdown(data));
                } catch (error) {
                    dispatch(setAlertApiLoadError(buildErrorMessage(error)));
                }
            },
        }),
        //////////////////////////////////////////////////////
        getBasesCount: builder.query<number, string>({
            query(searchValue) {
                return {
                    url: `/roots/getbasescount/${searchValue}`,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    dispatch(SetBasesForDropdownloading(false));
                    const queryResult = await queryFulfilled;
                    const { data } = queryResult;
                    dispatch(
                        setBasesCount({
                            searchValue: args,
                            data,
                        } as setBasesCountPayloadType)
                    );
                    dispatch(SetBasesForDropdownloading(false));
                } catch (error) {
                    dispatch(setAlertApiLoadError(buildErrorMessage(error)));
                }
            },
        }),
        //////////////////////////////////////////////////////
        getParadigm: builder.query<ParadigmModel, number>({
            query(infId) {
                return {
                    url: `/roots/getparadigm/${infId}`,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    if (args) {
                        const queryResult = await queryFulfilled;
                        const { data } = queryResult;
                        console.log("getParadigm queryResult=", queryResult);
                        dispatch(setParadigm(data as ParadigmModel));
                    } else dispatch(clearParadigm());
                } catch (error) {
                    dispatch(setAlertApiLoadError(buildErrorMessage(error)));
                }
            },
        }),
        //////////////////////////////////////////////////////
        getVerbCompositionParadigm: builder.query<ParadigmModel, number>({
            query(ivcId) {
                return {
                    url: `/roots/getverbcompositionparadigm/${ivcId}`,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    if (args) {
                        const queryResult = await queryFulfilled;
                        const { data } = queryResult;
                        console.log("getParadigm queryResult=", queryResult);
                        dispatch(setParadigm(data as ParadigmModel));
                    } else dispatch(clearParadigm());
                } catch (error) {
                    dispatch(setAlertApiLoadError(buildErrorMessage(error)));
                }
            },
        }),
        //////////////////////////////////////////////////////
        paradigmSaveSamples: builder.mutation<void, number>({
            query(infId) {
                return {
                    url: `/roots/paradigmsavesamples/${infId}`,
                    method: "PUT",
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
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
        saveParadigmSamplePositions: builder.mutation<
            void,
            saveParadigmSamplePositionsReqType
        >({
            query({ infId, samples }) {
                return {
                    url: `/roots/saveparadigmsamplepositions/${infId}`,
                    method: "PUT",
                    body: samples,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    if (args.infId) await queryFulfilled;
                    else dispatch(clearParadigm());
                } catch (error) {
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
                }
            },
        }),
        //////////////////////////////////////////////////////
        saveVerbCompositionParadigmSamplePositions: builder.mutation<
            void,
            saveVerbCompositionParadigmSamplePositionsReqType
        >({
            query({ ivcId, samples }) {
                return {
                    url: `/roots/saveverbcompositionparadigmsamplepositions/${ivcId}`,
                    method: "PUT",
                    body: samples,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    if (args.ivcId) await queryFulfilled;
                    else dispatch(clearParadigm());
                } catch (error) {
                    dispatch(
                        setAlertApiMutationError(buildErrorMessage(error))
                    );
                }
            },
        }),
        //////////////////////////////////////////////////////
        getFullRootById: builder.query<RootFullModel, number>({
            query(rootId) {
                return {
                    url: `/roots/getrootbyid/${rootId}`,
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
        getRootByDerivBranchId: builder.query<RootFullModel, number>({
            query(derivBranchId) {
                return {
                    url: `/roots/getrootsbyderivationbranchid/${derivBranchId}`,
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
        getRootByInflectionId: builder.query<RootFullModel, number>({
            query(inflectionId) {
                return {
                    url: `/roots/getrootsbyinflectionid/${inflectionId}`,
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
        getRootByInflectionVerbCompositionId: builder.query<
            RootFullModel,
            number
        >({
            query(inflectionVerbCompositionId) {
                return {
                    url: `/roots/getrootsbyinflectionverbcompositionid/${inflectionVerbCompositionId}`,
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
        getForConfirmRootsCount: builder.query<number, string>({
            query(queryString) {
                return {
                    url: `/roots/getforconfirmrootscount${queryString}`,
                };
            },
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(setAlertApiLoadError(buildErrorMessage(error)));
                }
            },
        }),
        //////////////////////////////////////////////////////
        // getForConfirmRootsByPages: builder.query<RootLinkQueryModel[], string>({
        //     query(queryString) {
        //         return {
        //             url: `/roots/getforconfirmrootsbypages${queryString}`,
        //         };
        //     },
        //     async onQueryStarted(args, { dispatch, queryFulfilled }) {
        //         try {
        //             await queryFulfilled;
        //         } catch (error) {
        //             dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        //         }
        //     },
        // }),
        //////////////////////////////////////////////////////
        getUsersListForConfirm: builder.query<string[], void>({
            query() {
                return {
                    url: `/roots/getuserslistforconfirm`,
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

        //
    }),
});

// export const { useLazyGetBasesForDropDownQuery } = rootsApi;
export const {
    useLazyGetBasesByPagesQuery,
    useLazyGetVerbsForDropDownQuery,
    useLazyGetBasesCountQuery,
    useParadigmSaveSamplesMutation,
    useSaveParadigmSamplePositionsMutation,
    useSaveVerbCompositionParadigmSamplePositionsMutation,
    useLazyGetFullRootByIdQuery,
    useLazyGetParadigmQuery,
    useLazyGetVerbCompositionParadigmQuery,
    useLazyGetRootByDerivBranchIdQuery,
    useLazyGetRootByInflectionIdQuery,
    useLazyGetRootByInflectionVerbCompositionIdQuery,
    useLazyGetForConfirmRootsCountQuery,
    // useLazyGetForConfirmRootsByPagesQuery,
    useGetUsersListForConfirmQuery,
} = rootsApi;
