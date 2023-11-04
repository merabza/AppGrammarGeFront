//VerbPersonMarkerFormulas.tsx

import { useEffect, useState, useMemo, FC } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as yup from "yup";
import { useAppSelector } from "../appcarcass/redux/hooks";
import {
  InflectionBlock,
  InflectionType,
  Morpheme,
  MorphemeRange,
  MorphemeRangeByInflectionBlock,
  VerbNumber,
  VerbPerson,
  VerbPluralityType,
} from "../masterData/mdTypes";
import { VerbPersonMarkerParadigm } from "../redux/types/formulasTypes";
import { NzInt, filterByHeader } from "../appcarcass/common/myFunctions";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useCheckLoadVerbPersonMarkerFormulas } from "./formulasHooks/useCheckLoadVerbPersonMarkerFormulas";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { useForman } from "../appcarcass/hooks/useForman";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import { useAlert } from "../appcarcass/hooks/useAlert";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import { getFormulaVisual2 } from "./FormulasModule";
import { GetDisplayValueForLookup } from "../appcarcass/modules/GetDisplayValue";

const VerbPersonMarkerFormulas: FC = () => {
  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );

  const morphemeRanges = mdRepo.morphemeRanges as MorphemeRange[];
  const morphemesQuery = mdRepo.morphemesQuery as Morpheme[];
  const inflectionBlocks = mdRepo.inflectionBlocks as InflectionBlock[];
  const inflectionTypes = mdRepo.inflectionTypes as InflectionType[];
  const morphemeRangesByInflectionBlocks =
    mdRepo.morphemeRangesByInflectionBlocks as MorphemeRangeByInflectionBlock[];
  const verbPluralityTypes = mdRepo.verbPluralityTypes as VerbPluralityType[];
  const verbPersons = mdRepo.verbPersons as VerbPerson[];
  const verbNumbers = mdRepo.verbNumbers as VerbNumber[];
  const verbPersonMarkerParadigms =
    mdRepo.verbPersonMarkerParadigms as VerbPersonMarkerParadigm[];

  const [curParadigmId, setCurParadigmId] = useState<number | null>(null);

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const { paradigmId } = useParams<string>();

  const paradigmIdNumber = NzInt(paradigmId);

  const tableNamesForLoad = useMemo(
    () => [
      "morphemeRanges",
      "morphemesQuery",
      "inflectionBlocks",
      "inflectionTypes",
      "morphemeRangesByInflectionBlocks",
      "verbPluralityTypes",
      "verbPersons",
      "verbNumbers",
      "verbPersonMarkerParadigms",
    ],
    []
  );

  const { verbPersonMarkerFormulas } = useAppSelector(
    (state) => state.modelDataState
  );

  const [checkLoadMdTables] = useCheckLoadMdTables();
  const [checkLoadVerbPersonMarkerFormulas, verbPersonMarkerFormulasLoading] =
    useCheckLoadVerbPersonMarkerFormulas();

  useEffect(() => {
    checkLoadMdTables(tableNamesForLoad);
  }, [tableNamesForLoad]);

  useEffect(() => {
    if (curParadigmId !== paradigmIdNumber) {
      setCurParadigmId(paradigmIdNumber);
      checkLoadVerbPersonMarkerFormulas(paradigmIdNumber);
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
    verbPluralityTypeId: yup.number().integer().default(-1),
    verbNumberId: yup.number().integer().default(-1),
    verbPersonId: yup.number().integer().default(-1),
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

  //console.log("VerbPersonMarkerFormulas props.match.params.recName=", props.match.params.recName);

  if (
    mdWorkingOnLoad ||
    verbPersonMarkerFormulasLoading ||
    Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s)
  ) {
    return <Loading />;
  }

  if (
    !morphemeRanges ||
    !morphemesQuery ||
    !inflectionBlocks ||
    !inflectionTypes ||
    !morphemeRangesByInflectionBlocks ||
    !verbPluralityTypes ||
    !verbPersons ||
    !verbNumbers ||
    !verbPersonMarkerParadigms ||
    !curParadigmId ||
    !(curParadigmId in verbPersonMarkerFormulas) ||
    !verbPersonMarkerFormulas[curParadigmId] ||
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

  function getParadigmName() {
    const verbPersonMarkerParadigm = verbPersonMarkerParadigms.find(
      (f) => f.vpmpnId === curParadigmId
    );
    return `${verbPersonMarkerParadigm?.vpmpnKey}`;
  }

  const verbPluralityTypesSorted = verbPluralityTypes
    .slice()
    .sort((a, b) => a.sortId - b.sortId);

  const verbNumbersSorted = verbNumbers
    .slice()
    .sort((a, b) => a.sortId - b.sortId);

  const verbPersonsSorted = verbPersons
    .slice()
    .sort((a, b) => a.sortId - b.sortId);

  return (
    <div>
      <Row>
        <Col sm="10">
          <Link
            to={`/verbPersonMarkersOverview/verbPersonMarkerParadigms/${paradigmId}`}
            className="btn btn-primary"
          >
            <FontAwesomeIcon icon="chevron-left" /> უკან პარადიგმების სიაში
            დაბრუნება
          </Link>

          <h4>
            ზმნის პირის ნიშნების პარადიგმა {getParadigmName()} (
            {verbPersonMarkerFormulas[curParadigmId].length})
          </h4>
        </Col>
        <Col sm="2" align="right">
          {dataType.create && (
            <Link
              to={`/verbPersonMarkerFormulaEdit`}
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
            <th>ფორმულა</th>
            <th>
              <OneComboBoxControl
                controlId="verbPluralityTypeId"
                label="მრავლობითობა"
                value={frm ? frm.verbPluralityTypeId : null}
                dataMember={verbPluralityTypesSorted}
                valueMember="vptId"
                displayMember="vptName"
                getError={getError}
                onChangeValue={changeField}
                sortByDisplayMember={false}
                firstItem={{ id: -1, name: "ყველა" }}
                firstItemIsSelectable
              />
            </th>
            <th>
              <OneComboBoxControl
                controlId="verbNumberId"
                label="ზმნის რიცხვი"
                value={frm ? frm.verbNumberId : null}
                dataMember={verbNumbersSorted}
                valueMember="vnmId"
                displayMember="vnmName"
                getError={getError}
                onChangeValue={changeField}
                sortByDisplayMember={false}
                firstItem={{ id: -1, name: "ყველა" }}
                firstItemIsSelectable
              />
            </th>
            <th>
              <OneComboBoxControl
                controlId="verbPersonId"
                label="ზმნის პირი"
                value={frm ? frm.verbPersonId : null}
                dataMember={verbPersonsSorted}
                valueMember="vprId"
                displayMember="vprName"
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
          {verbPersonMarkerFormulas[curParadigmId]
            .filter((f) => filterByHeader(f, frm))
            .sort((a, b) => a.vprOrderInParadigm - b.vprOrderInParadigm)
            .map((vpmpr, index) => {
              const bl = curscrollTo?.recName === vpmpr.vpmprId;
              return (
                <tr key={vpmpr.vpmprId.toString()} ref={bl ? backLigth : null}>
                  <td className={bl ? "backLigth" : undefined}>{index + 1}</td>
                  <td className={bl ? "backLigth" : undefined}>
                    {getFormulaVisual2(
                      vpmpr.morphemeIds,
                      rangesInGroup,
                      morphemesQuery
                    )}
                  </td>
                  <td className={bl ? "backLigth" : undefined}>
                    {GetDisplayValueForLookup(
                      verbPluralityTypes,
                      vpmpr.verbPluralityTypeId,
                      "vptId",
                      "vptName"
                    )}
                  </td>
                  <td className={bl ? "backLigth" : undefined}>
                    {GetDisplayValueForLookup(
                      verbNumbers,
                      vpmpr.verbNumberId,
                      "vnmId",
                      "vnmName"
                    )}
                  </td>
                  <td className={bl ? "backLigth" : undefined}>
                    {GetDisplayValueForLookup(
                      verbPersons,
                      vpmpr.verbPersonId,
                      "vprId",
                      "vprName"
                    )}
                  </td>
                  <td width="50px">
                    <div className="btn-toolbar pull-right">
                      {(dataType.update || dataType.delete) && (
                        <Link
                          to={`/verbPersonMarkerFormulaEdit/${vpmpr.vpmprId}`}
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

export default VerbPersonMarkerFormulas;
