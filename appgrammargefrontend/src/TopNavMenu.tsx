//TopNavMenu.tsx

import { Route, Routes } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar, Button } from "react-bootstrap";

import { useAppDispatch } from "./appcarcass/redux/hooks";
import { toggleactive } from "./appcarcass/redux/slices/navMenuSlice";
import RightsTopNavMenu from "./appcarcass/rights/RightsTopNavMenu";
import ProfileTopNavMenu from "./appcarcass/user/ProfileTopNavMenu";
import BaseSearchForm from "./derivationTreeEditor/BaseSearchForm";
import ParadigmTopNavMenu from "./derivationTreeEditor/ParadigmTopNavMenu";
import ForConfirmRootsListTopForm from "./forConfirmRoots/ForConfirmRootsListTopForm";
import { FC } from "react";
import ForIssuesTopForm from "./issues/ForIssuesTopForm";

// import {
//   IconDefinition,
//   IconLookup,
//   findIconDefinition,
// } from "@fortawesome/free-solid-svg-icons";
// import {
//   IconLookup,
//   IconDefinition,
//   findIconDefinition,
// } from "@fortawesome/fontawesome-svg-core";

const TopNavMenu: FC = () => {
  const dispatch = useAppDispatch();

  // const alignLeftLookup: IconLookup = { prefix: "fas", iconName: "align-left" };
  // const alignLeftIconDefinition: IconDefinition =
  //   findIconDefinition(alignLeftLookup);

  return (
    <Navbar bg="light" expand="lg">
      <Button
        className="btn-space"
        variant="info"
        onClick={() => dispatch(toggleactive())}
      >
        <FontAwesomeIcon icon="align-left" />
        <span> მენიუ</span>
      </Button>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Routes>
          {/* Home */}
          <Route path="/" element={<div />} />
          {/* Carcass */}
          <Route
            path="/Rights/:rView/:dtKey/:key"
            element={<RightsTopNavMenu />}
          />
          <Route path="/Rights/:rView/:dtKey" element={<RightsTopNavMenu />} />
          <Route path="/Rights/:rView" element={<RightsTopNavMenu />} />
          <Route path="/Rights" element={<RightsTopNavMenu />} />
          <Route path="/profile" element={<ProfileTopNavMenu />} />
          {/* Project */}
          <Route path="/basesearch" element={<BaseSearchForm />} />
          <Route
            path="/root/:rootId/:dbrId/:infId/:ivcId"
            element={<ParadigmTopNavMenu />}
          />
          <Route
            path="/root/:rootId/:dbrId/:infId"
            element={<ParadigmTopNavMenu />}
          />
          <Route path="/root/:rootId/:dbrId" element={<BaseSearchForm />} />
          <Route path="/root/:rootId" element={<BaseSearchForm />} />
          <Route path="/root" element={<BaseSearchForm />} />
          <Route
            path="/inflEdit/:infId/:dbrId/:rootId"
            element={<ParadigmTopNavMenu />}
          />
          <Route
            path="/inflEdit/:infId/:dbrId"
            element={<ParadigmTopNavMenu />}
          />
          <Route path="/inflEdit/:infId" element={<ParadigmTopNavMenu />} />
          <Route
            path="/inflVerbCompEdit/:ivcId/:infId/:dbrId/:rootId"
            element={<ParadigmTopNavMenu />}
          />
          <Route
            path="/inflVerbCompEdit/:ivcId/:infId/:dbrId"
            element={<ParadigmTopNavMenu />}
          />
          <Route
            path="/inflVerbCompEdit/:ivcId/:infId"
            element={<ParadigmTopNavMenu />}
          />
          <Route
            path="/inflVerbCompEdit/:ivcId"
            element={<ParadigmTopNavMenu />}
          />
          <Route
            path="/forConfirmRootsList"
            element={<ForConfirmRootsListTopForm />}
          />
          <Route path="/issues" element={<ForIssuesTopForm />} />
        </Routes>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNavMenu;
