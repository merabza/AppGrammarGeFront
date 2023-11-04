//BaseSearchForm.tsx

import { FC, useState } from "react";
import { Button, Spinner, Nav, Navbar, DropdownButton } from "react-bootstrap";
import BaseLink, { BaseLinkElement, getBaseHref } from "./BaseLink";
import TextBoxAutoComplete, {
  ListElement,
  listElementComponentProps,
} from "./TextBoxAutoComplete";
import { Link, useNavigate } from "react-router-dom";
import { BaseLinkType } from "../redux/types/rootsTypes";
import { useAppSelector } from "../appcarcass/redux/hooks";
import { useBasesForDropDownList } from "./RootsHooks/useBasesForDropDownList";

const BaseSearchForm: FC = () => {
  const [baseSearchValue, setBaseSearchValue] = useState<string>("");
  const navigate = useNavigate();
  const flatMenu = useAppSelector((state) => state.navMenuState.flatMenu);
  const savedIssueDetailLine = useAppSelector(
    (state) => state.issuesState.savedIssueDetailLine
  );
  const { memoBasesDict, basesForDropdownloading } = useAppSelector(
    (state) => state.rootsState
  );

  const [getBasesForDropDown] = useBasesForDropDownList();

  const menLinkKey = "basesearch";

  function isValidPage() {
    if (!flatMenu) {
      return false;
    }
    return flatMenu.some((f) => f.menLinkKey === menLinkKey);
  }

  function handleElementClic(item: BaseLinkElement) {
    const href = getBaseHref(item.baseLink, 0);
    navigate(href);
  }

  if (!isValidPage()) {
    return <div />;
  }

  const memoDictConverted = {} as {
    [key: string]: ListElement[];
  };

  //ToDo ეს გარდაქმნა ჩატვირთვის დროს უნდა მოხდეს,
  //რომ მხოლოდ ერთხელ მოხდეს ასეთი სახით შენახვა.
  //და ყოველ ჯერზე არ იყოს საჭირო ამ გარაქმნის გაკეთება.
  Object.keys(memoBasesDict).forEach((key) => {
    //memoDictConverted[key] = [] as BaseLinkElement[];
    memoDictConverted[key] = memoBasesDict[key].map((value: BaseLinkType) => {
      return {
        baseLink: value,
        searchVal: key,
        itemId: value.dbrId,
      } as BaseLinkElement;
    });
  });

  return (
    <Nav>
      <Navbar.Brand> ფუძე:</Navbar.Brand>
      {/* <Form> */}
      <TextBoxAutoComplete
        listElementComponent={BaseLink as FC<listElementComponentProps>}
        placeholder="ფუძე"
        formControlClassName="mr-sm-2"
        memodict={memoDictConverted}
        onTextChange={(searchValue: string) => setBaseSearchValue(searchValue)}
        loadDropDown={(searchValue: string) => getBasesForDropDown(searchValue)}
        onSelectedElement={(item: ListElement) =>
          handleElementClic(item as BaseLinkElement)
        }
      />
      <Button
        variant="outline-success"
        onClick={(e) => {
          e.preventDefault();
          if (baseSearchValue) navigate(`/basesearch/${baseSearchValue}`);
        }}
      >
        ძებნა
        {basesForDropdownloading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
      </Button>
      {/* </Form> */}
      <DropdownButton
        id="create-dropdown-button"
        title="ახალი"
        className="btn-space"
      >
        <Link to="/rootEdit" className="dropdown-item">
          ძირი
        </Link>
        <Link to={"/derivEdit"} className="dropdown-item">
          დერივაცია
        </Link>
        <Link to={"/inflEdit"} className="dropdown-item">
          ფლექსია
        </Link>
        <Link to={"/inflVerbCompEdit"} className="dropdown-item">
          ზმნური კომპოზიცია
        </Link>
      </DropdownButton>
      {!!savedIssueDetailLine && (
        <Button
          variant="outline-success"
          onClick={(e) => {
            e.preventDefault();
            if (savedIssueDetailLine.issueId)
              navigate(`/issuework/${savedIssueDetailLine.issueId}`);
          }}
        >
          სიაში დაბრუნება
        </Button>
      )}
    </Nav>
  );
};

export default BaseSearchForm;
