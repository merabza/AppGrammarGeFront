//CreateVerbPersonMarkerCombinationFormulaDetails.tsx

import { useEffect, useMemo, useCallback, FC } from "react";
import { Table } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import {
  InflectionBlock,
  InflectionType,
  Morpheme,
  MorphemeRange,
  MorphemeRangesByInflectionBlock,
  VerbPluralityType,
  VerbSeries,
  VerbType,
} from "../masterData/mdTypes";
import { VerbPersonMarkerParadigm } from "../redux/types/formulasTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useCheckLoadFilteredVerbPersonMarkerCombinationFormulas } from "./useCheckLoadFilteredVerbPersonMarkerCombinationFormulas";
import { useLocation, useParams } from "react-router-dom";
import { NzInt, filterByHeader } from "../appcarcass/common/myFunctions";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import { useForman } from "../appcarcass/hooks/useForman";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import BsComboBox from "../appcarcass/masterdata/BsComboBox";
import NameListEditor from "../modelOverview/NameListEditor";
import { getFormulaVisual2 } from "../modelOverview/FormulasModule";
import {
  CreateVerbPersonMarkerCombinationFormulaDetailsFormData,
  createVerbPersonMarkerCombinationFormulaDetailsFormDataSchema,
} from "./CreateVerbPersonMarkerCombinationFormulaDetailsFormData";
import { LookupCell } from "../appcarcass/redux/types/gridTypes";
import { GetDisplayValue } from "../appcarcass/modules/GetDisplayValue";
import MdGridView from "../appcarcass/masterdata/MdGridView";

