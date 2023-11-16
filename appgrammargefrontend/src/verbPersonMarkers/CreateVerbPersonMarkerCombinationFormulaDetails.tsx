//CreateVerbPersonMarkerCombinationFormulaDetails.tsx

import { useEffect, useMemo, useCallback, FC } from "react";

import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import { InflectionBlock } from "../masterData/mdTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useCheckLoadFilteredVerbPersonMarkerCombinationFormulas } from "./useCheckLoadFilteredVerbPersonMarkerCombinationFormulas";
import { useLocation, useParams } from "react-router-dom";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import NameListEditor from "../modelOverview/NameListEditor";
import MdGridView from "../appcarcass/masterdata/MdGridView";

const CreateVerbPersonMarkerCombinationFormulaDetails: FC = () => {
  const dispatch = useAppDispatch();

  const { mdataRepo, mdLookupRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
    useAppSelector((state) => state.masterDataState);

  const { verbPersonMarkerCombinationFormulas } = useAppSelector(
    (state) => state.filteredState
  );

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const masterData = useAppSelector((state) => state.masterDataState);

  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const morphemeRanges = mdLookupRepo.morphemeRanges;
  const morphemesQuery = mdLookupRepo.morphemesQuery;
  const inflectionBlocks = mdataRepo.inflectionBlocks as InflectionBlock[];
  const inflectionTypes = mdLookupRepo.inflectionTypes;
  const morphemeRangesByInflectionBlocks =
    mdLookupRepo.morphemeRangesByInflectionBlocks;
  const verbPluralityTypes = mdLookupRepo.verbPluralityTypes;
  const verbPersonMarkerParadigms = mdLookupRepo.verbPersonMarkerParadigms;
  const verbTypes = mdLookupRepo.verbTypes;
  const verbSeries = mdLookupRepo.verbSeries;

  //console.log("CreateVerbPersonMarkerCombinationFormulaDetails props=", props);

  const menLinkKey = useLocation().pathname.split("/")[1];

  const tableNamesForLookup = useMemo(
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

  const tableNamesForLoad = useMemo(() => ["inflectionBlocks"], []);

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

  // const [frm, changeField, , , , ,] = useForman<
  //   typeof createVerbPersonMarkerCombinationFormulaDetailsFormDataSchema,
  //   CreateVerbPersonMarkerCombinationFormulaDetailsFormData
  // >(createVerbPersonMarkerCombinationFormulaDetailsFormDataSchema);

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
    (f) => f.id === inflectionBlock.inflectionTypeId
  );
  if (!inflectionType) {
    return <h5>არასწორი ფლექსიის ტიპი</h5>;
  }

  // const MorphemeRangeIdsByIT = morphemeRangesByInflectionBlocks
  //   .filter((f) => f.inflectionBlockId === inflectionBlock.inbId)
  //   .map((m) => m.morphemeRangeId);

  // const rangesInGroup = morphemeRanges
  //   .filter(
  //     (f) =>
  //       f.morphemeGroupId === inflectionType.morphemeGroupId &&
  //       MorphemeRangeIdsByIT.includes(f.mrId)
  //   )
  //   .sort((a, b) => a.mrPosition - b.mrPosition);

  // function onChangeFilterValue(fieldName: string, newValue: number) {
  //   changeField(fieldName, newValue);

  //   const tfrm = JSON.parse(
  //     JSON.stringify(frm)
  //   ) as CreateVerbPersonMarkerCombinationFormulaDetailsFormData;

  //   tfrm[fieldName as keyof typeof tfrm] = newValue;
  //   checkLoadFilteredVerbPersonMarkerCombinationFormulas(
  //     frm.verbPluralityTypeId,
  //     frm.verbPersonMarkerParadigmId,
  //     frm.verbTypeId,
  //     frm.verbSeriesId
  //   );
  // }

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
              tableForEdit={masterData.mdLookupRepo[tn]}
              curscrollTo={curscrollTo}
              backLigth={backLigth}
              saveReturnPageName={funSaveReturnPageName}
            />
          );
        }
        return <></>;
      })}

      <MdGridView tableName="verbPersonMarkerCombinations" readOnly />
      <div>
        წინა ვერსიაში ამ ცხრილში დამატებით იყო კიდევ ფორმულის სვეტი, რომელიც
        დასამატებელი იქნება
      </div>
    </div>
  );
};

export default CreateVerbPersonMarkerCombinationFormulaDetails;
