//rootCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import { setDeleteFailureRoot, setRootForEdit } from "../slices/rootCrudSlice";
import {
  CreateUpdateRootData,
  RootData,
} from "../../derivationTreeEditor/TypesAndSchemas/RootDataTypeAndSchema";
import {
  buildErrorMessage,
  Err,
} from "../../appcarcass/redux/types/errorTypes";
import {
  clearAlert,
  EAlertKind,
  setAlertApiLoadError,
  setAlertApiMutationError,
} from "../../appcarcass/redux/slices/alertSlice";
import { NavigateFunction } from "react-router-dom";
// import { redirect } from "react-router-dom";

export interface IConfirmRejectRootChangeParameters {
  rootId: number;
  confirm: boolean;
  withAllDescendants: boolean;
  navigate: NavigateFunction;
}

export const rootCrudApi = createApi({
  reducerPath: "rootCrudApi",
  baseQuery: jwtBaseQuery,
  endpoints: (builder) => ({
    //////////////////////////////////////////////////////
    OnlyRootById: builder.query<RootData, number>({
      query(rootId) {
        return {
          url: `/rootcrud/${rootId}`,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          // console.log("rootCrudApi OnlyRootById data=", data);
          dispatch(setRootForEdit(data));
        } catch (error) {
          dispatch(setAlertApiLoadError(buildErrorMessage(error)));
        }
      },
    }),
    //////////////////////////////////////////////////////
    createRoot: builder.mutation<RootData, CreateUpdateRootData>({
      query({ rootData }) {
        return {
          url: `/rootcrud`,
          method: "POST",
          body: rootData,
        };
      },
      async onQueryStarted({ navigate }, { dispatch, queryFulfilled }) {
        try {
          dispatch(clearAlert(EAlertKind.ApiMutation));
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setRootForEdit(data));
          navigate(`/root/${data.root.rootId}`);
        } catch (error) {
          dispatch(
            setAlertApiMutationError(
              buildErrorMessage(error, {
                errorCode: "createRootFailed",
                errorMessage: "ძირის შექმნა ვერ მოხერხდა",
              } as Err)
            )
          );
        }
      },
    }),
    //////////////////////////////////////////////////////
    updateRoot: builder.mutation<number | null, CreateUpdateRootData>({
      query({ rootData }) {
        return {
          url: `/rootcrud/${rootData.root.rootId}`,
          method: "PUT",
          body: rootData,
        };
      },
      async onQueryStarted(
        { rootData, navigate },
        { dispatch, queryFulfilled }
      ) {
        try {
          dispatch(clearAlert(EAlertKind.ApiMutation));

          const queryResult = await queryFulfilled;
          const { data } = queryResult;

          const duplicateRootId = data;
          if (duplicateRootId) {
            // console.log(
            //   "updateRoot navigate duplicateRootId=",
            //   duplicateRootId
            // );
            navigate(`/root/${duplicateRootId}`);
          } else {
            // console.log("updateRoot rootData=", rootData);
            // console.log(
            //   "updateRoot navigate rootData.root.rootId=",
            //   rootData.root.rootId
            // );
            navigate(`/root/${rootData.root.rootId}`);
          }
        } catch (error) {
          dispatch(
            setAlertApiMutationError(
              buildErrorMessage(error, {
                errorCode: "updateRootFailed",
                errorMessage: "ძირის შენახვა ვერ მოხერხდა",
              } as Err)
            )
          );
        }
      },
    }),
    //////////////////////////////////////////////////////
    deleteRoot: builder.mutation<
      void,
      { rootId: number; navigate: NavigateFunction }
    >({
      query(rootId) {
        return {
          url: `/rootcrud/${rootId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted({ rootId, navigate }, { dispatch, queryFulfilled }) {
        try {
          dispatch(clearAlert(EAlertKind.ApiMutation));
          await queryFulfilled;
          navigate(`/root/${rootId}`);
        } catch (error) {
          dispatch(setDeleteFailureRoot(true));
          dispatch(
            setAlertApiMutationError(
              buildErrorMessage(error, {
                errorCode: "updateRootFailed",
                errorMessage: "ძირის წაშლა ვერ მოხერხდა",
              } as Err)
            )
          );
        }
      },
    }),
    //////////////////////////////////////////////////////
    confirmRejectRootChange: builder.mutation<
      void,
      IConfirmRejectRootChangeParameters
    >({
      query({ rootId, confirm, withAllDescendants }) {
        return {
          url: `/rootcrud/${rootId}/${confirm}/${withAllDescendants}`,
          method: "PATCH",
        };
      },
      async onQueryStarted(
        { rootId, confirm, navigate },
        { dispatch, queryFulfilled }
      ) {
        try {
          dispatch(clearAlert(EAlertKind.ApiMutation));
          await queryFulfilled;
          navigate(`/root/${rootId}`);
        } catch (error) {
          dispatch(
            setAlertApiMutationError(
              buildErrorMessage(error, {
                errorCode: "confirRejectRootFailed",
                errorMessage: `ძირის ${
                  confirm ? "დადასტურება" : "უარყოფა"
                } ვერ მოხერხდა`,
              } as Err)
            )
          );
        }
      },
    }),
    //////////////////////////////////////////////////////
  }),
});

export const {
  useLazyOnlyRootByIdQuery,
  useCreateRootMutation,
  useUpdateRootMutation,
  useDeleteRootMutation,
  useConfirmRejectRootChangeMutation,
} = rootCrudApi;
