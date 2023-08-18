//BasesAndFreeMorphemes.tsx

import { Form, Row, Col, Spinner } from "react-bootstrap";

import TextBoxAutoComplete, {
  ListElement,
  listElementComponentProps,
} from "./TextBoxAutoComplete";
import BaseLink, { BaseLinkElement } from "./BaseLink";
import { FC } from "react";
import { useAppSelector } from "../appcarcass/redux/hooks";
import { BaseLinkType, RootLink } from "../redux/types/rootsTypes";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import {
  Morpheme,
  MorphemeRange,
  PhoneticsChangeModel,
  PhoneticsType,
} from "../masterData/mdTypes";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import { useBasesForDropDownList } from "./RootsHooks/useBasesForDropDownList";
import {
  funPredRoots,
  getBranchByIdFromStore,
} from "./derivationCrudHooks/derivationCommonFunctionsModule";
import { fnGetError } from "../appcarcass/hooks/useForman";
import { DerivationPredecessorModel } from "./TypesAndSchemas/DerivationBranchDataTypeAndSchema";
import { InflectionPredecessorRedModel } from "./TypesAndSchemas/InflectionDataTypeAndSchema";
// import { PhoneticsChangeModel } from "../redux/types/masterDataTypes";

type BasesAndFreeMorphemesProps = {
  ranges: MorphemeRange[];
  morphemes: number[];
  morphemesQuery: Morpheme[];
  phoneticsTypes: PhoneticsType[];
  phoneticsChangesQuery?: PhoneticsChangeModel[];
  forInflection?: boolean | undefined;
  selectPhoneticsType: boolean;
  autoPhonetics?: boolean | undefined;
  morphemesdPath: string;
  predecessors: DerivationPredecessorModel[] | InflectionPredecessorRedModel[];
  getError: fnGetError;
  onMorphemeChange: (index: number, value: number) => void;
  onPredecessorChange: (
    baseNom: number,
    baseLinkElement: BaseLinkElement
  ) => void;
  onPredecessorPhoneticsTypeChange: (index: number, value: number) => void;
};

