//store.ts

import { configureStore } from "@reduxjs/toolkit";

//Slices carcass
import alertReducer from "../appcarcass/redux/slices/alertSlice";
import appParametersReducer from "../appcarcass/redux/slices/appParametersSlice";
import dataTypesReducer from "../appcarcass/redux/slices/dataTypesSlice";
import masterDataReducer from "../appcarcass/redux/slices/masterdataSlice";
import navMenuReducer from "../appcarcass/redux/slices/navMenuSlice";
import rightsReducer from "../appcarcass/redux/slices/rightsSlice";
import userReducer from "../appcarcass/redux/slices/userSlice";
//Slices project
import derivationCrudReducer from "./slices/derivationCrudSlice";
import derivationFormulasCrudReducer from "./slices/derivationFormulasCrudSlice";
import nounParadigmFormulasCrudReducer from "./slices/nounParadigmFormulasCrudSlice";
import verbParadigmFormulasCrudReducer from "./slices/verbParadigmFormulasCrudSlice";
import verbPersonMarkerFormulasCrudReducer from "./slices/verbPersonMarkerFormulasCrudSlice";
import modelEditorMorphemesCrudReducer from "./slices/modelEditorMorphemesCrudSlice";
import modelEditorPhoneticsTypesCrudReducer from "./slices/modelEditorPhoneticsTypesCrudSlice";
import modelEditorPhoneticsOptionsCrudReducer from "./slices/modelEditorPhoneticsOptionsCrudSlice";
import inflectionCrudReducer from "./slices/inflectionCrudSlice";
import inflectionVerbCompositionCrudReducer from "./slices/inflectionVerbCompositionCrudSlice";
import issuesReducer from "./slices/issuesSlice";
//import recountReducer from "./slices/issuesSlice";
import filteredReducer from "./slices/filteredSlice";
import modelDataReducer from "./slices/modelDataSlice";
import rootCrudReducer from "./slices/rootCrudSlice";
import rootsReducer from "./slices/rootsSlice";

//Middlewares
import { rtkQueryErrorLogger } from "../appcarcass/redux/rtkQueryErrorLogger";

//Apis - carcass
import { authenticationApi } from "../appcarcass/redux/api/authenticationApi";
import { dataTypesApi } from "../appcarcass/redux/api/dataTypesApi";
import { masterdataApi } from "../appcarcass/redux/api/masterdataApi";
import { rightsApi } from "../appcarcass/redux/api/rightsApi";
import { userRightsApi } from "../appcarcass/redux/api/userRightsApi";
//Apis - project
import { derivationCrudApi } from "./api/derivationCrudApi";
import { derivationFormulasCrudApi } from "./api/derivationFormulasCrudApi";
import { nounParadigmFormulasCrudApi } from "./api/nounParadigmFormulasCrudApi";
import { verbParadigmFormulasCrudApi } from "./api/verbParadigmFormulasCrudApi";
import { verbPersonMarkerFormulasCrudApi } from "./api/verbPersonMarkerFormulasCrudApi";
import { modelEditorMorphemesCrudApi } from "./api/modelEditorMorphemesCrudApi";
import { modelEditorPhoneticsTypesCrudApi } from "./api/modelEditorPhoneticsTypesCrudApi";
import { modelEditorPhoneticsOptionsCrudApi } from "./api/modelEditorPhoneticsOptionsCrudApi";
import { inflectionCrudApi } from "./api/inflectionCrudApi";
import { inflectionVerbCompositionCrudApi } from "./api/inflectionVerbCompositionCrudApi";
import { issuesApi } from "./api/issuesApi";
import { recountApi } from "./api/recountApi";
import { filteredApi } from "./api/filteredApi";
import { modelDataApi } from "./api/modelDataApi";
import { rootCrudApi } from "./api/rootCrudApi";
import { rootsApi } from "./api/rootsApi";

