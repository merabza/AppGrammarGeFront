//modelDataApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import { setAlertApiLoadError } from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import type {
    DerivationFormula,
    NounParadigmFormula,
    // ParadigmNameModel,
    VerbParadigmFormula,
    VerbPersonMarkerFormula,
} from "../../masterData/mdTypes";
import {
    setDerivationFormulas,
    setNounParadigmFormulas,
    // setNounParadigmNames,
    setVerbParadigmFormulas,
    setVerbPersonMarkerFormulas,
} from "../slices/modelDataSlice";

export interface test {
    a: { [key: number]: number[] };
}

export const modelDataApi = createApi({
    reducerPath: "modelDataApi",
    baseQuery: jwtBaseQuery,
    endpoints: (builder) => ({
        //////////////////////////////////////////////////////
        getVerbRowParadigmsByVerbTypes: builder.query<
            { [key: number]: number[] },
            void
        >({
            query() {
                return {
                    url: "/modeldata/getverbparadigmsbyverbtypes",
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
        checkLoadDerivationFormulas: builder.query<DerivationFormula[], void>({
            query() {
                return {
                    url: "/modeldata/getallderivationformulas",
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const queryResult = await queryFulfilled;
                    const { data } = queryResult;
                    // console.log("formulasApi CheckLoadDerivationFormulas data=", data);
                    dispatch(setDerivationFormulas(data));
                } catch (error) {
                    // console.log("formulasApi CheckLoadDerivationFormulas error=", error);
                    dispatch(setAlertApiLoadError(buildErrorMessage(error)));
                }
            },
        }),
        //////////////////////////////////////////////////////
        // CheckLoadNounParadigmNames: builder.query<ParadigmNameModel[], void>({
        //   query() {
        //     return {
        //       url: "/modeldata/getnounparadigmnames",
        //     };
        //   },
        //   async onQueryStarted(args, { dispatch, queryFulfilled }) {
        //     try {
        //       const queryResult = await queryFulfilled;
        //       const { data } = queryResult;
        //       // console.log("formulasApi CheckLoadNounParadigmNames data=", data);
        //       dispatch(setNounParadigmNames(data));
        //     } catch (error) {
        //       // console.log("formulasApi CheckLoadNounParadigmNames error=", error);
        //       dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        //     }
        //   },
        // }),
        //////////////////////////////////////////////////////
        checkLoadNounParadigmFormulas: builder.query<
            NounParadigmFormula[],
            number
        >({
            query(paradigmId) {
                return {
                    url: `/modeldata/getnounparadigmformulas/${paradigmId}`,
                };
            },
            async onQueryStarted(paradigmId, { dispatch, queryFulfilled }) {
                try {
                    const queryResult = await queryFulfilled;
                    const { data } = queryResult;
                    // console.log("formulasApi CheckLoadNounParadigmFormulas data=", data);
                    dispatch(setNounParadigmFormulas({ paradigmId, data }));
                } catch (error) {
                    // console.log("formulasApi CheckLoadNounParadigmFormulas error=", error);
                    dispatch(setAlertApiLoadError(buildErrorMessage(error)));
                }
            },
        }),
        //////////////////////////////////////////////////////
        checkLoadVerbParadigmFormulas: builder.query<
            VerbParadigmFormula[],
            number
        >({
            query(paradigmId) {
                return {
                    url: `/modeldata/getverbparadigmformulas/${paradigmId}`,
                };
            },
            async onQueryStarted(paradigmId, { dispatch, queryFulfilled }) {
                try {
                    const queryResult = await queryFulfilled;
                    const { data } = queryResult;
                    // console.log("formulasApi CheckLoadVerbParadigmFormulas data=", data);
                    dispatch(setVerbParadigmFormulas({ paradigmId, data }));
                } catch (error) {
                    // console.log("formulasApi CheckLoadVerbParadigmFormulas error=", error);
                    dispatch(setAlertApiLoadError(buildErrorMessage(error)));
                }
            },
        }),
        //////////////////////////////////////////////////////
        checkLoadVerbPersonMarkerFormulas: builder.query<
            VerbPersonMarkerFormula[],
            number
        >({
            query(paradigmId) {
                return {
                    url: `/modeldata/getverbpersonmarkerformulas/${paradigmId}`,
                };
            },
            async onQueryStarted(paradigmId, { dispatch, queryFulfilled }) {
                try {
                    const queryResult = await queryFulfilled;
                    const { data } = queryResult;
                    // console.log("formulasApi CheckLoadVerbPersonMarkerParadigmFormulas data=", data);
                    dispatch(setVerbPersonMarkerFormulas({ paradigmId, data }));
                } catch (error) {
                    // console.log("formulasApi CheckLoadVerbPersonMarkerParadigmFormulas error=", error);
                    dispatch(setAlertApiLoadError(buildErrorMessage(error)));
                }
            },
        }),
        //////////////////////////////////////////////////////
    }),
});

export const {
    useGetVerbRowParadigmsByVerbTypesQuery,
    useLazyCheckLoadDerivationFormulasQuery,
    // useLazyCheckLoadNounParadigmNamesQuery,
    useLazyCheckLoadNounParadigmFormulasQuery,
    useLazyCheckLoadVerbParadigmFormulasQuery,
    useLazyCheckLoadVerbPersonMarkerFormulasQuery,
} = modelDataApi;
