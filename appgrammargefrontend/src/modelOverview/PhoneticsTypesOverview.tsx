//PhoneticsTypesOverview.tsx

import { useEffect, useMemo, useCallback, type FC } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "../appcarcass/redux/hooks";
import type {
    PhoneticsChange,
    PhoneticsOption,
    PhoneticsOptionDetail,
    PhoneticsType,
    PhoneticsTypeProhibition,
} from "../masterData/mdTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { NzInt } from "../appcarcass/common/myFunctions";
import { useScroller } from "../appcarcass/hooks/useScroller";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import type { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import {
    GetOnePhoneticsTypeProhibitionDescription,
    GetOnephoneticsOptionDetailDescription,
} from "./PhoneticsTypeModule";
import { useAlert } from "../appcarcass/hooks/useAlert";
import { ETableName } from "../masterData/tableNames";

const PhoneticsTypesOverview: FC = () => {
    const { mdataRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } =
        useAppSelector((state) => state.masterDataState);

    const phoneticsOptions = mdataRepo[
        ETableName.PhoneticsOptions
    ] as PhoneticsOption[];
    const phoneticsTypes = mdataRepo[
        ETableName.PhoneticsTypes
    ] as PhoneticsType[];
    const phoneticsOptionDetails = mdataRepo[
        ETableName.PhoneticsOptionDetails
    ] as PhoneticsOptionDetail[];
    const phoneticsTypeProhibitions = mdataRepo[
        ETableName.PhoneticsTypeProhibitions
    ] as PhoneticsTypeProhibition[];
    const phoneticsChanges = mdataRepo[
        ETableName.PhoneticsChanges
    ] as PhoneticsChange[];

    const dataTypesState = useAppSelector((state) => state.dataTypesState);
    const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

    const menLinkKey = useLocation().pathname.split("/")[1];

    const tableNamesForLoad = useMemo(
        () => [
            ETableName.PhoneticsOptions,
            ETableName.PhoneticsTypes,
            ETableName.PhoneticsOptionDetails,
            ETableName.PhoneticsTypeProhibitions,
            ETableName.PhoneticsChanges,
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
    }, [
        isMenuLoading,
        flatMenu,
        // isValidPage,
        // checkLoadMdTables,
        tableNamesForLoad,
    ]);

    const { tabKeyParam, recNameParam } = useParams<string>();
    const recNameNumber = NzInt(recNameParam);
    const [curscrollTo, backLigth] = useScroller<{
        tabKey: string | undefined;
        recName: number;
    }>({
        tabKey: tabKeyParam,
        recName: recNameNumber,
    });

    const phoneticsOptionsSorted = useMemo(() => {
        if (!phoneticsOptions) return [];
        const phoneticsOptions2 = [...phoneticsOptions];
        return phoneticsOptions2.sort((a, b) =>
            a.phoName.localeCompare(b.phoName)
        );
    }, [phoneticsOptions]);

    const phoneticsTypesSorted = useMemo(() => {
        if (!phoneticsTypes) return [];
        const phoneticsTypes2 = [...phoneticsTypes];
        return phoneticsTypes2.sort((a, b) =>
            a.phtName.localeCompare(b.phtName)
        );
    }, [phoneticsTypes]);

    // {phoneticsTypes
    //   .sort((a, b) => a.phtName.localeCompare(b.phtName))

    const phoneticsTypesDataType = dataTypes.find(
        (f) => f.dtTable === "phoneticsTypes"
    );
    const phoneticsOptionsDataType = dataTypes.find(
        (f) => f.dtTable === "phoneticsOptions"
    );

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
        isMenuLoading
    )
        return <Loading />;

    if (
        !phoneticsOptions ||
        !phoneticsTypes ||
        !phoneticsOptionDetails ||
        !phoneticsTypeProhibitions ||
        !phoneticsChanges ||
        !curscrollTo ||
        !dataTypes ||
        !phoneticsOptionsDataType ||
        !phoneticsTypesDataType
    ) {
        return (
            <div>
                <h5>ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );
    }

    return (
        <div>
            <h3>ფონეტიკური ცვლილებების მიმოხილვა</h3>
            <h4>ტერმინები</h4>
            <p>
                <strong>ფონეტიკური ცვლილების ვარიანტი</strong> - ერთი ან
                რამდენიმე მოქმედების თანმიმდევრობა, რომელიც საჭიროა შესრულდეს
                ფუძის შესაცვლელად ერთ კონკრეტულ შემთხვევაში.
            </p>
            <p>
                <strong>ფონეტიკური ცვლილების ტიპი</strong> - ფონეტიკური
                ვარიანტები კომპლექტი, რომელიც დასაშვებია კონკრეტული ფუძისათვის
            </p>
            <p>
                <strong>ფონეტიკური ცვლილება</strong> - ფონეტიკური ტიპის
                კონკრეტული ფონეტიკური ვარიანტი
            </p>
            <p>
                <strong>ფონეტიკური ტიპის შეზღუდვა</strong> - იმისათვის, რომ
                ფონეტიკურ ტიპში შემავალმა ყველა ვარიანტმა იმუშავოს ზოგიერთ
                ფონეტიკურ ტიპს გააჩნია ერთი ან რამდენიმე შეზღუდვა
            </p>
            <p>
                <strong>ფონეტიკური ვარიანტის მოქმედება</strong> - ფონეტიკური
                ვარიანტის შესაბამისი ცვლილებების შესასრულებლად ჩასატარებელი ერთი
                კონკრეტული მოქმედება
            </p>
            <h4>ფონეტიკური ვარიანტები ({phoneticsOptions.length})</h4>
            {phoneticsOptionsDataType.create && (
                <Link to={"/phoneticsOptionEdit"}>
                    ახალი ფონეტიკური ვარიანტის შექმნა
                </Link>
            )}
            <p>
                ფონეტიკური ვარიანტის სახელი ={">"} მოქმედებები ={">"} (აქ
                ჩაემატება რამდენჯერ არის გამოყენებული თითოეული ფონეტიკური
                ვარიანტი დერივაციაში და ერთი ან რამდენიმე ნიმუში დრივაციიდან)
            </p>
            <ol>
                {phoneticsOptionsSorted.map((pho) => {
                    const phodActions = phoneticsOptionDetails
                        .filter((phod) => phod.phoneticsOptionId === pho.phoId)
                        .sort((a, b) => a.phodActOrd - b.phodActOrd);
                    const bl =
                        curscrollTo.tabKey === "phoneticsOption" &&
                        curscrollTo.recName === pho.phoId;
                    return (
                        <li
                            key={pho.phoId.toString()}
                            ref={bl ? backLigth : null}
                        >
                            {(phoneticsOptionsDataType.delete ||
                                phoneticsOptionsDataType.update) && (
                                <Link
                                    to={`/phoneticsOptionEdit/${pho.phoId}`}
                                    className={!!bl ? "backLigth" : undefined}
                                >
                                    {pho.phoName}
                                </Link>
                            )}
                            {!phoneticsOptionsDataType.delete &&
                                !phoneticsOptionsDataType.update &&
                                pho.phoName}{" "}
                            ={">"}{" "}
                            {phodActions.map((phoda, ind) => {
                                let separator = "";
                                if (ind > 0) {
                                    switch (ind) {
                                        case 1:
                                            separator = " და შემდეგ ";
                                            break;
                                        default:
                                            separator = " ხოლო შემდეგ ";
                                            break;
                                    }
                                }
                                return (
                                    <span key={ind.toString()}>
                                        {separator}
                                        {GetOnephoneticsOptionDetailDescription(
                                            phoda
                                        )}
                                    </span>
                                );
                            })}
                        </li>
                    );
                })}
            </ol>
            <h4>ფონეტიკური ტიპები ({phoneticsTypes.length})</h4>
            {phoneticsTypesDataType.create && (
                <Link to={"/phoneticsTypeEdit"}>
                    ახალი ფონეტიკური ტიპის შექმნა
                </Link>
            )}
            <p>
                ფონეტიკური ტიპის სახელი ={">"} ბოლო ბგერა ={">"} ხმოვნების
                რაოდენობა ={">"} (აქ ჩაემატება რამდენჯერ არის გამოყენებული
                თითოეული ფონეტიკური ტიპი სახელისა და ზმნის ფლექსიაში ერთი ან
                რამდენიმე ნიმუშის მოტანით)
            </p>

            <ol>
                {phoneticsTypesSorted.map((pht) => {
                    //phtLastLetter - 0;თანხმოვანი;1;ხმოვანი;2;სულერთია
                    //phtSlab - 0;მინიმუმ;1;ზუსტად;2;მაქსიმუმ
                    //phtSlabCount
                    let lastLetText = "ბოლო ბგერა უნდა იყოს თანხმოვანი";
                    if (pht.phtLastLetter === 1)
                        lastLetText = "ბოლო ბგერა უნდა იყოს ხმოვანი";
                    else if (pht.phtLastLetter === 2)
                        lastLetText =
                            "სულერთია ბოლო ბგერა ხმოვანი იქნება თუ თანხმოვანი";

                    let slab = "მინიმუმ";
                    if (pht.phtSlab === 1) slab = "ზუსტად";
                    else if (pht.phtSlab === 2) slab = "მაქსიმუმ";

                    let slabText = `ხმოვნების რაოდენობა უნდა იყოს ${slab} ${pht.phtSlabCount.toString()}`;
                    if (pht.phtSlabCount === 0) {
                        slabText = `ხმოვნების რაოდენობა სულერთია რამდენი იქნება`;
                        if (pht.phtSlab !== 0)
                            slabText = `არცერთი ხმოვანი არ უნდა იყოს`;
                    }

                    const phtProhibitions = phoneticsTypeProhibitions
                        .filter((phtp) => {
                            if (phtp.phoneticsTypeId !== pht.phtId)
                                return false;
                            if (phtp.phtpProhId === 1 && !phtp.phtpNew)
                                //აქ გათვალისწინებულია, რომ არ შეიძლება იყოს ერთ-ერთი ცარელა ნიმუშით
                                return false;
                            if (
                                phtp.phtpProhId !== 1 &&
                                !phtp.phtpNew &&
                                !phtp.phtpObject
                            )
                                //აქ გათვალისწინებულია, რომ არ შეიძლება იყოს ცარელა ნიმუშით ბგერა, რადგან გაუგებარია მოთხოვნა
                                return false; //ასეთი შემთხვევა დაფიქსირებულია შუამარცვალდამკარგველისათვის.
                            return true;
                        })
                        .sort((a, b) => a.phtpProhOrd - b.phtpProhOrd);
                    let prohText = "დამატებითი შეზღუდვები არ არის";
                    if (phtProhibitions.length > 0) {
                        prohText = phtProhibitions
                            .map((phtp, ind) => {
                                //phtpProhId 0;იყოს;1;იყოს ერთ-ერთი;2;არ იყოს
                                //phtpOrient 0;ბოლოდან;1;თავიდან
                                //phtpObject 0;ბგერა;1;ხმოვანი;2;თანხმოვანი

                                let separator = "";
                                if (ind > 0) {
                                    switch (ind) {
                                        case 1:
                                            separator = " და ";
                                            break;
                                        case 2:
                                            separator = " გარდა ამისა ";
                                            break;
                                        default:
                                            separator = " ასევე ";
                                            break;
                                    }
                                }

                                return (
                                    separator +
                                    GetOnePhoneticsTypeProhibitionDescription(
                                        phtp
                                    )
                                );
                            })
                            .join("");
                    }
                    //tabKey, recName
                    //console.log("PhoneticsTypesOverview {tabKey, recName}=", {tabKey, recName});
                    //console.log("PhoneticsTypesOverview (tabKey === 'pht' && recName === pht.phtName)=", (tabKey === 'pht' && recName === pht.phtName));
                    const bl =
                        curscrollTo.tabKey === "phoneticstype" &&
                        curscrollTo.recName === pht.phtId;
                    return (
                        <li key={pht.phtId} ref={bl ? backLigth : null}>
                            {(phoneticsTypesDataType.delete ||
                                phoneticsTypesDataType.update) && (
                                <Link
                                    to={`/phoneticsTypeEdit/${pht.phtId}`}
                                    className={!!bl ? "backLigth" : undefined}
                                >
                                    {pht.phtName}
                                </Link>
                            )}
                            {!phoneticsTypesDataType.delete &&
                                !phoneticsTypesDataType.update &&
                                pht.phtName}{" "}
                            ={">"} {lastLetText} ={">"} {slabText} ={">"}{" "}
                            {prohText} ={">"} აქვს შემდეგი ფონეტიკური
                            ვარიანტები:
                            <ul>
                                {phoneticsChanges
                                    .filter(
                                        (ffc) =>
                                            ffc.phoneticsTypeId === pht.phtId
                                    )
                                    .sort(
                                        (a, b) =>
                                            a.phoneticsTypeByPhoneticsOptionOrderNom -
                                            b.phoneticsTypeByPhoneticsOptionOrderNom
                                    )
                                    .map((fc, ind) => {
                                        const phoar = phoneticsOptions.find(
                                            (pho) =>
                                                pho.phoId ===
                                                fc.phoneticsOptionId
                                        );
                                        if (phoar)
                                            return (
                                                <li key={phoar.phoId}>
                                                    {phoar.phoName}
                                                </li>
                                            );
                                        return (
                                            <div key={fc.phoneticsOptionId} />
                                        );
                                    })}
                            </ul>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default PhoneticsTypesOverview;
