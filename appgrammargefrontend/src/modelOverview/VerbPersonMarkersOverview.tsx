//VerbPersonMarkersOverview.tsx

import { useEffect, useMemo, useCallback, FC } from "react";
import NameListEditor from "./NameListEditor";
import ParadigmListEditor from "./ParadigmListEditor";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import {
  ActantGroups,
  ParadigmNameModel,
  VerbNumbers,
  VerbPersons,
  VerbPluralityType,
} from "../masterData/mdTypes";
import { useLocation, useParams } from "react-router-dom";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";

const VerbPersonMarkersOverview: FC = () => {
  const dispatch = useAppDispatch();

  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );
  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const verbPluralityTypes = mdRepo.verbPluralityTypes as VerbPluralityType[];
  const actantGroups = mdRepo.actantGroups as ActantGroups[];
  const verbPersons = mdRepo.verbPersons as VerbPersons[];
  const verbNumbers = mdRepo.verbNumbers as VerbNumbers[];
  const verbPersonMarkerParadigmNames =
    mdRepo.verbPersonMarkerParadigmNamesQuery as ParadigmNameModel[];

  //console.log("VerbPersonMarkersOverview props=", props);

  const menLinkKey = useLocation().pathname.split("/")[1];

  const tableNamesForLoad = useMemo(
    () => [
      "verbPluralityTypes",
      "actantGroups",
      "verbPersons",
      "verbNumbers",
      "verbPersonMarkerParadigmNamesQuery",
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

  const verbPersonMarkerParadigmsDataType = dataTypes.find(
    (f) => f.dtTable === "verbPersonMarkerParadigms"
  );

  if (
    mdWorkingOnLoad ||
    // verbPersonMarkerParadigmNamesLoading ||
    isMenuLoading ||
    Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s)
  ) {
    return <Loading />;
  }

  if (
    !verbPluralityTypes ||
    !actantGroups ||
    !verbPersons ||
    !verbNumbers ||
    !verbPersonMarkerParadigmNames ||
    !curscrollTo ||
    !dataTypes ||
    !verbPersonMarkerParadigmsDataType
  ) {
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  const listEditorTableNames = [
    "verbPluralityTypes",
    "actantGroups",
    "verbPersons",
    "verbNumbers",
  ];
  return (
    <div>
      <h3>ზმნის ცალი პირის ნიშნების პარადიგმების მიმოხილვა</h3>
      <h4>ტერმინები</h4>
      <p>
        <strong>მრალობითობა</strong> - მრალობითობის განმარტება (გასაკეთებელია).
      </p>
      <p>
        <strong>აქტანტების ჯგუფი</strong> - აქტანტების ჯგუფის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>ზმნის პირი</strong> - ზმნის პირის განმარტება (გასაკეთებელია).
      </p>
      <p>
        <strong>ზმნის რიცხვი</strong> - ზმნის რიცხვის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>ცალი პირის ნიშნის პარადიგმა</strong> - ცალი პირის ნიშნის
        პარადიგმის განმარტება (გასაკეთებელია).
      </p>

      {listEditorTableNames.map((tn) => {
        const dataType = dataTypes.find((f) => f.dtTable === tn);
        if (!dataType) {
          return <div></div>;
        }
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
        dataType={verbPersonMarkerParadigmsDataType}
        paradigmNamesTable={verbPersonMarkerParadigmNames}
        formulasTableName="verbPersonMarkerFormulas"
        curscrollTo={curscrollTo}
        backLigth={backLigth}
        saveReturnPageName={funSaveReturnPageName}
      />
    </div>
  );
};

export default VerbPersonMarkersOverview;
