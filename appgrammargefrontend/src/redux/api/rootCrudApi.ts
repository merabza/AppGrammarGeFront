//rootCrudApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtBaseQuery } from "../../appcarcass/redux/api/jwtBaseQuery";
import { setDeleteFailureRoot, setRootForEdit } from "../slices/rootCrudSlice";
import { RootData } from "../../derivationTreeEditor/TypesAndSchemas/RootDataTypeAndSchema";
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
import { redirect } from "react-router-dom";

export interface IConfirmRejectRootChangeParameters {
  rootId: number;
  confirm: boolean;
  withAllDescendants: boolean;
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
    createRoot: builder.mutation<RootData, RootData>({
      query(rootData) {
        return {
          url: `/rootcrud`,
          method: "POST",
          body: rootData,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          dispatch(clearAlert(EAlertKind.ApiMutation));
          const queryResult = await queryFulfilled;
          const { data } = queryResult;
          dispatch(setRootForEdit(data));
          redirect(`/root/${data.root.rootId}`);
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
    updateRoot: builder.mutation<number | null, RootData>({
      query(rootData) {
        return {
          url: `/rootcrud/${rootData.root.rootId}`,
          method: "PUT",
          body: rootData,
        };
      },
      async onQueryStarted(rootData, { dispatch, queryFulfilled }) {
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
            redirect(`/root/${duplicateRootId}`);
          } else {
            // console.log("updateRoot rootData=", rootData);
            // console.log(
            //   "updateRoot navigate rootData.root.rootId=",
            //   rootData.root.rootId
            // );
            redirect(`/root/${rootData.root.rootId}`);
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
    deleteRoot: builder.mutation<void, number>({
      query(rootId) {
        return {
          url: `/rootcrud/${rootId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(rootId, { dispatch, queryFulfilled }) {
        try {
          dispatch(clearAlert(EAlertKind.ApiMutation));
          await queryFulfilled;
          redirect(`/root/${rootId}`);
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
      async onQueryStarted({ rootId, confirm }, { dispatch, queryFulfilled }) {
        try {
          dispatch(clearAlert(EAlertKind.ApiMutation));
          await queryFulfilled;
          redirect(`/root/${rootId}`);
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
