//VerbRowParadigmsOverview.tsx

import { useEffect, useMemo, useCallback, FC } from "react";

// import Loading from '../../carcass/common/Loading';
// import { actionCreators as MasterDataActions } from '../../carcass/masterdata/MasterDataStore';
// import { actionCreators as FormulasActions } from './FormulasStore';
// import { useScroller } from '../../carcass/common/MyHooks';
// import { NzInt } from '../../carcass/common/myFunctions';
// import NameListEditor from './NameListEditor';
import ParadigmListEditor from "./ParadigmListEditor";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import {
  ParadigmNameModel,
  VerbRow,
  VerbSeries,
  VerbTransition,
  VerbType,
} from "../masterData/mdTypes";
import { useLocation, useParams } from "react-router-dom";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import NameListEditor from "./NameListEditor";

const VerbRowParadigmsOverview: FC = () => {
  // const {alert, isMenuLoading, flatMenu, masterData, checkLoadMdTables,
  //   verbRowParadigmNamesLoading, verbRowParadigmNames, checkLoadVerbRowParadigmNames} = props;

  const dispatch = useAppDispatch();

  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );
  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const verbTransitions = mdRepo.verbTransitions as VerbTransition[];
  const verbTypes = mdRepo.verbTypes as VerbType[];
  const verbSeries = mdRepo.verbSeries as VerbSeries[];
  const verbRows = mdRepo.verbRows as VerbRow[];
  const verbParadigmNames =
    mdRepo.verbParadigmNamesQuery as ParadigmNameModel[];

  //console.log("VerbRowParadigmsOverview props=", props);

  const menLinkKey = useLocation().pathname.split("/")[1];

  const tableNamesForLoad = useMemo(
    () => [
      "verbTransitions",
      "verbTypes",
      "verbSeries",
      "verbRows",
      "verbParadigmNamesQuery",
    ],
    []
  );

  const [checkLoadMdTables] = useCheckLoadMdTables();

  const { isMenuLoading, flatMenu } = useAppSelector(
    (state) => state.navMenuState
  );

  const isValidPage = useCallback(() => {
    if (!flatMenu) {
      return false;
    }
    return flatMenu.find((f) => f.menLinkKey === menLinkKey);
  }, [flatMenu, menLinkKey]);

  useEffect(() => {
    const menuItem = isValidPage();
    if (!menuItem) return;

    checkLoadMdTables(tableNamesForLoad);
  }, [isMenuLoading, flatMenu, tableNamesForLoad]);

  const { tabKey, recId, recName } = useParams<string>();

  const recIdNumber = NzInt(recId);

  const [curscrollTo, backLigth] = useScroller<{
    tabKey: string | undefined;
    recId: number;
    recName: string | undefined;
  }>({
    tabKey,
    recId: recIdNumber,
    recName,
  });

  function funSaveReturnPageName() {
    dispatch(saveReturnPageName(menLinkKey));
  }

  const verbParadigmsDataType = dataTypes.find(
    (f) => f.dtTable === "verbParadigms"
  );

  if (
    mdWorkingOnLoad ||
    // verbRowParadigmNamesLoading ||
    isMenuLoading ||
    Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s)
  ) {
    return <Loading />;
  }

  // console.log("VerbRowParadigmsOverview onCheckLoad ", {
  //   verbTransitions,
  //   verbTypes,
  //   verbSeries,
  //   verbRows,
  //   verbParadigmNames,
  //   curscrollTo,
  //   dataTypes,
  //   verbParadigmsDataType,
  // });

  if (
    !verbTransitions ||
    !verbTypes ||
    !verbSeries ||
    !verbRows ||
    !verbParadigmNames ||
    !curscrollTo ||
    !dataTypes ||
    !verbParadigmsDataType
  ) {
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  const listEditorTableNames = [
    "verbTransitions",
    "verbTypes",
    "verbSeries",
    "verbRows",
  ];

  return (
    <div>
      <h3>ზმნის მწკრივების პარადიგმების მიმოხილვა</h3>
      <h4>ტერმინები</h4>
      <p>
        <strong>გარდამავლობა</strong> - გარდამავლობის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>ზმნის ტიპი</strong> - ზმნის ტიპის განმარტება (გასაკეთებელია).
      </p>
      <p>
        <strong>სერია</strong> - სერიის განმარტება (გასაკეთებელია).
      </p>
      <p>
        <strong>მწკრივი</strong> - მწკრივის განმარტება (გასაკეთებელია).
      </p>
      {/* <p><strong>აქტანტების ჯგუფი</strong> - აქტანტების ჯგუფის განმარტება (გასაკეთებელია).</p>
      <p><strong>პირის ნიშნების პარადიგმა</strong> - პირის ნიშნების პარადიგმის განმარტება (გასაკეთებელია).</p> */}
      <p>
        <strong>მწკრივის პარადიგმა</strong> - მწკრივის პარადიგმის განმარტება
        (გასაკეთებელია).
      </p>

      {listEditorTableNames.map((tn) => {
        const dataType = dataTypes.find((f) => f.dtTable === tn);

        if (!dataType)
          return (
            <div>
              <h5>{tn} ჩატვირთვის პრობლემა</h5>
              <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
          );

        return (
          <NameListEditor
            key={dataType.dtName}
            dataType={dataType}
            tableForEdit={mdRepo[tn]}
            curscrollTo={curscrollTo}
            backLigth={backLigth}
            saveReturnPageName={funSaveReturnPageName}
          />
        );
      })}

      <ParadigmListEditor
        dataType={verbParadigmsDataType}
        paradigmNamesTable={verbParadigmNames}
        formulasTableName="verbRowParadigmFormulas"
        curscrollTo={curscrollTo}
        backLigth={backLigth}
        saveReturnPageName={funSaveReturnPageName}
      />
    </div>
  );
};

export default VerbRowParadigmsOverview;

// function mapStateToProps(state) {
//   const alert = state.alert;
//   const masterData = state.masterData;
//   const { isMenuLoading, flatMenu } = state.navMenu;
//   const { verbRowParadigmNamesLoading, verbRowParadigmNames } =
//     state.formulasStore;

//   return {
//     alert,
//     isMenuLoading,
//     flatMenu,
//     masterData,
//     verbRowParadigmNamesLoading,
//     verbRowParadigmNames,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     checkLoadMdTables: (tableNames) =>
//       dispatch(MasterDataActions.checkLoadMdTables(tableNames)),
//     saveReturnPageName: (pageName) =>
//       dispatch(MasterDataActions.saveReturnPageName(pageName)),
//     checkLoadVerbRowParadigmNames: () =>
//       dispatch(FormulasActions.checkLoadVerbRowParadigmNames()),
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(VerbRowParadigmsOverview);
