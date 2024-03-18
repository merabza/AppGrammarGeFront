//Paradigm.tsx

import { FC, useMemo } from "react";
import { useEffect, useState } from "react";
import { Col, Spinner, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Paradigm.css";
import {
  useLazyGetParadigmQuery,
  useLazyGetVerbCompositionParadigmQuery,
  useSaveParadigmSamplePositionsMutation,
  useSaveVerbCompositionParadigmSamplePositionsMutation,
} from "../redux/api/rootsApi";
import { useAppSelector } from "../appcarcass/redux/hooks";
import { SamplePositionModel } from "../redux/types/rootsTypes";
import WaitPage from "../appcarcass/common/WaitPage";
import MessageBox from "../appcarcass/common/MessageBox";
import { useAlert } from "../appcarcass/hooks/useAlert";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { Pronoun } from "../masterData/mdTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";

type ParadigmProps = {
  InflectionIdentifier: number;
  InflectionVerbComposition?: boolean;
};

const Paradigm: FC<ParadigmProps> = (props) => {
  const { InflectionIdentifier, InflectionVerbComposition } = props;

  console.log("Paradigm props=", props);

  const [currentInflectionlId, setcurrentInflectionlId] = useState<
    number | null
  >(null);
  const [IsInflectionVerbComposition, setIsInflectionVerbComposition] =
    useState<boolean | null | undefined>(null);

  const [samples, setSamples] = useState<SamplePositionModel[] | null>(null);

  // const {
  //   inflectionWorkingOnLoadParadigm,
  //   paradigm,
  //   GetParadigm,
  //   GetVerbCompositionParadigm,
  //   prdShowhyphens,
  //   prdShowFormulas,
  //   prdIspMorphemeNom,
  //   mdWorkingOnLoad,
  //   pronouns,
  //   user,
  //   savingParadigmSamplePositions,
  //   saveVerbCompositionParadigmSamplePositions,
  //   saveParadigmSamplePositions,
  // } = props;

  const [
    showSaveSamplePositionsConfirmMessage,
    setShowSaveSamplePositionsConfirmMessage,
  ] = useState(false);

  const [getParadigm, { isLoading: isParadigmLoading }] =
    useLazyGetParadigmQuery();
  const [
    getVerbCompositionParadigm,
    { isLoading: isVerbCompositionParadigmLoading },
  ] = useLazyGetVerbCompositionParadigmQuery();

  const {
    paradigm,
    prdIspMorphemeNom,
    prdShowhyphens,
    inflectionWorkingOnLoadParadigm,
    prdShowFormulas,
  } = useAppSelector((state) => state.rootsState);
  const { mdataRepo } = useAppSelector((state) => state.masterDataState);

  const pronouns = mdataRepo.pronouns as Pronoun[];

  // const { infId, ivcId } = useParams();
  // const infIdNumber = NzInt(infId);
  // const ivcIdNumber = NzInt(ivcId);

  const { user } = useAppSelector((state) => state.userState);
  const [
    saveParadigmSamplePositions,
    { isLoading: savingParadigmSamplePositions },
  ] = useSaveParadigmSamplePositionsMutation();
  const [
    saveVerbCompositionParadigmSamplePositions,
    { isLoading: savingVerbCompositionParadigmSamplePositions },
  ] = useSaveVerbCompositionParadigmSamplePositionsMutation();
  //console.log("Paradigm props=", props);

  const tableNamesForLoad = useMemo(() => ["pronouns"], []);

  useEffect(() => {
    //დავადგინოთ მიმდინარე იდენტიფიკატორი
    if (
      currentInflectionlId !== InflectionIdentifier ||
      IsInflectionVerbComposition !== InflectionVerbComposition
    ) {
      if (currentInflectionlId !== InflectionIdentifier) {
        setcurrentInflectionlId(InflectionIdentifier);
      }
      if (IsInflectionVerbComposition !== InflectionVerbComposition) {
        setIsInflectionVerbComposition(InflectionVerbComposition);
      }
      if (InflectionVerbComposition) {
        //console.log("Paradigm useEffect GetVerbCompositionParadigm ivcIdNumber=", ivcIdNumber);
        getVerbCompositionParadigm(InflectionIdentifier);
      } else {
        //console.log("Paradigm useEffect GetParadigm infIdNumber=", infIdNumber);
        getParadigm(InflectionIdentifier);
      }
    }

    if (isParadigmLoading || isVerbCompositionParadigmLoading || !paradigm)
      return;

    //console.log("useEffect setSamples=", paradigm.samplePositions);
    setSamples(paradigm.samplePositions);
  }, [
    InflectionIdentifier,
    InflectionVerbComposition,
    // getParadigm,
    // getVerbCompositionParadigm,
    currentInflectionlId,
    IsInflectionVerbComposition,
    isParadigmLoading,
    isVerbCompositionParadigmLoading,
    paradigm,
  ]);

  const [checkLoadMdTables] = useCheckLoadMdTables();

  useEffect(() => {
    console.log(
      "Paradigm useEffect checkLoadMdTables tableNamesForLoad=",
      tableNamesForLoad
    );
    checkLoadMdTables(tableNamesForLoad);
  }, [checkLoadMdTables, tableNamesForLoad]);

  const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

  if (ApiLoadHaveErrors)
    return (
      <Col md="4" id="inflection-paradigm">
        <div className="paradigm-scroll">
          <h5>ჩატვირთვის პრობლემა 1</h5>
          <AlertMessages alertKind={EAlertKind.ApiLoad} />
        </div>
      </Col>
    );

  console.log(
    "Paradigm {isParadigmLoading, isVerbCompositionParadigmLoading, pronouns, paradigm}=",
    { isParadigmLoading, isVerbCompositionParadigmLoading, pronouns, paradigm }
  );

  if (!pronouns || !paradigm) {
    if (isParadigmLoading || isVerbCompositionParadigmLoading)
      //თუ ინფორმაციის ჩატვირთვა ჯერ კიდევ მიმდინარეობა
      return (
        <Col md="4" id="inflection-paradigm">
          <div className="paradigm-scroll">
            <WaitPage />
          </div>
        </Col>
      );
    return (
      <Col md="4" id="inflection-paradigm">
        <div className="paradigm-scroll">
          <h5>ჩატვირთვის პრობლემა 2</h5>
          <AlertMessages alertKind={EAlertKind.ApiLoad} />
        </div>
      </Col>
    );
  }
  // if (!pronouns || !paradigm) {
  //   return (
  //     <div>
  //       <h5>ჩატვირთვის პრობლემა</h5>
  //       {/* {alertMessage && <Alert variant={alertType}>{alertMessage}</Alert>} */}
  //     </div>
  //   );
  // }

  function handleSample(segmentId: number, sequentialNumber: number) {
    //console.log("handleSample {si,wi, samples}=", {si,wi, samples});
    if (samples === null) return;
    const newSamples = [...samples];
    const sposIndex = newSamples
      ? newSamples.findIndex((itm) => {
          return (
            itm &&
            itm.segmentId === segmentId &&
            itm.sequentialNumber === sequentialNumber
          );
        })
      : -1;
    if (sposIndex !== -1) newSamples.splice(sposIndex, 1);
    else {
      //console.log("handleSample newSamples=", newSamples);
      while (newSamples.length > 2) {
        newSamples.shift();
      }
      newSamples.push({
        segmentId: segmentId,
        sequentialNumber: sequentialNumber,
      });
    }
    setSamples(newSamples);
  }

  //pronouns ცხრილი უნდა დალაგდეს იდენტიფიკატორებით და შეიქმნას მასივი, რომელშიც შესაძლებელი იქნება ნომრით, როგორც ინდექსით
  //ნაცვალსახელების ამოღება უნდა მოხდეს ამ მასივიდან

  const prons = [] as string[];
  pronouns.forEach((e) => {
    prons[e.sortId] = e.prnName;
  });

  // if ( paradigm )
  //   for(let i = 0; i < paradigm.samplePositions.length; i++)
  //     paradigm.segments[paradigm.samplePositions[i].segmentId].words[paradigm.samplePositions[i].sequentialNumber].sampleNom = i+1;

  console.log("Paradigm pronouns=", pronouns);
  console.log("Paradigm prons=", prons);

  console.log("Paradigm prdIspMorphemeNom=", prdIspMorphemeNom);
  console.log("Paradigm paradigm=", paradigm);

  let isp = "";
  const ispMorpheme = paradigm.ispMorphemes.find(
    (item) => item.ispMorphemeNom === prdIspMorphemeNom
  );
  if (ispMorpheme && ispMorpheme.ispMorphemeNom > 0)
    isp = ispMorpheme.ispMorpheme;

  return (
    <Col md="4" id="inflection-paradigm">
      <div className="paradigm-scroll">
        {inflectionWorkingOnLoadParadigm && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
        {/* {(!paradigm || !paradigm.header) && <h5>პარადიგმა</h5>} */}

        {user?.appClaims.some((s) => s === "SaveSamples") && (
          <div>
            <Button
              variant="warning"
              className="btn-space"
              onClick={(e) => {
                e.preventDefault();
                setSamples([]);
              }}
            >
              <FontAwesomeIcon icon="trash" /> გასუფთავება{" "}
            </Button>

            <Button
              variant="warning"
              className="btn-space"
              disabled={!samples}
              onClick={(e) => {
                e.preventDefault();
                setShowSaveSamplePositionsConfirmMessage(true);
              }}
            >
              <FontAwesomeIcon icon="file-export" /> შენახვა
              {(savingParadigmSamplePositions ||
                savingVerbCompositionParadigmSamplePositions) && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
            </Button>

            <MessageBox
              show={showSaveSamplePositionsConfirmMessage}
              title="ნიმუშების პოზიციების შენახვა"
              text={
                "ნიმუშების ძველი პოზიციების ადგილას მოხდება ახალი პოზიციების შენახვა, მაინც გსურთ ნიმუშების პოზიციების შენახვა?"
              }
              primaryButtonText="დიახ"
              secondaryButtonText="არა"
              onConfirmed={() => {
                setShowSaveSamplePositionsConfirmMessage(false);
                if (samples && currentInflectionlId) {
                  if (IsInflectionVerbComposition)
                    saveVerbCompositionParadigmSamplePositions({
                      ivcId: currentInflectionlId,
                      samples,
                    });
                  else
                    saveParadigmSamplePositions({
                      infId: currentInflectionlId,
                      samples,
                    });
                }
              }}
              onClosed={() => setShowSaveSamplePositionsConfirmMessage(false)}
            />
          </div>
        )}

        {/* {paradigm && paradigm.header && <h5>paradigm.header</h5>} */}
        {paradigm && paradigm.notes && <p>paradigm.notes</p>}
        {paradigm && paradigm.segments && (
          <ul>
            {paradigm.segments.map((s, si) => (
              <li key={`ps${si}`}>
                {s.header && <h6>{s.header}</h6>}

                {s.words && (
                  <ol>
                    {s.words
                      .filter((w) => prdIspMorphemeNom === 0 || w.allowIsp)
                      .map((w, wi) => {
                        const sposIndex = samples
                          ? samples.findIndex((itm) => {
                              return (
                                itm &&
                                itm.segmentId === s.segmentId &&
                                itm.sequentialNumber === w.sequentialNumber
                              );
                            })
                          : -1;
                        //const spos = sposIndex === -1 ? null : paradigm.samplePositions[sposIndex];

                        const wordView =
                          w.morphemes.join(prdShowhyphens ? "-" : "") +
                          (prdShowhyphens && !isp.startsWith("-") ? "-" : "") +
                          isp;

                        return (
                          <li
                            key={`ps${si}w${wi}`}
                            className={sposIndex !== -1 ? "backLigth" : "word"}
                            onClick={() =>
                              handleSample(s.segmentId, w.sequentialNumber)
                            }
                          >
                            {wordView}
                            {prdShowFormulas && (
                              <span>&nbsp;&nbsp;&nbsp;{w.formulaView}</span>
                            )}
                            {w.pronouns && (
                              <span>
                                &nbsp;&nbsp;&nbsp;
                                {w.pronouns.map((p) => prons[p]).join(" ")}
                              </span>
                            )}
                            {sposIndex !== -1 && (
                              <span>
                                &nbsp;&nbsp;&nbsp;(ნიმუში {sposIndex + 1})
                              </span>
                            )}
                            {/* {w.sampleNom && (
                              <span>
                                &nbsp;&nbsp;&nbsp;(ნიმუში {w.sampleNom})
                              </span>
                            )} */}
                          </li>
                        );
                      })}
                  </ol>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Col>
  );
};

export default Paradigm;