const CreateVerbPersonMarkerCombinationFormulaDetails: FC = () => {
  const dispatch = useAppDispatch();

  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );

  const { verbPersonMarkerCombinationFormulas } = useAppSelector(
    (state) => state.filteredState
  );

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const masterData = useAppSelector((state) => state.masterDataState);

  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const morphemeRanges = mdRepo.morphemeRanges as MorphemeRange[];
  const morphemesQuery = mdRepo.morphemesQuery as Morpheme[];
  const inflectionBlocks = mdRepo.inflectionBlocks as InflectionBlock[];
  const inflectionTypes = mdRepo.inflectionTypes as InflectionType[];
  const morphemeRangesByInflectionBlocks =
    mdRepo.morphemeRangesByInflectionBlocks as MorphemeRangesByInflectionBlock[];
  const verbPluralityTypes = mdRepo.verbPluralityTypes as VerbPluralityType[];
  const verbPersonMarkerParadigms =
    mdRepo.verbPersonMarkerParadigms as VerbPersonMarkerParadigm[];
  const verbTypes = mdRepo.verbTypes as VerbType[];
  const verbSeries = mdRepo.verbSeries as VerbSeries[];

  //console.log("CreateVerbPersonMarkerCombinationFormulaDetails props=", props);

  const menLinkKey = useLocation().pathname.split("/")[1];

  const tableNamesForLoad = useMemo(
    () => [
      "morphemeRanges",
      "morphemesQuery",
      "inflectionBlocks",
      "inflectionTypes",
      "morphemeRangesByInflectionBlocks",
      "verbPluralityTypes",
      "verbPersonMarkerParadigms",
      "verbTypes",
      "verbSeries",
    ],
    []
  );

  const { isMenuLoading, flatMenu } = useAppSelector(
    (state) => state.navMenuState
  );

  const [checkLoadMdTables] = useCheckLoadMdTables();

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

  const [
    checkLoadFilteredVerbPersonMarkerCombinationFormulas,
    LoadingFilteredVerbPersonMarkerCombinationFormulas,
  ] = useCheckLoadFilteredVerbPersonMarkerCombinationFormulas();

  useEffect(() => {
    checkLoadFilteredVerbPersonMarkerCombinationFormulas(1, 1, 1, 1);
  }, []);

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

  const [frm, changeField, getError, , , ,] = useForman<
    typeof createVerbPersonMarkerCombinationFormulaDetailsFormDataSchema,
    CreateVerbPersonMarkerCombinationFormulaDetailsFormData
  >(createVerbPersonMarkerCombinationFormulaDetailsFormDataSchema);

  if (
    mdWorkingOnLoad ||
    LoadingFilteredVerbPersonMarkerCombinationFormulas ||
    isMenuLoading ||
    Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s)
  ) {
    return <Loading />;
  }

  if (
    !curscrollTo ||
    !morphemeRanges ||
    !morphemesQuery ||
    !inflectionBlocks ||
    !inflectionTypes ||
    !morphemeRangesByInflectionBlocks ||
    !verbPluralityTypes ||
    !verbPersonMarkerParadigms ||
    !verbTypes ||
    !verbSeries ||
    !verbPersonMarkerCombinationFormulas ||
    !dataTypes
  ) {
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  const inflectionBlock = inflectionBlocks.find(
    (f) => f.inbKey === "PersonMarkersBlock"
  );
  if (!inflectionBlock) {
    return <h5>არასწორი ფლექსიის ბლოკი</h5>;
  }

  const inflectionType = inflectionTypes.find(
    (f) => f.iftId === inflectionBlock.inflectionTypeId
  );
  if (!inflectionType) {
    return <h5>არასწორი ფლექსიის ტიპი</h5>;
  }

  const MorphemeRangeIdsByIT = morphemeRangesByInflectionBlocks
    .filter((f) => f.inflectionBlockId === inflectionBlock.inbId)
    .map((m) => m.morphemeRangeId);

  const rangesInGroup = morphemeRanges
    .filter(
      (f) =>
        f.morphemeGroupId === inflectionType.morphemeGroupId &&
        MorphemeRangeIdsByIT.includes(f.mrId)
    )
    .sort((a, b) => a.mrPosition - b.mrPosition);

  function onChangeFilterValue(fieldName: string, newValue: number) {
    changeField(fieldName, newValue);

    const tfrm = JSON.parse(
      JSON.stringify(frm)
    ) as CreateVerbPersonMarkerCombinationFormulaDetailsFormData;

    tfrm[fieldName as keyof typeof tfrm] = newValue;
    checkLoadFilteredVerbPersonMarkerCombinationFormulas(
      frm.verbPluralityTypeId,
      frm.verbPersonMarkerParadigmId,
      frm.verbTypeId,
      frm.verbSeriesId
    );
  }

  const listEditorTableNames = [
    "verbPluralityTypes",
    "verbPersonMarkerParadigms",
    "verbTypes",
    "verbSeries",
  ];

  return (
    <div>
      <h3>პირის ნიშნების ფორმულების დათვლის საბოლოო ფაზა</h3>
      <h4>ტერმინები</h4>
      <p>
        <strong>ზმნის მრავლობითობის ტიპი</strong> - ზმნის მრავლობითობის ტიპის
        განმარტება (გასაკეთებელია).
      </p>
      <p>
        <strong>ზმნის ცალი პირის ნიშნების პარადიგმა</strong> - ზმნის ცალი პირის
        ნიშნების პარადიგმის განმარტება (გასაკეთებელია).
      </p>
      <p>
        <strong>ზმნის ტიპი</strong> - ზმნის ტიპის განმარტება (გასაკეთებელია).
      </p>
      <p>
        <strong>სერია</strong> - სერიის განმარტება (გასაკეთებელია).
      </p>

      {listEditorTableNames.map((tn) => {
        const dataType = dataTypes.find((f) => f.dtTable === tn);
        if (dataType) {
          return (
            <NameListEditor
              key={tn}
              dataType={dataType}
              tableForEdit={masterData.mdRepo[tn]}
              curscrollTo={curscrollTo}
              backLigth={backLigth}
              saveReturnPageName={funSaveReturnPageName}
            />
          );
        }
        return <></>;
      })}

      <MdGridView
        tableName="verbPersonMarkerCombinations"
        readOnly
        serverSidePagination
      />
      <div>
        წინა ვერსიაში ამ ცხრილში დამატებით იყო კიდევ ფორმულის სვეტი, რომელიც
        დასამატებელი იქნება
      </div>
    </div>
  );
};

export default CreateVerbPersonMarkerCombinationFormulaDetails;
