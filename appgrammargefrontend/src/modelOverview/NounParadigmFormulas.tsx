//NounParadigmFormulas.tsx

import { useEffect, useState, useMemo, FC } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getFormulaVisual2 } from "./FormulasModule";
import * as yup from "yup";
import { useAppSelector } from "../appcarcass/redux/hooks";
import {
  GrammarCase,
  InflectionBlock,
  InflectionType,
  Morpheme,
  MorphemeRange,
  MorphemeRangeByInflectionBlock,
  NounNumber,
  NounParadigm,
} from "../masterData/mdTypes";
import { NzInt, filterByHeader } from "../appcarcass/common/myFunctions";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useCheckLoadNounParadigmFormulas } from "./formulasHooks/useCheckloadNounParadigmFormulas";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { useForman } from "../appcarcass/hooks/useForman";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import { GetDisplayValueForLookup } from "../appcarcass/modules/GetDisplayValue";
import { useAlert } from "../appcarcass/hooks/useAlert";

const NounParadigmFormulas: FC = () => {
  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );

  const morphemeRanges = mdRepo.morphemeRanges as MorphemeRange[];
  const morphemesQuery = mdRepo.morphemesQuery as Morpheme[];
  const inflectionBlocks = mdRepo.inflectionBlocks as InflectionBlock[];
  const inflectionTypes = mdRepo.inflectionTypes as InflectionType[];
  const morphemeRangesByInflectionBlocks =
    mdRepo.morphemeRangesByInflectionBlocks as MorphemeRangeByInflectionBlock[];
  const grammarCases = mdRepo.grammarCases as GrammarCase[];
  const nounNumbers = mdRepo.nounNumbers as NounNumber[];
  const nounParadigms = mdRepo.nounParadigms as NounParadigm[];

  const [curParadigmId, setCurParadigmId] = useState<number | null>(null);

  const { paradigmId } = useParams<string>();

  const paradigmIdNumber = NzInt(paradigmId);

  const tableNamesForLoad = useMemo(
    () => [
      "morphemeRanges",
      "morphemesQuery",
      "inflectionBlocks",
      "inflectionTypes",
      "morphemeRangesByInflectionBlocks",
      "grammarCases",
      "nounNumbers",
      "nounParadigms",
    ],
    []
  );

  const { nounParadigmFormulas } = useAppSelector(
    (state) => state.modelDataState
  );

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  const [checkLoadMdTables] = useCheckLoadMdTables();
  const [checkLoadNounParadigmFormulas, nounParadigmFormulasLoading] =
    useCheckLoadNounParadigmFormulas();

  useEffect(() => {
    checkLoadMdTables(tableNamesForLoad);
  }, [tableNamesForLoad]);

  useEffect(() => {
    if (curParadigmId !== paradigmIdNumber) {
      setCurParadigmId(paradigmIdNumber);
      checkLoadNounParadigmFormulas(paradigmIdNumber);
    }
  }, [paradigmIdNumber, curParadigmId]);

  const { recNameParam } = useParams<string>();

  const recNameNumber = NzInt(recNameParam);

  const [curscrollTo, backLigth] = useScroller<{
    recName: number;
  }>({
    recName: recNameNumber,
  });

  const yupSchema = yup.object().shape({
    grammarCaseId: yup.number().integer().default(-1),
    nounNumberId: yup.number().integer().default(-1),
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
  const dataType = dataTypes.find((f) => f.dtTable === "nounParadigms");
  const nounParadigmFormulasByParadigmId = curParadigmId
    ? nounParadigmFormulas[curParadigmId]
    : null;
  //console.log("NounParadigmFormulas curscrollTo=", curscrollTo);
  if (
    mdWorkingOnLoad ||
    mdWorkingOnLoadingTables ||
    nounParadigmFormulasLoading
  ) {
    return <Loading />;
  }

  // console.log("NounParadigmFormulas CheckLoadedData => ", {
  //   morphemeRanges,
  //   morphemesQuery,
  //   inflectionBlocks,
  //   inflectionTypes,
  //   morphemeRangesByInflectionBlocks,
  //   grammarCases,
  //   nounNumbers,
  //   nounParadigms,
  //   curParadigmId,
  //   nounParadigmFormulas,
  //   recNameNumber,
  //   curscrollTo,
  //   dataTypes,
  //   dataType,
  //   nounParadigmFormulasByParadigmId,
  // });

  if (
    !morphemeRanges ||
    !morphemesQuery ||
    !inflectionBlocks ||
    !inflectionTypes ||
    !morphemeRangesByInflectionBlocks ||
    !grammarCases ||
    !nounNumbers ||
    !nounParadigms ||
    !curParadigmId ||
    !(curParadigmId in nounParadigmFormulas) ||
    !nounParadigmFormulas[curParadigmId] ||
    nounParadigmFormulas[curParadigmId].length === 0 ||
    (recNameNumber && !curscrollTo) ||
    !dataTypes ||
    !dataType ||
    !nounParadigmFormulasByParadigmId
  ) {
    return (
      <div>
        <h5>ინფორმაციის ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  // console.log("NounParadigmFormulas inflectionBlocks=", inflectionBlocks);
  const inflectionBlock = inflectionBlocks.find(
    (f) => f.inbKey === "NounRowsBlock"
  );

  // console.log("NounParadigmFormulas inflectionBlock=", inflectionBlock);

  if (!inflectionBlock) {
    return <h5>არასწორი ფლექსიის ბლოკი</h5>;
  }

  // console.log("NounParadigmFormulas inflectionTypes=", inflectionTypes);
  const inflectionType = inflectionTypes.find(
    (f) => f.iftId === inflectionBlock.inflectionTypeId
  );

  // console.log("NounParadigmFormulas inflectionType=", inflectionType);

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
    const nounParadigm = nounParadigms.find((f) => f.npnId === curParadigmId);
    return nounParadigm?.npnName;
  }

  const grammarCasesSorted = grammarCases
    .slice()
    .sort((a, b) => a.sortId - b.sortId);

  const nounNumbersSorted = nounNumbers
    .slice()
    .sort((a, b) => a.sortId - b.sortId);

  return (
    <div>
      <Row>
        <Col sm="10">
          <Link
            to={`/nounParadigmsOverview/nounParadigms/${paradigmIdNumber}`}
            className="btn btn-primary"
          >
            <FontAwesomeIcon icon="chevron-left" /> უკან პარადიგმების სიაში
            დაბრუნება
          </Link>

          <h4>
            სახელის პარადიგმა {getParadigmName()} (
            {nounParadigmFormulasByParadigmId.length})
          </h4>
        </Col>
        <Col sm="2" align="right">
          {dataType.create && (
            <Link to={`/nounParadigmFormulaEdit`} className="btn btn-primary">
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
                controlId="grammarCaseId"
                label="ბრუნვა"
                value={frm ? frm.grammarCaseId : null}
                dataMember={grammarCasesSorted}
                valueMember="grcId"
                displayMember="grcName"
                getError={getError}
                onChangeValue={changeField}
                sortByDisplayMember={false}
                firstItem={{ id: -1, name: "ყველა" }}
                firstItemIsSelectable
              />
            </th>
            <th>
              <OneComboBoxControl
                controlId="nounNumberId"
                label="რიცხვი"
                value={frm ? frm.nounNumberId : null}
                dataMember={nounNumbersSorted}
                valueMember="nnnId"
                displayMember="nnnName"
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
          {nounParadigmFormulasByParadigmId
            .filter((f) => filterByHeader(f, frm))
            .sort((a, b) => a.nprOrderInParadigm - b.nprOrderInParadigm)
            .map((npr, index) => {
              const bl = curscrollTo?.recName === npr.nprId;
              return (
                <tr key={npr.nprId.toString()} ref={bl ? backLigth : null}>
                  <td className={bl ? "backLigth" : undefined}>{index + 1}</td>
                  <td className={bl ? "backLigth" : undefined}>
                    {npr.nprSample}
                  </td>
                  <td className={bl ? "backLigth" : undefined}>
                    {getFormulaVisual2(
                      npr.morphemeIds,
                      rangesInGroup,
                      morphemesQuery
                    )}
                  </td>
                  <td className={bl ? "backLigth" : undefined}>
                    {GetDisplayValueForLookup(
                      grammarCasesSorted,
                      npr.grammarCaseId,
                      "grcId",
                      "grcName"
                    )}
                  </td>
                  <td className={bl ? "backLigth" : undefined}>
                    {GetDisplayValueForLookup(
                      nounNumbersSorted,
                      npr.nounNumberId,
                      "nnnId",
                      "nnnName"
                    )}
                  </td>
                  <td width="50px">
                    <div className="btn-toolbar pull-right">
                      {(dataType.update || dataType.delete) && (
                        <Link
                          to={`/nounParadigmFormulaEdit/${npr.nprId}`}
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

export default NounParadigmFormulas;
