//DerivationFormulasOverview.tsx

import { useEffect, useMemo, useCallback, type FC } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import type {
    DerivationType,
    Morpheme,
    MorphemeGroup,
    MorphemeRange,
} from "../masterData/mdTypes";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useCheckLoadDerivationFormulas } from "./formulasHooks/useCheckLoadDerivationFormulas";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import type { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import { getFormulaVisual } from "./FormulasModule";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import { useAlert } from "../appcarcass/hooks/useAlert";
import { ETableName } from "../masterData/tableNames";

const DerivationFormulasOverview: FC = () => {
    const dispatch = useAppDispatch();

    const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
        useAppSelector((state) => state.masterDataState);

    const derivationTypes = mdataRepo[
        ETableName.DerivationTypes
    ] as DerivationType[];
    const morphemeGroups = mdataRepo[
        ETableName.MorphemeGroups
    ] as MorphemeGroup[];
    const morphemeRanges = mdataRepo[
        ETableName.MorphemeRanges
    ] as MorphemeRange[];
    const morphemesQuery = mdataRepo[ETableName.MorphemesQuery] as Morpheme[];

    const { tabKeyParam, recNameParam } = useParams<string>();

    const menLinkKey = useLocation().pathname.split("/")[1];

    const tableNamesForLoad = useMemo(
        () => [
            ETableName.DerivationTypes,
            ETableName.MorphemeGroups,
            ETableName.MorphemeRanges,
            ETableName.MorphemesQuery,
        ],
        []
    );

    const [checkLoadMdTables] = useCheckLoadMdTables();
    const [checkLoadDerivationFormulas, derivFormulasLoading] =
        useCheckLoadDerivationFormulas();

    const { isMenuLoading, flatMenu } = useAppSelector(
        (state) => state.navMenuState
    );

    const { derivationFormulas } = useAppSelector(
        (state) => state.modelDataState
    );
    const dataTypesState = useAppSelector((state) => state.dataTypesState);
    const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

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
        checkLoadDerivationFormulas();
    }, [
        isMenuLoading,
        flatMenu,
        // isValidPage,
        // checkLoadMdTables,
        // checkLoadDerivFormulas,
        tableNamesForLoad,
    ]);

    const recNameNumber = NzInt(recNameParam);

    const [curscrollTo, backLigth] = useScroller<{
        tabKey: string | undefined;
        recName: number;
    }>({
        tabKey: tabKeyParam,
        recName: recNameNumber,
    });

    const derivationTypesDataType = dataTypes.find(
        (f) => f.dtTable === "derivationTypes"
    );
    const derivationFormulasDataType = dataTypes.find(
        (f) => f.dtTable === "derivationFormulas"
    );

    // const [curscrollTo, backLigth] = useScroller({
    //   tabKey: props.match.params.tabKey,
    //   recName: NzInt(props.match.params.recName),
    // });

    const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

    if (ApiLoadHaveErrors)
        return (
            <div>
                <h5>ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );

    if (
        mdWorkingOnLoad ||
        Object.values(mdWorkingOnLoadingTables).some((s: boolean) => s) ||
        derivFormulasLoading ||
        isMenuLoading
        //  ||
        // datatypesLoading
    ) {
        return <Loading />;
    }

    if (
        !derivationTypesDataType ||
        !derivationFormulasDataType ||
        !derivationTypes ||
        !morphemeGroups ||
        !morphemeRanges ||
        !morphemesQuery ||
        !derivationFormulas ||
        !curscrollTo ||
        !dataTypes
    ) {
        return (
            <div>
                <h5>ინფორმაციის ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );
    }

    const derivationTypesSorted = [...derivationTypes].sort((a, b) =>
        a.drtName.localeCompare(b.drtName)
    );

    return (
        <div>
            <h3>დერივაციის ფორმულების მიმოხილვა</h3>
            <h4>ტერმინები</h4>
            <p>
                <strong>დერივაციის ტიპი</strong> - დერივაციის ტიპის განმარტება
                (გასაკეთებელია).
            </p>
            <p>
                <strong>დერივაციის ფორმულა</strong> - დერივაციის ფორმულის
                განმარტება (გასაკეთებელია).
            </p>
            <h4>
                დერივაციის ტიპები ({derivationTypes.length}){" "}
                {derivationTypesDataType.create && (
                    <Link to={`/mdItemEdit/derivationTypes`}> + </Link>
                )}
            </h4>
            <p>დერივაციის ტიპის სახელი =&gt; მორფემების ჯგუფი</p>
            <ol>
                {derivationTypesSorted.map((drt) => {
                    const morphgrp = morphemeGroups.find(
                        (mog) => mog.mogId === drt.morphemeGroupId
                    );
                    const bl =
                        curscrollTo.tabKey === "derivationTypes" &&
                        curscrollTo.recName === drt.drtId;
                    return (
                        <li
                            key={drt.drtId.toString()}
                            ref={bl ? backLigth : null}
                        >
                            {!derivationTypesDataType.update && (
                                <span>{drt.drtName}</span>
                            )}
                            {derivationTypesDataType.update && (
                                <Link
                                    to={`/mdItemEdit/derivationTypes/${drt.drtId}`}
                                    className={!!bl ? "backLigth" : undefined}
                                    onClick={(e) => {
                                        // e.preventDefault(); ეს საჭირო არ არის, რადგან კლინკზე აღარ გადადის
                                        //ვინახავთ გვერდის სახელს, საიდანაც მოხდა რედაქტორის გახსნა. იმისათვისმ რომ კორექტულად მოხდეს უკან დაბრუნება
                                        dispatch(
                                            saveReturnPageName(menLinkKey)
                                        );
                                    }}
                                >
                                    {drt.drtName}
                                </Link>
                            )}{" "}
                            =&gt; {morphgrp?.mogName}
                        </li>
                    );
                })}
            </ol>
            <h4>
                დერივაციის ფორმულები ტიპების მიხედვით (
                {derivationFormulas.length})
            </h4>
            {derivationFormulasDataType.create && (
                <Link to={"/derivationFormulaEdit"}>
                    დერივაციის ახალი ფორმულის შექმნა
                </Link>
            )}
            <p>დერივაციის სახელი =&gt; ფორმულა</p>
            {derivationTypesSorted.map((drt) => {
                const dfsf = derivationFormulas.filter(
                    (df) => df.derivationTypeId === drt.drtId
                );
                // console.log("DerivationFormulasOverview dfsf=", dfsf);
                const dfsfSorted = dfsf.sort(
                    (a, b) => a.formulaName?.localeCompare(b.formulaName) ?? 0
                );
                //console.log("derivationFormulaEdit curTabKey=", curTabKey);
                //console.log("derivationFormulaEdit curRecName=", curRecName);
                return (
                    <div key={drt.drtId.toString()}>
                        <h5>
                            {drt.drtName} ({dfsf.length})
                        </h5>
                        <ol>
                            {dfsfSorted.map((df) => {
                                const bl =
                                    curscrollTo.tabKey === "df" &&
                                    curscrollTo.recName === df.dfId;
                                return (
                                    <li
                                        key={df.dfId.toString()}
                                        ref={bl ? backLigth : null}
                                    >
                                        {!derivationFormulasDataType.update && (
                                            <span>{df.formulaName}</span>
                                        )}
                                        {derivationFormulasDataType.update && (
                                            <Link
                                                to={`/derivationFormulaEdit/${df.dfId}`}
                                                className={
                                                    !!bl
                                                        ? "backLigth"
                                                        : undefined
                                                }
                                                onClick={(e) => {
                                                    // e.preventDefault(); ეს საჭირო არ არის, რადგან კინკზე აღარ გადადის
                                                    //ვინახავთ გვერდის სახელს, საიდანაც მოხდა რედაქტორის გახსნა. იმისათვისმ რომ კორექტულად მოხდეს უკან დაბრუნება
                                                    dispatch(
                                                        saveReturnPageName(
                                                            menLinkKey
                                                        )
                                                    );
                                                }}
                                            >
                                                <q>{df.formulaName}</q>
                                            </Link>
                                        )}{" "}
                                        =&gt;{" "}
                                        {getFormulaVisual(
                                            drt.morphemeGroupId,
                                            df.derivationFormulaDetails,
                                            morphemeRanges,
                                            morphemesQuery
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                );
            })}
        </div>
    );
};

export default DerivationFormulasOverview;
