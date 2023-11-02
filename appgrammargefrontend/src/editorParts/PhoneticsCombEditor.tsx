//PhoneticsCombEditor.tsx

import { FC } from "react";
import OneComboBoxControl from "../appcarcass/editorParts/OneComboBoxControl";
import OnePlusButton from "../appcarcass/editorParts/OnePlusButton";
import OneStrongLabel from "../appcarcass/editorParts/OneStrongLabel";
import { fnChangeField, fnGetError } from "../appcarcass/hooks/useForman";
import {
  PhoneticsChangeModel,
  PhoneticsChangeQueryModel,
} from "../masterData/mdTypes";
// import { PhoneticsChangeModel } from "../redux/types/masterDataTypes";

export type fnTrashButtonClick = (index: number) => void;
export type fnPlusButtonClick = () => void;

type PhoneticsCombEditorProps = {
  controlGroupId: string;
  label: string;
  basePhoneticsChanges: number[];
  getError: fnGetError;
  onChangeValue: fnChangeField;
  onTrashButtonClick: fnTrashButtonClick;
  onPlusButtonClick: fnPlusButtonClick;
  phoneticsChangesQuery: PhoneticsChangeQueryModel[];
};

const PhoneticsCombEditor: FC<PhoneticsCombEditorProps> = (props) => {
  const {
    controlGroupId,
    label,
    basePhoneticsChanges,
    getError,
    onChangeValue,
    onTrashButtonClick,
    onPlusButtonClick,
    phoneticsChangesQuery,
  } = props;
  //console.log("PhoneticsCombEditor props=", props);

  return (
    <div>
      <OneStrongLabel controlId="phoneticsCombEditorLabel" label={label} />

      {basePhoneticsChanges &&
        basePhoneticsChanges.map((item, index) => {
          return (
            <OneComboBoxControl
              key={index}
              controlId={`${controlGroupId}[${index}]`}
              label={`${index + 1}`}
              value={item}
              dataMember={phoneticsChangesQuery.filter(
                (fc) => !fc.onlyPhoneticsType
              )}
              firstItem={{ id: 0, name: "აირჩიე ფონეტიკური ცვლილება" }}
              valueMember="phcId"
              displayMember="phcName"
              sortByDisplayMember={true}
              getError={getError}
              onChangeValue={onChangeValue}
              onTrashButtonClick={() => {
                onTrashButtonClick(index);
              }}
            />
          );
        })}

      <OnePlusButton onClick={onPlusButtonClick} />
    </div>
  );
};

export default PhoneticsCombEditor;
