//MorphemesOverview.tsx

import { useEffect, useMemo, useCallback, FC } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import {
  Morpheme,
  MorphemeGroup,
  MorphemeRange,
  PhoneticsType,
} from "../masterData/mdTypes";
import { useCheckLoadMdTables } from "../appcarcass/masterdata/masterDataHooks/useCheckLoadMdTables";
import { useScroller } from "../appcarcass/hooks/useScroller";
import { NzInt } from "../appcarcass/common/myFunctions";
import Loading from "../appcarcass/common/Loading";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import { saveReturnPageName } from "../appcarcass/redux/slices/masterdataSlice";
import { useAlert } from "../appcarcass/hooks/useAlert";

const MorphemesOverview: FC = () => {
  // const { alert, isMenuLoading, flatMenu, masterData, checkLoadMdTables } =
  //   props;

  const dispatch = useAppDispatch();

  const { mdRepo, mdWorkingOnLoad, mdWorkingOnLoadingTables } = useAppSelector(
    (state) => state.masterDataState
  );

  // const { datatypesLoading, datatypes } = masterData;

  const morphemeGroups = mdRepo.morphemeGroups as MorphemeGroup[];
  const morphemeRanges = mdRepo.morphemeRanges as MorphemeRange[];
  const morphemes = mdRepo.morphemes as Morpheme[];
  const phoneticsTypes = mdRepo.phoneticsTypes as PhoneticsType[];

  const dataTypesState = useAppSelector((state) => state.dataTypesState);
  const dataTypes = dataTypesState.dataTypes as Array<DataTypeFfModel>;

  // const { mdWorkingOnLoad, morphemeGroups, morphemeRanges, morphemes, phoneticsTypes, checkLoadMdTables } = props;
  //console.log("MorphemesOverview props=", props);

  const menLinkKey = useLocation().pathname.split("/")[1];

  const tableNamesForLoad = useMemo(
    () => ["morphemeGroups", "morphemeRanges", "morphemes", "phoneticsTypes"],
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

  //const [curTabKey, curRecName, backLigth] = useTabRecscroller(props.match.params.tabKey, props.match.params.recName);
  const { tabKeyParam, recNameParam } = useParams<string>();
  const recNameNumber = NzInt(recNameParam);
  const [curscrollTo, backLigth] = useScroller<{
    tabKey: string | undefined;
    recName: number;
  }>({
    tabKey: tabKeyParam,
    recName: recNameNumber,
  });

  const morphemeGroupsSorted = useMemo(() => {
    if (!morphemeGroups) return [];
    const morphemeGroups2 = [...morphemeGroups];
    return morphemeGroups2.sort((a, b) => a.mogName.localeCompare(b.mogName));
  }, [morphemeGroups]);

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
  ) {
    return <Loading />;
  }

  const morphemeGroupsDataType = dataTypes.find(
    (f) => f.dtTable === "morphemeGroups"
  );
  const morphemeRangesDataType = dataTypes.find(
    (f) => f.dtTable === "morphemeRanges"
  );
  const morphemesDataType = dataTypes.find((f) => f.dtTable === "morphemes");

  if (
    !morphemeGroupsSorted ||
    !morphemeRanges ||
    !morphemes ||
    !phoneticsTypes ||
    !curscrollTo ||
    !morphemeGroupsDataType ||
    !morphemeRangesDataType ||
    !morphemesDataType
  ) {
    return (
      <div>
        <h5>ინფორმაციის ჩატვირთვის პრობლემა</h5>
        <AlertMessages alertKind={EAlertKind.ApiLoad} />
      </div>
    );
  }

  return (
    <div>
      <h3>მორფემების მიმოხილვა</h3>
      <h4>ტერმინები</h4>
      <p>
        <strong>მორფემის ჯგუფი</strong> - მორფემის ჯგუფის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>მორფემის რანგი</strong> - მორფემის რანგის განმარტება
        (გასაკეთებელია).
      </p>
      <p>
        <strong>მორფემა</strong> - მორფემის განმარტება (გასაკეთებელია).
      </p>

      <h4>
        მორფემის ჯგუფები ({morphemeGroupsSorted.length}){" "}
        {morphemeGroupsDataType.create && (
          <Link to={`/mdItemEdit/morphemeGroups`}> + </Link>
        )}
      </h4>
      <ol>
        {morphemeGroupsSorted.map((mog) => {
          const bl =
            curscrollTo.tabKey === "morphemeGroups" &&
            curscrollTo.recName === mog.mogId;
          return (
            <li key={mog.mogId.toString()} ref={bl ? backLigth : null}>
              {!morphemeGroupsDataType.update &&
                !morphemeGroupsDataType.delete &&
                mog.mogName}
              {(morphemeGroupsDataType.update ||
                morphemeGroupsDataType.delete) && (
                <Link
                  to={`/mdItemEdit/morphemeGroups/${mog.mogId}`}
                  className={!!bl ? "backLigth" : undefined}
                  onClick={(e) => {
                    // e.preventDefault(); ეს საჭირო არ არის, რადგან კინკზე აღარ გადადის
                    //ვინახავთ გვერდის სახელს, საიდანაც მოხდა რედაქტორის გახსნა. იმისათვისმ რომ კორექტულად მოხდეს უკან დაბრუნება
                    dispatch(saveReturnPageName(menLinkKey));
                  }}
                >
                  {mog.mogName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      <h4>
        მორფემის რანგები ჯგუფების მიხედვით ({morphemeRanges.length}){" "}
        {morphemeRangesDataType.create && (
          <Link to={`/mdItemEdit/morphemeRanges`}> + </Link>
        )}
      </h4>

      <p>მორფემის რანგის სახელი =&gt; კოდი</p>

      {morphemeGroupsSorted.map((mog) => {
        const mrsf = morphemeRanges.filter(
          (mr) => mr.morphemeGroupId === mog.mogId
        );
        return (
          <div key={mog.mogId.toString()}>
            <h5>
              {mog.mogName} ({mrsf.length})
            </h5>

            <ol>
              {mrsf
                .sort((a, b) => a.mrPosition - b.mrPosition)
                .map((mr) => {
                  const bl =
                    curscrollTo.tabKey === "morphemeRanges" &&
                    curscrollTo.recName === mr.mrId;
                  return (
                    <li key={mr.mrId.toString()} ref={bl ? backLigth : null}>
                      {!morphemeRangesDataType.update &&
                        !morphemeRangesDataType.delete &&
                        mr.mrName}
                      {(morphemeRangesDataType.update ||
                        morphemeRangesDataType.delete) && (
                        <Link
                          to={`/mdItemEdit/morphemeRanges/${mr.mrId}`}
                          className={!!bl ? "backLigth" : undefined}
                          onClick={(e) => {
                            // e.preventDefault(); ეს საჭირო არ არის, რადგან კინკზე აღარ გადადის
                            //ვინახავთ გვერდის სახელს, საიდანაც მოხდა რედაქტორის გახსნა. იმისათვისმ რომ კორექტულად მოხდეს უკან დაბრუნება
                            dispatch(saveReturnPageName(menLinkKey));
                          }}
                        >
                          {mr.mrName}
                        </Link>
                      )}{" "}
                      =&gt; {mr.mrKey}{" "}
                      {mr.mrBaseNom === null ? "" : "არის ფუძე"}
                      {mr.mrBaseRequired
                        ? ", დერივაციაში ან ფლექსიაში ამ ფუძის არჩევა აუცილებლად უნდა მოხდეს"
                        : ""}
                      {mr.mrSelectable || mr.mrInflectionSelectable
                        ? "თავისუფალი მორფემა"
                        : ""}
                      {mr.mrSelectable && mr.mrInflectionSelectable
                        ? " დერივაციაში და ფლექსიაში"
                        : (mr.mrSelectable ? " დერივაციაში" : "") +
                          (mr.mrInflectionSelectable ? " ფლექსიაში" : "")}
                    </li>
                  );
                })}
            </ol>
          </div>
        );
      })}

      <h4>
        მორფემები ({morphemes.length}){" "}
        {morphemesDataType.create && <Link to={`/morphemeEdit`}> + </Link>}
      </h4>

      {morphemeGroupsSorted.map((mog) => {
        const mrsf = morphemeRanges.filter(
          (mr) => mr.morphemeGroupId === mog.mogId
        );
        const mrsfmin = Math.min(
          ...mrsf.map((mr) => {
            const mfrnoms = morphemes
              .filter((mf) => mf.morphemeRangeId === mr.mrId)
              .map((mf) => mf.mrpNom);
            //console.log("mfrnoms = ", mfrnoms);
            return Math.min(...mfrnoms);
          })
        );
        const mrsfmax = Math.max(
          ...mrsf.map((mr) => {
            const mfrnoms = morphemes
              .filter((mf) => mf.morphemeRangeId === mr.mrId)
              .map((mf) => mf.mrpNom);
            return Math.max(...mfrnoms);
          })
        );
        const list = [];
        for (let i = mrsfmin; i <= mrsfmax; i++) {
          list.push(i);
        }
        //console.log("MorphemesOverview {mrsfmin, mrsfmax, list} = ", {mrsfmin, mrsfmax, list});
        return (
          <div key={mog.mogId.toString()}>
            <h5>{mog.mogName}</h5>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  {mrsf
                    .sort((a, b) => a.mrPosition - b.mrPosition)
                    .map((mr) => {
                      return <th key={mr.mrId.toString()}>{mr.mrKey}</th>;
                    })}
                </tr>
              </thead>
              <tbody>
                {list.map((l) => {
                  return (
                    <tr key={`${mog.mogId}${l}`}>
                      <td>{l}</td>

                      {mrsf
                        .sort((a, b) => a.mrPosition - b.mrPosition)
                        .map((mr) => {
                          const morpheme = morphemes.find(
                            (m) =>
                              m.morphemeRangeId === mr.mrId && m.mrpNom === l
                          );
                          if (morpheme) {
                            let phoneticsTypeName = null;
                            if (morpheme.phoneticsTypeId) {
                              const phoneticsType = phoneticsTypes.find(
                                (f) => f.phtId === morpheme.phoneticsTypeId
                              );
                              if (phoneticsType)
                                phoneticsTypeName = phoneticsType.phtName;
                            }
                            const bl =
                              curscrollTo.tabKey === "mrp" &&
                              curscrollTo.recName === morpheme.mrpId;
                            const morphemeShow =
                              (morpheme.mrpMorpheme
                                ? morpheme.mrpMorpheme
                                : "_") +
                              (phoneticsTypeName
                                ? ` (${phoneticsTypeName})`
                                : "");
                            return (
                              <td
                                key={mr.mrId.toString()}
                                ref={bl ? backLigth : null}
                              >
                                {!morphemesDataType.update &&
                                  !morphemesDataType.delete &&
                                  morphemeShow}
                                {(morphemesDataType.update ||
                                  morphemesDataType.delete) && (
                                  <Link
                                    to={`/morphemeEdit/${morpheme.mrpId}`}
                                    className={!!bl ? "backLigth" : undefined}
                                  >
                                    {morphemeShow}
                                  </Link>
                                )}
                              </td>
                            );
                          } else return <td key={mr.mrId.toString()}> </td>;
                        })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        );
      })}
    </div>
  );
};

export default MorphemesOverview;

// function mapStateToProps(state) {
//   const alert = state.alert;
//   const { isMenuLoading, flatMenu } = state.navMenu;
//   const masterData = state.masterData;

//   return {alert, isMenuLoading, flatMenu, masterData };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     checkLoadMdTables: (tableNames) => dispatch(MasterDataActions.checkLoadMdTables(tableNames)),
//     saveReturnPageName: (pageName) => dispatch(MasterDataActions.saveReturnPageName(pageName))
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(MorphemesOverview);
