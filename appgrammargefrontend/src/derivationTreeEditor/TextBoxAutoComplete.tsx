//TextBoxAutoComplete.tsx

import React, { useState, useEffect, useRef, FC } from "react";
import { FormControl } from "react-bootstrap";
import { useInterval } from "../appcarcass/hooks/useInterval";
import { useOnClickOutside } from "../appcarcass/hooks/useOnClickOutside";

import "./AutoComplete.css";
// import { useOnClickOutside, useInterval } from "../../carcass/common/MyHooks";
//BaseLinkType | VerbInflectionModel
export interface listElementComponentProps {
  item: ListElement;
}

export interface ListElement {
  searchVal: string;
  itemId: number;
}

type TextBoxAutoCompleteProps = {
  listElementComponent: FC<listElementComponentProps>;
  placeholder: string;
  formControlClassName: string;
  value?: number;
  memodict: {
    [key: string]: ListElement[];
  };
  onTextChange?: (srchText: string) => void;
  loadDropDown: (searchText: string) => void;
  onSelectedElement: (item: ListElement) => void;
  getTextByValue?: (value: number) => string;
};

const TextBoxAutoComplete: FC<TextBoxAutoCompleteProps> = (props) => {
  //console.log("TextBoxAutoComplete strat props=", props);
  const {
    listElementComponent: ListElementComponent,
    placeholder,
    formControlClassName,
    value,
    memodict,
    onTextChange,
    loadDropDown,
    onSelectedElement,
    getTextByValue,
  } = props;
  //detectTextFromValue,

  // Create a ref that we add to the element for which we want to detect outside clicks
  const ref = useRef<HTMLDivElement | null>(null);
  // State for our modal
  const [isModalOpen, setModalOpen] = useState(false);
  // Call hook passing in the ref and a function to call on outside click
  useOnClickOutside(ref, () => setModalOpen(false));

  //const [searchText, setSearchText] = useState(text?text:"");
  const [searchText, setSearchText] = useState<string>("");
  const [currentValue, setCurrentValue] = useState<number | undefined>(
    undefined
  );
  const [timerIsOn, setTimerIsOn] = useState<boolean>(false);
  const [currentFocus, setCurrentFocus] = useState<number>(-1);

  const delay = 500;

  useEffect(() => {
    if (currentValue === value) return;
    setCurrentValue(value);
    if (value && getTextByValue && value > 0)
      setSearchText(getTextByValue(value));
    //console.log("TextBoxAutoComplete useEffect value=", value);
    //console.log("TextBoxAutoComplete useEffect searchText=", searchText);
  }, [value, currentValue, getTextByValue]);

  //console.log("TextBoxAutoComplete strat isModalOpen=", isModalOpen);
  //console.log("TextBoxAutoComplete strat searchValue=", searchText);
  //console.log("TextBoxAutoComplete strat searchValue.length=", searchText?searchText.length:-1);
  //console.log("TextBoxAutoComplete strat timerIsOn=", timerIsOn);
  //console.log("TextBoxAutoComplete strat currentFocus=", currentFocus);

  //useEffect(() => { if ( detectTextFromValue ) detectTextFromValue(value); }, [value, detectTextFromValue]);

  //useEffect(() => { setSearchText(text); }, [text]);

  useInterval(
    () => {
      // Your custom logic here
      loadDropDown(searchText);
      setTimerIsOn(false);
    },
    timerIsOn ? delay : null
  );

  function tryAutoComplete(srchText: string) {
    setSearchText(srchText);
    if (onTextChange) onTextChange(srchText);
    //console.log("TextBoxAutoComplete tryAutoComplete srchText=", srchText);

    if (!srchText) {
      setModalOpen(false);
    }

    setModalOpen(true);
    if (srchText && memodict[srchText]) {
      return;
    }

    if (timerIsOn) {
      setTimerIsOn(false);
    }

    if (srchText) {
      setTimerIsOn(true);
    }
  }

  function handleKeyup(e: React.KeyboardEvent) {
    if (!memodict[searchText]) return;
    const ddListLength = memodict[searchText].length;
    var focus = -1;
    if (e.key === "ArrowDown") {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      focus = currentFocus + 1;
      if (focus >= ddListLength) focus = 0;
      setCurrentFocus(focus);
    } else if (e.key === "ArrowUp") {
      //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      focus = currentFocus - 1;
      if (focus < 0) focus = ddListLength - 1;
      setCurrentFocus(focus);
    } else if (e.key === "Enter") {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1 && currentFocus < ddListLength) {
        /*and simulate a click on the "active" item:*/
        //if (x) x[currentFocus].click();
        const item = memodict[searchText][currentFocus];
        handleElementClic(item);
      }
    }
    //else {
    //  tryAutoComplete(this.state.rootSearchValue);
    //}
  }

  function handleElementClic(item: ListElement) {
    onSelectedElement(item);
    setModalOpen(false);
  }

  //let completedText = null;
  //if (isModalOpen && searchText && memodict[searchText]) {
  //  completedText = memodict[searchText][0].dbrBaseName;
  //}

  //const valueText = completedText ? completedText : searchText;

  return (
    <div className="position-relative">
      <FormControl
        type="text"
        placeholder={placeholder}
        className={formControlClassName}
        autoComplete="off"
        value={searchText}
        onChange={(e) => {
          const newSearchText = e.target.value;
          //console.log("TextBoxAutoComplete.FormControl.onChange newSearchvalue=", newSearchText);
          //setSearchText(newSearchText);
          tryAutoComplete(newSearchText);
        }}
        onKeyUp={(e) => handleKeyup(e)}
      />

      {isModalOpen && searchText && memodict[searchText] && (
        <div ref={ref} className="autocomplete-items">
          {memodict[searchText].map((item: ListElement, index: number) => {
            // console.log("TextBoxAutoComplete memodict map item=", item);
            return (
              <div
                key={item.itemId}
                onClick={() => handleElementClic(item)}
                className={
                  index === currentFocus ? "autocomplete-active" : undefined
                }
              >
                <ListElementComponent item={item} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TextBoxAutoComplete;