export const store = configureStore({
  reducer: {
    //reducers - carcass
    [authenticationApi.reducerPath]: authenticationApi.reducer,
    [dataTypesApi.reducerPath]: dataTypesApi.reducer,
    [masterdataApi.reducerPath]: masterdataApi.reducer,
    [rightsApi.reducerPath]: rightsApi.reducer,
    [userRightsApi.reducerPath]: userRightsApi.reducer,
    //reducers - project
    [derivationCrudApi.reducerPath]: derivationCrudApi.reducer,
    [derivationFormulasCrudApi.reducerPath]: derivationFormulasCrudApi.reducer,
    [nounParadigmFormulasCrudApi.reducerPath]:
      nounParadigmFormulasCrudApi.reducer,
    [verbParadigmFormulasCrudApi.reducerPath]:
      verbParadigmFormulasCrudApi.reducer,
    [verbPersonMarkerFormulasCrudApi.reducerPath]:
      verbPersonMarkerFormulasCrudApi.reducer,
    [modelEditorMorphemesCrudApi.reducerPath]:
      modelEditorMorphemesCrudApi.reducer,
    [modelEditorPhoneticsTypesCrudApi.reducerPath]:
      modelEditorPhoneticsTypesCrudApi.reducer,
    [modelEditorPhoneticsOptionsCrudApi.reducerPath]:
      modelEditorPhoneticsOptionsCrudApi.reducer,
    [inflectionCrudApi.reducerPath]: inflectionCrudApi.reducer,
    [inflectionVerbCompositionCrudApi.reducerPath]:
      inflectionVerbCompositionCrudApi.reducer,
    [issuesApi.reducerPath]: issuesApi.reducer,
    [recountApi.reducerPath]: recountApi.reducer,
    [filteredApi.reducerPath]: filteredApi.reducer,
    [modelDataApi.reducerPath]: modelDataApi.reducer,
    [rootCrudApi.reducerPath]: rootCrudApi.reducer,
    [rootsApi.reducerPath]: rootsApi.reducer,

    //states - carcass
    alertState: alertReducer,
    appParametersState: appParametersReducer,
    dataTypesState: dataTypesReducer,
    masterDataState: masterDataReducer,
    navMenuState: navMenuReducer,
    rightsState: rightsReducer,
    userState: userReducer,
    //states - project
    derivationCrudState: derivationCrudReducer,
    derivationFormulasCrudState: derivationFormulasCrudReducer,
    nounParadigmFormulasCrudState: nounParadigmFormulasCrudReducer,
    verbParadigmFormulasCrudState: verbParadigmFormulasCrudReducer,
    verbPersonMarkerFormulasCrudState: verbPersonMarkerFormulasCrudReducer,
    modelEditorMorphemesCrudState: modelEditorMorphemesCrudReducer,
    modelEditorPhoneticsTypesCrudState: modelEditorPhoneticsTypesCrudReducer,
    modelEditorPhoneticsOptionsCrudState:
      modelEditorPhoneticsOptionsCrudReducer,
    inflectionCrudState: inflectionCrudReducer,
    inflectionVerbCompositionCrudState: inflectionVerbCompositionCrudReducer,
    issuesState: issuesReducer,
    // recountState: recountReducer,
    filteredState: filteredReducer,
    modelDataState: modelDataReducer,
    rootCrudState: rootCrudReducer,
    rootsState: rootsReducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      rtkQueryErrorLogger,
      //middlewares - carcass
      authenticationApi.middleware,
      dataTypesApi.middleware,
      masterdataApi.middleware,
      rightsApi.middleware,
      userRightsApi.middleware,
      //middlewares - project
      derivationCrudApi.middleware,
      derivationFormulasCrudApi.middleware,
      nounParadigmFormulasCrudApi.middleware,
      verbParadigmFormulasCrudApi.middleware,
      verbPersonMarkerFormulasCrudApi.middleware,
      modelEditorMorphemesCrudApi.middleware,
      modelEditorPhoneticsTypesCrudApi.middleware,
      modelEditorPhoneticsOptionsCrudApi.middleware,
      inflectionCrudApi.middleware,
      inflectionVerbCompositionCrudApi.middleware,
      issuesApi.middleware,
      recountApi.middleware,
      filteredApi.middleware,
      modelDataApi.middleware,
      rootCrudApi.middleware,
      rootsApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
//ესენი hook-ში გადავიტანე
//export const useAppDispatch = () => useDispatch<AppDispatch>();
//export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//ეს ჯერ არ ვიცი გამომადგება თუ არა
//export type AppThunk<ReturnType = void> = ThunkAction<
//    ReturnType,
//    RootState,
//    unknown,
//    Action<string>
//>;