const BasesAndFreeMorphemes: FC<BasesAndFreeMorphemesProps> = (props) => {
  // //რედაქსიდან
  // const { rootsRepo, memoBasesDict, basesForDropdownloading } = props;
  // //კონტროლის თვისებებიდან
  // const {ranges, morphemes, morphemesQuery, forInflection, phoneticsTypes, phoneticsChangesQuery, morphemesdPath, getError,
  //   selectPhoneticsType, autoPhonetics, predecessors, onMorphemeChange, onPredecessorChange, onPredecessorPhoneticsTypeChange} = props;

  const {
    ranges,
    morphemes,
    morphemesQuery,
    phoneticsTypes,
    phoneticsChangesQuery,
    forInflection,
    selectPhoneticsType,
    autoPhonetics,
    morphemesdPath,
    predecessors,
    getError,
    onMorphemeChange,
    onPredecessorChange,
    onPredecessorPhoneticsTypeChange,
  } = props;

  const { memoBasesDict, basesForDropdownloading } = useAppSelector(
    (state) => state.rootsState
  );

  const [getBasesForDropDown] = useBasesForDropDownList();
  const { rootsRepo } = useAppSelector((state) => state.rootsState);

  function getListItemById(dbrId: number) {
    let base = null;
    for (var bases of Object.values(memoBasesDict)) {
      base = bases.find((item) => item.dbrId === dbrId);
      if (base) {
        return base;
      }
    }
    return null;
  }

  function countText(baseName: string, roots: RootLink[]) {
    let text = baseName;
    if (roots && roots.length > 0)
      text +=
        " (" +
        roots
          .map((root) => {
            return `${root.rootName}${
              root.rootHomonymIndex > 0 ? `^${root.rootHomonymIndex}` : ""
            }${root.rootNote ? ` ${root.rootNote}` : ""}`;
          })
          .sort()
          .join("; ") +
        ")";
    return text;
  }

  return (
    <div>
      <OneStrongLabel
        controlId="mainParametersLabel"
        label="ფუძეები და არჩევითი მორფემები"
      />

      {ranges.map((range, index) => {
        const selectable = forInflection
          ? range.mrInflectionSelectable
          : range.mrSelectable;
        if (selectable) {
          return (
            <OneComboBoxControl
              key={index}
              controlId={`${morphemesdPath}[${index}]`}
              label={`${range.mrPosition + 1}. ${range.mrName}`}
              value={morphemes[index]}
              dataMember={morphemesQuery.filter(
                (mph) =>
                  mph.morphemeRangeId === range.mrId &&
                  mph.mrpNom >= range.minNom &&
                  mph.mrpNom <= range.maxNom
              )}
              valueMember="mrpId"
              displayMember="mrpName"
              sortByDisplayMember={false}
              getError={getError}
              onChangeValue={(fieldPath, value) => {
                onMorphemeChange(index, value);
              }}
            />
          );
        }

        //აქ თუ მოვიდა კოდი, არჩევითი მორფემის არჩევის მაგივრად საჭიროა ფუძის არჩევა

        //console.log("BaseFreeMorphsChoicer render predecessors=", predecessors);

        const curDerivPre = predecessors
          ? predecessors.find((depre) => depre.baseNom === range.mrBaseNom)
          : null;

        //console.log("BaseFreeMorphsChoicer render curDerivPre=", curDerivPre);

        const parentBranchId = curDerivPre
          ? curDerivPre.parentBranchId
          : undefined;
        const phoneticsChangeId = curDerivPre?.phoneticsChangeId
          ? curDerivPre.phoneticsChangeId
          : undefined;
        const phoneticsTypeId = curDerivPre
          ? curDerivPre.phoneticsTypeId
          : undefined;
        //console.log("BaseFreeMorphsChoicer render parentBranchId=", parentBranchId);

        const memoDictConverted = {} as {
          [key: string]: ListElement[];
        };

        //ToDo ეს გარდაქმნა ჩატვირთვის დროს უნდა მოხდეს,
        //რომ მხოლოდ ერთხელ მოხდეს ასეთი სახით შენახვა.
        //და ყოველ ჯერზე არ იყოს საჭირო ამ გარაქმნის გაკეთება.
        Object.keys(memoBasesDict).forEach((key) => {
          //memoDictConverted[key] = [] as BaseLinkElement[];
          memoDictConverted[key] = memoBasesDict[key].map(
            (value: BaseLinkType) => {
              return {
                baseLink: value,
                searchVal: key,
                itemId: value.dbrId,
              } as BaseLinkElement;
            }
          );
        });

        return (
          <div key={index}>
            <Form.Group
              className="mb-1"
              as={Row}
              controlId={`${morphemesdPath}[${index}]`}
            >
              <Form.Label column sm="4" className="text-right">{`${
                range.mrPosition + 1
              }. ${range.mrName}`}</Form.Label>
              <Col sm="6">
                <TextBoxAutoComplete
                  listElementComponent={
                    BaseLink as FC<listElementComponentProps>
                  }
                  placeholder={range.mrName}
                  formControlClassName="mr-sm-2"
                  value={parentBranchId}
                  memodict={memoDictConverted}
                  // onTextChange={(searchValue) => {
                  //   //range.text = searchValue;
                  //   if (range.mrBaseNom)
                  //     onPredecessorChange(
                  //       range.mrBaseNom,
                  //       searchValue
                  //     ); /*setBaseSearchValue(searchValue)*/
                  // }}
                  loadDropDown={(searchValue) =>
                    getBasesForDropDown(searchValue)
                  }
                  // loading={basesForDropdownloading}
                  onSelectedElement={(item) => {
                    //console.log("BaseFreeMorphsChoicer onSelectedElement {range, item}=", { range, item });
                    if (range.mrBaseNom)
                      onPredecessorChange(
                        range.mrBaseNom,
                        item as BaseLinkElement
                      );
                  }}
                  getTextByValue={(val) => {
                    //console.log("BaseFreeMorphsChoicer getTextByValue val=", val);
                    let text = "";
                    const listItemBase = getListItemById(val);
                    if (listItemBase) {
                      const { roots } = listItemBase;
                      text = countText(listItemBase.dbrBaseName, roots);
                    } else {
                      const preDerivBranch = getBranchByIdFromStore(
                        rootsRepo,
                        val
                      );
                      const predRootIds = funPredRoots(
                        preDerivBranch,
                        rootsRepo
                      );
                      const roots = predRootIds.map(
                        (rootId) => rootsRepo[rootId].root
                      );
                      text = countText(
                        preDerivBranch?.dbrBaseName ?? "",
                        roots
                      );
                    }
                    //console.log("BaseFreeMorphsChoicer getTextByValue results text=", text);
                    return text;
                  }}
                />
              </Col>
              <Col sd="2">
                {basesForDropdownloading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </Col>
            </Form.Group>

            {parentBranchId && parentBranchId > 0 && selectPhoneticsType && (
              <OneComboBoxControl
                controlId={`phoneticsTypeId${range.mrBaseNom}`}
                label={"ფონეტიკური ტიპი"}
                value={phoneticsTypeId}
                dataMember={phoneticsTypes}
                valueMember="phtId"
                displayMember="phtName"
                sortByDisplayMember={true}
                firstItem={{ id: 0, name: "უცვლელი" }}
                firstItemIsSelectable
                getError={getError}
                onChangeValue={(fieldPath, value) => {
                  if (range.mrBaseNom)
                    onPredecessorPhoneticsTypeChange(range.mrBaseNom, value);
                }}
              />
            )}

            {parentBranchId &&
              parentBranchId > 0 &&
              !selectPhoneticsType &&
              phoneticsChangesQuery !== undefined && (
                <OneComboBoxControl
                  controlId={`phoneticsChangeId${range.mrBaseNom}`}
                  label={`ფონეტიკური ${autoPhonetics ? "ტიპი" : "ცვლილება"}`}
                  value={phoneticsChangeId}
                  dataMember={phoneticsChangesQuery.filter(
                    (fc) => autoPhonetics === fc.onlyPhoneticsType
                  )}
                  valueMember="phcId"
                  displayMember="phcName"
                  sortByDisplayMember={true}
                  firstItem={{ id: 0, name: "უცვლელი" }}
                  firstItemIsSelectable
                  getError={getError}
                  onChangeValue={(fieldPath, value) => {
                    if (range.mrBaseNom)
                      onPredecessorPhoneticsTypeChange(range.mrBaseNom, value);
                  }}
                />
              )}
          </div>
        );
      })}
    </div>
  );
};

export default BasesAndFreeMorphemes;

// function mapStateToProps(state) {
//   const { rootsRepo, memoBasesDict, basesForDropdownloading } = state.derivTree;
//   return { rootsRepo, memoBasesDict, basesForDropdownloading };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     GetBasesForDropDown: (val) =>
//       dispatch(DerivTreeActions.GetBasesForDropDown(val)),
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(BasesAndFreeMorphemes);
