//RootDerivationTree.tsx

import { useState, useEffect, useMemo, useCallback, type FC } from "react";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./RootDerivationTree.css";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useAppSelector } from "../appcarcass/redux/hooks";
import WaitPage from "../appcarcass/common/WaitPage";
// import {
//   Classifier,
//   DerivationType,
//   InflectionType,
//   Pronoun,
// } from "../redux/types/masterDataTypes";
// import {
//   Classifier,
//   DerivationType,
//   InflectionType,
//   Pronoun,
// } from "../redux/types/masterDataTypes";
import type { DerivationBranchModel } from "../redux/types/rootsTypes";
import StatusPart from "./StatusPart";
import Paradigm from "./Paradigm";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useRootById } from "./RootsHooks/useRootById";
import { useAlert } from "../appcarcass/hooks/useAlert";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { useScroller } from "../appcarcass/hooks/useScroller";
import type {
    Classifier,
    DerivationType,
    InflectionType,
} from "../masterData/mdTypes";

const RootDerivationTree: FC = () => {
    const [currentRootId, setCurrentRootId] = useState<number | null>(null);
    const [currentDerivId, setCurrentDerivId] = useState<number | null>(null);
    const [currentInflId, setCurrentInflId] = useState<number | null>(null);
    const [currentIvcId, setCurrentIvcId] = useState<number | null>(null);

    const { rootId, dbrId, infId, ivcId } = useParams<string>();

    // console.log("RootDerivationTree useParams { rootId, dbrId, infId, ivcId }=", {
    //   rootId,
    //   dbrId,
    //   infId,
    //   ivcId,
    // });

    const [LoadRootById] = useRootById();

    const rootIdNumber = NzInt(rootId);
    const dbrIdNumber = NzInt(dbrId);
    const infIdNumber = NzInt(infId);
    const ivcIdNumber = NzInt(ivcId);

    const [curscrollTo, backLigth] = useScroller<{
        rootId: number;
        dbrId: number;
        infId: number;
        ivcId: number;
    }>({
        rootId: rootIdNumber,
        dbrId: dbrIdNumber,
        infId: infIdNumber,
        ivcId: ivcIdNumber,
    });

    const { isMenuLoading, flatMenu } = useAppSelector(
        (state) => state.navMenuState
    );

    const { rootLoading, rootsRepo } = useAppSelector(
        (state) => state.rootsState
    );

    const { mdWorkingOnLoadingListData, mdWorkingOnLoadingTables, mdataRepo } =
        useAppSelector((state) => state.masterDataState);

    //const pronouns = mdRepo.pronouns as Pronoun[];
    const classifiers = mdataRepo.classifiers as Classifier[];
    const derivationTypes = mdataRepo.derivationTypes as DerivationType[];
    const inflectionTypes = mdataRepo.inflectionTypes as InflectionType[];

    const menLinkKey = "basesearch";

    const isValidPage = useCallback(() => {
        if (!flatMenu) {
            return false;
        }
        return flatMenu.find((f) => f.menLinkKey === menLinkKey);
    }, [flatMenu, menLinkKey]);

    useEffect(() => {
        const menuItem = isValidPage();
        if (!menuItem) return;

        if (currentRootId !== rootIdNumber) {
            setCurrentRootId(rootIdNumber);
            LoadRootById(rootIdNumber);
        }
        if (currentDerivId !== dbrIdNumber) {
            setCurrentDerivId(dbrIdNumber);
            //console.log("RootDerivationTree useEffect dbrId=", dbrId)
        }
        if (currentInflId !== infIdNumber) {
            setCurrentInflId(infIdNumber);
            //console.log("RootDerivationTree useEffect dbrId=", dbrId)
        }
        if (currentIvcId !== ivcIdNumber) {
            setCurrentIvcId(ivcIdNumber);
            //console.log("RootDerivationTree useEffect ivcId=", ivcId)
        }
    }, [
        isMenuLoading,
        flatMenu,
        rootIdNumber,
        dbrIdNumber,
        infIdNumber,
        ivcIdNumber,
        currentRootId,
        currentDerivId,
        currentInflId,
        currentIvcId,
        // isValidPage,
        // LoadRootById,
    ]); //, autoscroll

    const tableNamesForLoad = useMemo(
        () => [
            /*"pronouns",*/ "classifiers",
            "derivationTypes",
            "inflectionTypes",
        ],
        []
    );

    const [checkLoadMdTables] = useCheckLoadMdTables();

    //მიუხედავად იმისა, რომ ეფექტისთვის გადაწოდებული ფუნქცია მხოლოდ ერთ ბრძანებას შეიცავს, მაინც საჭირო გახდა {} -ის გამოყენება
    useEffect(() => {
        checkLoadMdTables(tableNamesForLoad);
    }, [tableNamesForLoad]); //checkLoadMdTables - ჩამტვირთავი მეთოდების ჩანატება useEffect-ის დამოკიდებულებებში იწვევს ჩაციკვლას

    const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

    if (ApiLoadHaveErrors)
        return (
            <div>
                <h5>ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );

    if (
        rootLoading ||
        mdWorkingOnLoadingListData ||
        Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
        isMenuLoading
    )
        return <WaitPage />;

    if (!currentRootId) return <div></div>;

    const oneRootData = rootsRepo[currentRootId];

    if (
        !oneRootData ||
        //!pronouns ||
        !classifiers ||
        !derivationTypes ||
        !inflectionTypes ||
        !curscrollTo ||
        !flatMenu
    ) {
        return (
            <div>
                <h5>ინფორმაციის ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );
    }

    const {
        branches,
        verbInflections,
        nounInflections,
        inflectionVerbCompositions,
    } = oneRootData;

    function GetClassifierById(classifierId: number | null) {
        if (classifierId === null) return null;
        const classifier = classifiers.find((f) => f.clfId === classifierId);
        return classifier ? `(${classifier.clfName})` : null;
    }

    function GetColorByInflectionType(inflectionTypeId: number) {
        const inflectionType = inflectionTypes.find(
            (f) => f.iftId === inflectionTypeId
        );
        return inflectionType ? inflectionType.iftFileName : null;
    }

    function GetColorByDerivationType(derivationTypeId: number) {
        const derivationType = derivationTypes.find(
            (f) => f.drtId === derivationTypeId
        );
        return derivationType ? derivationType.drtFolderName : "Yellow";
    }

    function getBranches(branch: DerivationBranchModel, isRoot = false) {
        //console.log("RootDerivationTree getBranches branch=", branch);
        const subBranches = branches
            .filter((brn) =>
                brn.derivationPredecessors.some(
                    (dp) => dp.parentBranchId === branch.dbrId
                )
            )
            .sort((a, b) =>
                (!!a.dbrBaseName ? a.dbrBaseName : "").localeCompare(
                    !!b.dbrBaseName ? b.dbrBaseName : ""
                )
            );

        const subVerbInflections = verbInflections
            .filter((vin) =>
                vin.inflectionPredecessors.some(
                    (ip) => ip.parentBranchId === branch.dbrId
                )
            )
            .sort((a, b) =>
                (!!a.infName ? a.infName : "").localeCompare(
                    !!b.infName ? b.infName : ""
                )
            );

        const subNounInflections = nounInflections
            .filter((nin) =>
                nin.inflectionPredecessors.some(
                    (ip) => ip.parentBranchId === branch.dbrId
                )
            )
            .sort((a, b) =>
                (!!a.infName ? a.infName : "").localeCompare(
                    !!b.infName ? b.infName : ""
                )
            );

        return (
            <ul className="tree">
                {subVerbInflections.map((svi) => {
                    const subInflectionVerbCompositions =
                        inflectionVerbCompositions
                            .filter((ivc) =>
                                ivc.inflectionVerbCompositionPredecessors.some(
                                    (ip) => ip.parentInflectionId === svi.infId
                                )
                            )
                            .sort((a, b) =>
                                (!!a.ivcName ? a.ivcName : "").localeCompare(
                                    !!b.ivcName ? b.ivcName : ""
                                )
                            );
                    //console.log("RootDerivationTree subVerbInflection svi=", svi);

                    const colorName = GetColorByInflectionType(
                        svi.inflectionTypeId
                    );
                    const inflBackLight =
                        !curscrollTo?.ivcId && curscrollTo?.infId === svi.infId;

                    return (
                        //autoscroll &&
                        <li
                            key={svi.infId}
                            ref={inflBackLight ? backLigth : undefined}
                        >
                            <Link
                                to={`/root/${currentRootId}/${branch.dbrId}/${svi.infId}`}
                                className={
                                    inflBackLight ? "backLigth" : undefined
                                }
                            >
                                <FontAwesomeIcon
                                    icon="file-alt"
                                    color={colorName ?? undefined}
                                />{" "}
                            </Link>
                            <Link
                                to={`/inflEdit/${svi.infId}/${branch.dbrId}/${currentRootId}`}
                                className={
                                    inflBackLight ? "backLigth" : undefined
                                }
                            >
                                {svi.infName ? svi.infName : "(---)"}{" "}
                                {svi.infSamples ? `(${svi.infSamples})` : ""}{" "}
                                {GetClassifierById(svi.classifierId)}{" "}
                                {svi.recordStatusId !== 2 && (
                                    <StatusPart
                                        recordStatusId={svi.recordStatusId}
                                        creator={svi.creator}
                                    />
                                )}
                            </Link>

                            <ul className="tree">
                                {subInflectionVerbCompositions.map((sivc) => {
                                    //console.log("RootDerivationTree subInflectionVerbCompositions svi=", svi);
                                    const colorName = "Lime";
                                    const ivcBackLight =
                                        curscrollTo?.ivcId === sivc.ivcId;

                                    return (
                                        //autoscroll &&
                                        <li
                                            key={sivc.ivcId}
                                            ref={
                                                ivcBackLight
                                                    ? backLigth
                                                    : undefined
                                            }
                                        >
                                            <Link
                                                to={`/root/${currentRootId}/${branch.dbrId}/${svi.infId}/${sivc.ivcId}`}
                                                className={
                                                    ivcBackLight
                                                        ? "backLigth"
                                                        : undefined
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon="file-alt"
                                                    color={colorName}
                                                />{" "}
                                            </Link>
                                            <Link
                                                to={`/inflVerbCompEdit/${sivc.ivcId}/${svi.infId}/${branch.dbrId}/${currentRootId}`}
                                                className={
                                                    ivcBackLight
                                                        ? "backLigth"
                                                        : undefined
                                                }
                                            >
                                                {sivc.ivcName
                                                    ? sivc.ivcName
                                                    : "(---)"}{" "}
                                                {sivc.ivcSamples
                                                    ? `(${sivc.ivcSamples})`
                                                    : ""}{" "}
                                                {GetClassifierById(
                                                    sivc.classifierId
                                                )}{" "}
                                                {sivc.recordStatusId !== 2 && (
                                                    <StatusPart
                                                        recordStatusId={
                                                            sivc.recordStatusId
                                                        }
                                                        creator={sivc.creator}
                                                    />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    );
                })}
                {subNounInflections.map((sni) => {
                    //console.log("RootDerivationTree subNounInflections sni=", sni);
                    const colorName = GetColorByInflectionType(
                        sni.inflectionTypeId
                    );
                    const inflBackLight =
                        curscrollTo &&
                        !curscrollTo.ivcId &&
                        curscrollTo.infId === sni.infId;
                    return (
                        //autoscroll &&
                        <li
                            key={sni.infId}
                            ref={inflBackLight ? backLigth : undefined}
                        >
                            <Link
                                to={`/root/${currentRootId}/${branch.dbrId}/${sni.infId}`}
                                className={
                                    inflBackLight ? "backLigth" : undefined
                                }
                            >
                                <FontAwesomeIcon
                                    icon="file-alt"
                                    color={colorName ?? undefined}
                                />{" "}
                            </Link>
                            <Link
                                to={`/inflEdit/${sni.infId}/${branch.dbrId}/${currentRootId}`}
                                className={
                                    inflBackLight ? "backLigth" : undefined
                                }
                            >
                                {sni.infName ? sni.infName : "(---)"}{" "}
                                {sni.infSamples ? `(${sni.infSamples})` : ""}{" "}
                                {GetClassifierById(sni.classifierId)}{" "}
                                {sni.recordStatusId !== 2 && (
                                    <StatusPart
                                        recordStatusId={sni.recordStatusId}
                                        creator={sni.creator}
                                    />
                                )}
                            </Link>
                        </li>
                    );
                })}
                {subBranches.map((brn) => {
                    const colorName = GetColorByDerivationType(brn.drtId);
                    //console.log("RootDerivationTree brn=", brn)
                    //console.log("RootDerivationTree brn.drtId=", brn.drtId)
                    //console.log("RootDerivationTree colorName=", colorName)
                    const derivBackLight =
                        curscrollTo &&
                        !curscrollTo.ivcId &&
                        !curscrollTo.infId &&
                        brn.dbrId === curscrollTo.dbrId;
                    //console.log("RootDerivationTree curscrollTo=", curscrollTo);
                    return (
                        //autoscroll &&
                        <li
                            key={brn.dbrId + "_" + brn.brLevel}
                            ref={derivBackLight ? backLigth : undefined}
                        >
                            <Link
                                to={`/root/${currentRootId}/${brn.dbrId}`}
                                className={
                                    derivBackLight ? "backLigth" : undefined
                                }
                            >
                                <FontAwesomeIcon
                                    icon="folder-open"
                                    color={colorName}
                                />{" "}
                            </Link>
                            <Link
                                to={`/derivEdit/${brn.dbrId}/${currentRootId}`}
                                className={
                                    derivBackLight ? "backLigth" : undefined
                                }
                            >
                                {brn.dbrBaseName ? brn.dbrBaseName : "(---)"}{" "}
                                {GetClassifierById(brn.classifierId)}{" "}
                                {brn.recordStatusId !== 2 && (
                                    <StatusPart
                                        recordStatusId={brn.recordStatusId}
                                        creator={brn.creator}
                                    />
                                )}
                            </Link>
                            {getBranches(brn)}
                        </li>
                    );
                })}
            </ul>
        );
    }

    if (!oneRootData.branches || oneRootData.branches.length === 0)
        return (
            <div id="root-deriv-tree">
                <h5>დერივაციის ტოტების ჩატვირთვა ვერ მოხერხდა</h5>
            </div>
        );

    const firstBranch = oneRootData.branches.find(
        (brn) => brn.dbrId === oneRootData.root.rootFirstBranchId
    );

    if (!firstBranch)
        return (
            <div id="root-deriv-tree">
                <h5>ძირის ტოტის დადგენა ვერ მოხერხდა</h5>
            </div>
        );

    const { rootName, rootHomonymIndex, rootNote } = oneRootData.root;
    //console.log("RootDerivationTree currentDerivId=", currentDerivId)
    const { recordStatusId, classifierId, creator } = firstBranch;
    const colorName = GetColorByDerivationType(firstBranch.drtId);
    //console.log("RootDerivationTree firstBranch.drtId=", firstBranch.drtId)
    //console.log("RootDerivationTree firstBranch colorName=", colorName)

    const rootBackLight =
        curscrollTo &&
        !curscrollTo.ivcId &&
        !curscrollTo.infId &&
        !curscrollTo.dbrId;

    return (
        //autoscroll &&
        <Row className="editor-row">
            <Col md="6" className="editor-column">
                <div id="root-deriv-tree" className="editor-scroll">
                    <h5 ref={rootBackLight ? backLigth : undefined}>
                        <Link
                            to={`/root/${currentRootId}`}
                            className={rootBackLight ? "backLigth" : undefined}
                        >
                            <FontAwesomeIcon
                                icon="folder-open"
                                color={colorName}
                            />{" "}
                        </Link>
                        <Link
                            to={"/rootEdit/" + currentRootId}
                            className={rootBackLight ? "backLigth" : undefined}
                        >
                            ძირი: {rootName}
                            {rootHomonymIndex ? (
                                <sup>{rootHomonymIndex}</sup>
                            ) : null}{" "}
                            {rootNote} {GetClassifierById(classifierId)}{" "}
                            {recordStatusId !== 2 && (
                                <StatusPart
                                    recordStatusId={recordStatusId}
                                    creator={creator}
                                />
                            )}
                        </Link>
                    </h5>
                    {getBranches(firstBranch, true)}
                </div>
            </Col>

            {!!currentInflId && (
                <Paradigm InflectionIdentifier={currentInflId} />
            )}
            {!!currentIvcId && (
                <Paradigm
                    InflectionIdentifier={currentIvcId}
                    InflectionVerbComposition
                />
            )}
        </Row>
    );
};

export default RootDerivationTree;
