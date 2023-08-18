//modelEditorMorphemesCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
import { redirect } from "react-router-dom";
import { MorphemeEditFormData } from "../../modelOverview/MorphemeEditFormData";
import { setMorphemeForEdit } from "../slices/modelEditorMorphemesCrudSlice";

export const modelEditorMorphemesCrudApi = createApi({
  reducerPath: "ModelEditorMorphemeCrudApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    getOneMorphemeById: builder.query<MorphemeEditFormData, number>({
      query(mrpId) {
        return {
          url: `/modeleditor/morpheme/${mrpId}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          // console.log(
          //   "ModelEditorMorphemeCrudApi getOneMorphemeById data=",
          //   data
          // );
          dispatch(setMorphemeForEdit(data));
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    ////////////////////////////////////////////////////
    createMorpheme: builder.mutation<
      MorphemeEditFormData,
      MorphemeEditFormData
    >({
      query(derivationBranchData) {
        return {
          url: `/modeleditor/morpheme`,
          method: "POST",
          body: derivationBranchData,
        };
      },
      async onQueryStarted(Morpheme, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setMorphemeForEdit(data));
          redirect(`/morphemesOverview/mrp/${Morpheme.morpheme.mrpId}`);
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updateMorpheme: builder.mutation<void, MorphemeEditFormData>({
      query(Morpheme) {
        return {
          url: `/modeleditor/morpheme/${Morpheme.morpheme.mrpId}`,
          method: "PUT",
          body: Morpheme,
        };
      },
      async onQueryStarted(Morpheme, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          const mrpId = Morpheme.morpheme.mrpId;
          redirect(`/morphemesOverview/mrp/${mrpId}`);
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deleteMorpheme: builder.mutation<void, number>({
      query(mrpId) {
        return {
          url: `/modeleditor/morpheme/${mrpId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(mrpId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          redirect("/MorphemesOverview");
        } catch (error) {
          // dispatch(setDeleteFailureDerivation(true));
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
  }),
});

export const {
  useLazyGetOneMorphemeByIdQuery,
  useCreateMorphemeMutation,
  useUpdateMorphemeMutation,
  useDeleteMorphemeMutation,
} = modelEditorMorphemesCrudApi;
