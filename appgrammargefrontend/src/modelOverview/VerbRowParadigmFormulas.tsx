//VerbRowParadigmFormulas.tsx

import { useEffect, useState, useMemo, FC } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import Loading from '../../carcass/common/Loading';
import { getFormulaVisual2 } from "./FormulasModule";
// import { actionCreators as MasterDataActions } from '../../carcass/masterdata/MasterDataStore';
// import { actionCreators as FormulasActions } from './FormulasStore';
// import { GetDisplayValue2 } from '../../carcass/modules/GetDisplayValue'
// import { useScroller } from '../../carcass/common/MyHooks';
// import { NzInt, filterByHeader } from '../../carcass/common/myFunctions';
// import BsComboBox from '../../carcass/masterdata/BsComboBox';
// import { useForman } from '../../carcass/common/MyHooks';
import * as yup from "yup";
import { NzInt, filterByHeader } from "../appcarcass/common/myFunctions";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { useForman } from "../appcarcass/hooks/useForman";
import { useAlert } from "../appcarcass/hooks/useAlert";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { useAppSelector } from "../appcarcass/redux/hooks";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import Loading from "../appcarcass/common/Loading";
import {
  InflectionBlock,
  InflectionType,
  Morpheme,
  MorphemeRange,
  MorphemeRangeByInflectionBlock,
  VerbRows,
  VerbParadigm,
  VerbType,
} from "../masterData/mdTypes";
import { VerbPersonMarkerParadigm } from "../redux/types/formulasTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useCheckLoadVerbParadigmFormulas } from "./formulasHooks/useCheckloadVerbParadigmFormulas";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import { GetDisplayValueForLookup } from "../appcarcass/modules/GetDisplayValue";

