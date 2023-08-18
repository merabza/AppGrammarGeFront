//InflectionVerbCompositionPredecessors.tsx

//InflectionVerbCompositionPredecessors.js
import { FC } from "react";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import { fnGetError } from "../appcarcass/hooks/useForman";
import { useAppSelector } from "../appcarcass/redux/hooks";
import { VerbInflectionModel } from "./TypesAndSchemas/InflectionDataTypeAndSchema";
import { inflectionVerbCompositionPredecessorsModel } from "./TypesAndSchemas/InflectionVerbCompositionDataTypeAndSchema";
import { getVerbInflectionByIdFromStore } from "./derivationCrudHooks/derivationCommonFunctionsModule";
import { useVerbsForDropDown } from "./RootsHooks/useVerbsForDropDown";

import TextBoxAutoComplete, {
  ListElement,
  listElementComponentProps,
} from "./TextBoxAutoComplete";
import VerbInflectionLink, {
  VerbInflectionElement,
} from "./VerbInflectionLink";
// import VerbInflectionLink from "./VerbInflectionLink";
// import OneStrongLabel from "../editorParts/OneStrongLabel";
// import OneComboBoxControl from "../../carcass/editorParts/OneComboBoxControl";

// import {
//   actionCreators as DerivTreeActions,
//   getVerbInflectionByIdFromStore,
// } from "./DerivationTreeStore";

type InflectionVerbCompositionPredecessorsProps = {
  predecessors: inflectionVerbCompositionPredecessorsModel[];
  onPredecessorChange: (
    verbNom: number,
    verbInflectionElement: VerbInflectionElement
  ) => void;
  getError: fnGetError;
  verbCompositionLastRanges: {
    mrId: number;
    mrKeyName: string;
  }[];
  onPredecessorLastMorphemeRangeIdChange: (
    parentNom: number,
    value: number
  ) => void;
};

const InflectionVerbCompositionPredecessors: FC<
  InflectionVerbCompositionPredecessorsProps
> = (props) => {
  // //რედაქსიდან
  // const { rootsRepo, memoVerbsDict, verbsForDropdownloading } = props;
  // //კონტროლის თვისებებიდან
  const {
    predecessors,
    verbCompositionLastRanges,
    getError,
    onPredecessorChange,
    onPredecessorLastMorphemeRangeIdChange,
  } = props;

  //console.log("InflectionVerbCompositionPredecessors props=", props);

  const [getVerbsForDropDown] = useVerbsForDropDown();
  const { rootsRepo, memoVerbsDict, verbsForDropdownloading } = useAppSelector(
    (state) => state.rootsState
  );

  function getListItemById(infId: number) {
    let Verb = null;
    for (var Verbs of Object.values(memoVerbsDict)) {
      Verb = Verbs.find((item) => item.infId === infId);
      if (Verb) {
        return Verb;
      }
    }
    return null;
  }

  const predecessorKeys = [0, 1];

  const memoDictConverted = {} as {
    [key: string]: ListElement[];
  };

  //ToDo ეს გარდაქმნა ჩატვირთვის დროს უნდა მოხდეს,
  //რომ მხოლოდ ერთხელ მოხდეს ასეთი სახით შენახვა.
  //და ყოველ ჯერზე არ იყოს საჭირო ამ გარაქმნის გაკეთება.
  Object.keys(memoVerbsDict).forEach((key) => {
    //memoDictConverted[key] = [] as BaseLinkElement[];
    memoDictConverted[key] = memoVerbsDict[key].map(
      (value: VerbInflectionModel) => {
        return {
          verbLink: value,
          searchVal: key,
          itemId: value.infId,
        } as VerbInflectionElement;
      }
    );
  });

  return (
    <div>
      <OneStrongLabel
        controlId="InflectionVerbCompositionPredecessorsLabel"
        label="წინაპარი ზმნები"
      />

      {predecessorKeys.map((predKey, index) => {
        const predecessor = predecessors ? predecessors[predKey] : null;
        const parentInflectionId = predecessor
          ? predecessor.parentInflectionId
          : undefined;
        const lastMorphemeRangeId = predecessor
          ? predecessor.lastMorphemeRangeId
          : null;

        const selectLastRange = predKey === 0;

        return (
          <div key={index}>
            <Form.Group className="mb-1" as={Row} controlId={`pred[${index}]`}>
              <Form.Label column sm="4" className="text-right">{`წინაპარი ${
                index + 1
              }`}</Form.Label>
              <Col sm="6">
                <TextBoxAutoComplete
                  listElementComponent={
                    VerbInflectionLink as FC<listElementComponentProps>
                  }
                  placeholder={`წინაპარი ${index + 1}`}
                  formControlClassName="mr-sm-2"
                  value={parentInflectionId}
                  memodict={memoDictConverted}
                  // onTextChange={(searchValue) => {
                  //   //range.text = searchValue;
                  //   onPredecessorChange(
                  //     predKey,
                  //     searchValue
                  //   ); /*setVerbSearchValue(searchValue)*/
                  // }}
                  loadDropDown={(searchValue) =>
                    getVerbsForDropDown(searchValue)
                  }
                  // loading={verbsForDropdownloading}
                  onSelectedElement={(item) => {
                    //console.log("InflectionVerbCompositionPredecessors onSelectedElement {predKey, item}=", { predKey, item });
                    onPredecessorChange(predKey, item as VerbInflectionElement);
                  }}
                  getTextByValue={(val) => {
                    //console.log("VerbFreeMorphsChoicer getTextByValue val=", val);
                    let text = "";
                    const listItemVerb = getListItemById(val);
                    if (listItemVerb) {
                      //const { roots } = listItemVerb;
                      //text = countText(listItemVerb.infName, roots);
                      text = listItemVerb.infName;
                    } else {
                      const preVerb = getVerbInflectionByIdFromStore(
                        rootsRepo,
                        val
                      );
                      // const predRootIds = funPredRoots(preVerb, rootsRepo);
                      // const roots = predRootIds.map((rootId) => rootsRepo[rootId].root);
                      // text = countText(preVerb ? preVerb.infName : "", roots);
                      text = preVerb ? preVerb.infName : "";
                    }
                    //console.log("VerbFreeMorphsChoicer getTextByValue results text=", text);
                    return text;
                  }}
                />
              </Col>
              <Col sd="2">
                {verbsForDropdownloading && (
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

            {parentInflectionId &&
              parentInflectionId > 0 &&
              selectLastRange && (
                <OneComboBoxControl
                  controlId={`lastMorphemeRangeId${predKey}`}
                  label={"ბოლო მორფემის რანგი"}
                  value={lastMorphemeRangeId}
                  dataMember={verbCompositionLastRanges}
                  valueMember="mrId"
                  displayMember="mrKeyName"
                  sortByDisplayMember={true}
                  //firstItem={{ id: 3, name: "D-ფუძე" }}
                  firstItemIsSelectable
                  getError={getError}
                  onChangeValue={(fieldPath, value) => {
                    onPredecessorLastMorphemeRangeIdChange(predKey, value);
                  }}
                />
              )}
          </div>
        );
      })}
    </div>
  );
};

export default InflectionVerbCompositionPredecessors;

// function mapStateToProps(state) {
//   const { rootsRepo, memoVerbsDict, verbsForDropdownloading } = state.derivTree;
//   return { rootsRepo, memoVerbsDict, verbsForDropdownloading };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     GetVerbsForDropDown: (val) => dispatch(DerivTreeActions.GetVerbsForDropDown(val))
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(InflectionVerbCompositionPredecessors);
