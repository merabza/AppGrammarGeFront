//modelEditorMorphemesCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import {
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { buildErrorMessage } from "../../appcarcass/redux/types/errorTypes";
// import { redirect } from "react-router-dom";
import {
  CreateUpdateMorphemeEditFormData,
  MorphemeEditFormData,
} from "../../modelOverview/MorphemeEditFormData";
import { setMorphemeForEdit } from "../slices/modelEditorMorphemesCrudSlice";
import { NavigateFunction } from "react-router-dom";

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
      CreateUpdateMorphemeEditFormData
    >({
      query({ morphemeEditFormData }) {
        return {
          url: `/modeleditor/morpheme`,
          method: "POST",
          body: morphemeEditFormData,
        };
      },
      async onQueryStarted(
        { morphemeEditFormData, navigate },
        { dispatch, queryFulfilled }
      ) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setMorphemeForEdit(data));
          navigate(
            `/morphemesOverview/mrp/${morphemeEditFormData.morpheme.mrpId}`
          );
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    updateMorpheme: builder.mutation<void, CreateUpdateMorphemeEditFormData>({
      query({ morphemeEditFormData }) {
        return {
          url: `/modeleditor/morpheme/${morphemeEditFormData.morpheme.mrpId}`,
          method: "PUT",
          body: morphemeEditFormData,
        };
      },
      async onQueryStarted(
        { morphemeEditFormData, navigate },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          const mrpId = morphemeEditFormData.morpheme.mrpId;
          navigate(`/morphemesOverview/mrp/${mrpId}`);
        } catch (error) {
          dispatch(setAlertApiMutationError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    deleteMorpheme: builder.mutation<
      void,
      { mrpId: number; navigate: NavigateFunction }
    >({
      query(mrpId) {
        return {
          url: `/modeleditor/morpheme/${mrpId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted({ navigate }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          navigate("/MorphemesOverview");
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