const VerbRowParadigmFormulas: FC = () => {
  // const { mdWorkingOnLoad, morphemeRanges, morphemesQuery, inflectionBlocks, inflectionTypes,
  //   morphemeRangesByInflectionBlocks, verbTypes, verbRows, verbParadigms, verbPersonMarkerParadigms, checkLoadMdTables,
  //   verbRowParadigmFormulas, verbRowParadigmFormulasLoading, checkloadVerbParadigmFormulas } = props;
  // const {
  //   alert,
  //   masterData,
  //   verbRowParadigmFormulas,
  //   verbRowParadigmFormulasLoading,
  //   checkLoadMdTables,
  //   checkloadVerbParadigmFormulas,
  // } = props;

  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );

  const morphemeRanges = mdRepo.morphemeRanges as MorphemeRange[];
  const morphemesQuery = mdRepo.morphemesQuery as Morpheme[];
  const inflectionBlocks = mdRepo.inflectionBlocks as InflectionBlock[];
  const inflectionTypes = mdRepo.inflectionTypes as InflectionType[];
  const morphemeRangesByInflectionBlocks =
    mdRepo.morphemeRangesByInflectionBlocks as MorphemeRangeByInflectionBlock[];

  const verbTypes = mdRepo.verbTypes as VerbType[];
  const verbRows = mdRepo.verbRows as VerbRows[];

  const verbParadigms = mdRepo.verbParadigms as VerbParadigm[];
  const verbPersonMarkerParadigms =
    mdRepo.verbPersonMarkerParadigms as VerbPersonMarkerParadigm[];

  const [curParadigmId, setCurParadigmId] = useState<number | null>(null);

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  //console.log("VerbRowParadigmFormulas props=", props);

  const { paradigmId } = useParams<string>();

  const paradigmIdNumber = NzInt(paradigmId);

  const tableNamesForLoad = useMemo(
    () => [
      "morphemeRanges",
      "morphemesQuery",
      "inflectionBlocks",
      "inflectionTypes",
      "morphemeRangesByInflectionBlocks",
      "verbTypes",
      "verbRows",
      "verbParadigms",
      "verbPersonMarkerParadigms",
    ],
    []
  );

  const { verbParadigmFormulas } = useAppSelector(
    (state) => state.modelDataState
  );

  const [checkLoadMdTables] = useCheckLoadMdTables();
  const [checkLoadVerbParadigmFormulas, verbParadigmFormulasLoading] =
    useCheckLoadVerbParadigmFormulas();

  useEffect(() => {
    checkLoadMdTables(tableNamesForLoad);
  }, [tableNamesForLoad]);

  useEffect(() => {
    if (curParadigmId !== paradigmIdNumber) {
      setCurParadigmId(paradigmIdNumber);
      checkLoadVerbParadigmFormulas(paradigmIdNumber);
    }
  }, [paradigmIdNumber, curParadigmId]); //, loading, loadingFailure, drParentsLoading, drChildsLoading, drWorkingOnSave

  const { recNameParam } = useParams<string>();

  const recNameNumber = NzInt(recNameParam);

  const [curscrollTo, backLigth] = useScroller<{
    recName: number;
  }>({
    recName: recNameNumber,
  });

  const yupSchema = yup.object().shape({
    verbTypeId: yup.number().integer().default(-1),
    verbRowId: yup.number().integer().default(-1),
    verbPersonMarkerParadigmId: yup.number().integer().default(-1),
  });

  const [frm, changeField, getError, , , ,] = useForman(yupSchema);

  const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

  if (ApiLoadHaveErrors)
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );

  //აქ ითვლება, რომ თუ პარადიგმის სახელების დარედაქტირების უფლება აქვს მომხმარებელს
  //მაშინ პარადიგმებზეც უნდა ჰქონდეს.
  //ასე იმიტომ გაკეთდა, რომ არ გამხდარიყო საჭირო პარადიგმების მწკრივის ცხრილის დარეგისტრირება DataType-ებში
  //თუ მომავალში ამ ორი უფლების გამიჯვნა გახდა საჭირო, მოგვიწევს DataType-ებში დავარეგისტრიროთ პარადიგმების მწკრივის ცხრილი
  const dataType = dataTypes.find((f) => f.dtTable === "verbParadigms");

  //console.log("VerbRowParadigmFormulas curscrollTo=", curscrollTo);
  if (
    mdWorkingOnLoad ||
    Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
    verbParadigmFormulasLoading
  ) {
    return <Loading />;
  }

  if (
    !morphemeRanges ||
    !morphemesQuery ||
    !inflectionBlocks ||
    !inflectionTypes ||
    !morphemeRangesByInflectionBlocks ||
    !verbTypes ||
    !verbRows ||
    !verbParadigms ||
    !verbPersonMarkerParadigms ||
    !curParadigmId ||
    !(curParadigmId in verbParadigmFormulas) ||
    !verbParadigmFormulas[curParadigmId] ||
    (recNameNumber && !curscrollTo) ||
    !dataTypes ||
    !dataType
  ) {
    return (
      <div>
        <h5>ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  const inflectionBlock = inflectionBlocks.find(
    (f) => f.inbKey === "VerbRowsBlock"
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

  function getParadigmName() {
    const verbRowParadigm = verbParadigms.find(
      (f) => f.vpnId === curParadigmId
    );
    return `${verbRowParadigm?.vpnKey} - ${verbRowParadigm?.vpnName}`;
  }

  const verbTypesSorted = verbTypes.slice().sort((a, b) => a.sortId - b.sortId);

  const verbRowsSorted = verbRows.slice().sort((a, b) => a.sortId - b.sortId);

  const verbPersonMarkerParadigmsSorted = verbPersonMarkerParadigms
    .slice()
    .sort((a, b) => a.sortId - b.sortId);

  return (
    <div>
      <Row>
        <Col sm="10">
          <Link
            to={`/verbRowParadigmsOverview/verbParadigms/${paradigmId}`}
            className="btn btn-primary"
          >
            <FontAwesomeIcon icon="chevron-left" /> უკან პარადიგმების სიაში
            დაბრუნება
          </Link>

          <h4>
            ზმნის მწკრივების პარადიგმა {getParadigmName()} (
            {verbParadigmFormulas[curParadigmId].length})
          </h4>
        </Col>
        <Col sm="2" align="right">
          {dataType.create && (
            <Link
              to={`/verbRowParadigmFormulaEdit`}
              className="btn btn-primary"
            >
              <FontAwesomeIcon icon="plus" /> ახალი
            </Link>
          )}
        </Col>
      </Row>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>ნიმუში</th>
            <th>ფორმულა</th>
            <th>
              <OneComboBoxControl
                controlId="verbTypeId"
                label="ზმნის ტიპი"
                value={frm ? frm.verbTypeId : null}
                dataMember={verbTypesSorted}
                valueMember="vtpId"
                displayMember="vtpName"
                getError={getError}
                onChangeValue={changeField}
                sortByDisplayMember={false}
                firstItem={{ id: -1, name: "ყველა" }}
                firstItemIsSelectable
              />
            </th>
            <th>
              <OneComboBoxControl
                controlId="verbRowId"
                label="მწკრივი"
                value={frm ? frm.verbRowId : null}
                dataMember={verbRowsSorted}
                valueMember="vrwId"
                displayMember="vrwName"
                getError={getError}
                onChangeValue={changeField}
                sortByDisplayMember={false}
                firstItem={{ id: -1, name: "ყველა" }}
                firstItemIsSelectable
              />
            </th>
            <th>
              <OneComboBoxControl
                controlId="verbPersonMarkerParadigmId"
                label="პირის ნიშნების პარადიგმა"
                value={frm ? frm.verbPersonMarkerParadigmId : null}
                dataMember={verbPersonMarkerParadigmsSorted}
                valueMember="vpmpnId"
                displayMember="vpmpnKey"
                getError={getError}
                onChangeValue={changeField}
                sortByDisplayMember={false}
                firstItem={{ id: -1, name: "ყველა" }}
                firstItemIsSelectable
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {verbParadigmFormulas[curParadigmId]
            .filter((f) => filterByHeader(f, frm))
            .sort((a, b) => a.vprOrderInParadigm - b.vprOrderInParadigm)
            .map((vpr, index) => {
              const bl = curscrollTo?.recName === vpr.vprId;
              return (
                <tr key={vpr.vprId.toString()} ref={bl ? backLigth : null}>
                  <td className={bl ? "backLigth" : undefined}>{index + 1}</td>
                  <td className={bl ? "backLigth" : undefined}>
                    {vpr.vprSample}
                  </td>
                  <td className={bl ? "backLigth" : undefined}>
                    {getFormulaVisual2(
                      vpr.morphemeIds,
                      rangesInGroup,
                      morphemesQuery
                    )}
                  </td>
                  <td className={bl ? "backLigth" : undefined}>
                    {GetDisplayValueForLookup(
                      verbTypes,
                      vpr.verbTypeId,
                      "vtpId",
                      "vtpName"
                    )}
                  </td>
                  <td className={bl ? "backLigth" : undefined}>
                    {GetDisplayValueForLookup(
                      verbRows,
                      vpr.verbRowId,
                      "vrwId",
                      "vrwName"
                    )}
                  </td>
                  <td className={bl ? "backLigth" : undefined}>
                    {GetDisplayValueForLookup(
                      verbPersonMarkerParadigms,
                      vpr.verbPersonMarkerParadigmId,
                      "vpmpnId",
                      "vpmpnKey"
                    )}
                  </td>
                  <td width="50px">
                    <div className="btn-toolbar pull-right">
                      {(dataType.update || dataType.delete) && (
                        <Link
                          to={`/verbRowParadigmFormulaEdit/${vpr.vprId}`}
                          className="btn btn-primary"
                        >
                          <FontAwesomeIcon icon="edit" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
};

export default VerbRowParadigmFormulas;

// // export function GetDisplayValue2(dataTable, value, col) {

// //   const { dataMember, valueMember, displayMember, rowSource, columnType } = col;

// function mapStateToProps(state) {
//   const alert = state.alert;
//   const masterData = state.masterData;
//   const { verbRowParadigmFormulas, verbRowParadigmFormulasLoading } =
//     state.formulasStore;

//   return {
//     alert,
//     masterData,
//     verbRowParadigmFormulas,
//     verbRowParadigmFormulasLoading,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     checkLoadMdTables: (tableNames) =>
//       dispatch(MasterDataActions.checkLoadMdTables(tableNames)),
//     checkloadVerbParadigmFormulas: (paradigmId) =>
//       dispatch(FormulasActions.checkloadVerbParadigmFormulas(paradigmId)),
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(VerbRowParadigmFormulas);
