//App.tsx

import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

import LoginPage from "./appcarcass/common/LoginPage";
import PrivateApp from "./appcarcass/common/PrivateApp";
import RegistrationPage from "./appcarcass/common/RegistrationPage";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faSync,
  faSave,
  faSignOutAlt,
  faHome,
  faAlignLeft,
  faBarcode,
  faArrowsAltH,
  faLongArrowAltDown,
  faSquare,
  faMicroscope,
  faFolder,
  faFolderOpen,
  faEdit,
  faTrash,
  faPlus,
  faPlusSquare,
  faMinusSquare,
  faWindowClose,
  faSignInAlt,
  faUserPlus,
  faUser,
  faUserMinus,
  faKey,
  faFileAlt,
  faMinus,
  faBezierCurve,
  faShapes,
  faArrowDown,
  faArrowUp,
  faChevronLeft,
  faFileExport,
  faTimes,
  faCheck,
  faUsersCog,
  faStream,
  faCheckCircle,
  faRobot,
  faPaperclip,
  faAngleLeft,
  faAngleDoubleLeft,
  faAngleRight,
  faAngleDoubleRight,
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import Layout from "./appcarcass/common/Layout";
import Profile from "./appcarcass/user/Profile";
import FrmRights from "./appcarcass/rights/FrmRights";
import Home from "./pages/Home";
import MdListOld from "./appcarcass/masterdata/MdListOld";
import MdItemEdit from "./appcarcass/masterdata/MdItemEdit";
import BaseSearch from "./derivationTreeEditor/BaseSearch";
import RootDerivationTree from "./derivationTreeEditor/RootDerivationTree";
import PageNotFound from "./appcarcass/common/PageNotFound";
import RootEdit from "./derivationTreeEditor/RootEdit";
import DerivationEdit from "./derivationTreeEditor/DerivationEdit";
import InflectionEdit from "./derivationTreeEditor/InflectionEdit";
import InflectionVerbCompositionEdit from "./derivationTreeEditor/InflectionVerbCompositionEdit";
import ForConfirmRootsList from "./forConfirmRoots/ForConfirmRootsList";
import DerivationFormulaEdit from "./modelOverview/DerivationFormulaEdit";
import DerivationFormulasOverview from "./modelOverview/DerivationFormulasOverview";
import MorphemesOverview from "./modelOverview/MorphemesOverview";
import MorphemeEdit from "./modelOverview/MorphemeEdit";
import PhoneticsTypesOverview from "./modelOverview/PhoneticsTypesOverview";
import PhoneticsTypeEdit from "./modelOverview/PhoneticsTypeEdit";
import PhoneticsOptionEdit from "./modelOverview/PhoneticsOptionEdit";
import NounParadigmsOverview from "./modelOverview/NounParadigmsOverview";
import NounParadigmFormulas from "./modelOverview/NounParadigmFormulas";
import NounParadigmFormulaEdit from "./modelOverview/NounParadigmFormulaEdit";
import VerbRowParadigmsOverview from "./modelOverview/VerbRowParadigmsOverview";
import VerbRowParadigmFormulas from "./modelOverview/VerbRowParadigmFormulas";
import VerbRowParadigmFormulaEdit from "./modelOverview/VerbRowParadigmFormulaEdit";
import VerbPersonMarkersOverview from "./modelOverview/VerbPersonMarkersOverview";
import VerbPersonMarkerFormulas from "./modelOverview/VerbPersonMarkerFormulas";
import VerbPersonMarkerFormulaEdit from "./modelOverview/VerbPersonMarkerFormulaEdit";
import ActantCombinationsReCounter from "./verbPersonMarkers/ActantCombinationsReCounter";
import CreateAfterDominantPersonMarkers from "./verbPersonMarkers/CreateAfterDominantPersonMarkers";
import CreateVerbPersonMarkerCombinations from "./verbPersonMarkers/CreateVerbPersonMarkerCombinations";
import CreateForRecountVerbPersonMarkers from "./verbPersonMarkers/CreateForRecountVerbPersonMarkers";
import CreateVerbPersonMarkerCombinationFormulaDetails from "./verbPersonMarkers/CreateVerbPersonMarkerCombinationFormulaDetails";
import Issues from "./issues/Issues";
import { FC } from "react";
import IssueWork from "./issues/IssueWork";
import RecountsDashboard from "./pages/RecountsDashboard";
import MdList from "./appcarcass/masterdata/MdList";
import MdGridView from "./appcarcass/masterdata/MdGridView";

library.add(
  faCheckSquare,
  faCoffee,
  faSync,
  faSave,
  faSignOutAlt,
  faHome,
  faAlignLeft,
  faBarcode,
  faArrowsAltH,
  faLongArrowAltDown,
  faSquare,
  faMicroscope,
  faFolder,
  faFolderOpen,
  faEdit,
  faTrash,
  faPlus,
  faPlusSquare,
  faMinusSquare,
  faWindowClose,
  faSignInAlt,
  faUserPlus,
  faUser,
  faUserMinus,
  faKey,
  faFileAlt,
  faMinus,
  faBezierCurve,
  faShapes,
  faArrowDown,
  faArrowUp,
  faChevronLeft,
  faFileExport,
  faTimes,
  faCheck,
  faUsersCog,
  faStream,
  faCheckCircle,
  faRobot,
  faPaperclip,
  faAngleLeft,
  faAngleDoubleLeft,
  faAngleRight,
  faAngleDoubleRight,
  faSort,
  faSortUp,
  faSortDown
);

const App: FC = () => {
  // console.log("App start");

  return (
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        {/* <div className="content-wrapper"> */}
        <Routes>
          <Route path="/" element={<PrivateApp />}>
            <Route path="/*" element={<Layout />}>
              <Route index element={<Home />} />

              <Route path="profile" element={<Profile />} />

              <Route path="Rights/:rView/:dtKey/:key" element={<FrmRights />} />
              <Route path="Rights/:rView/:dtKey" element={<FrmRights />} />
              <Route path="Rights/:rView" element={<FrmRights />} />
              <Route path="Rights" element={<FrmRights />} />

              <Route
                path="mdListOld/:tableName/:recName"
                element={<MdListOld />}
              />
              <Route path="mdListOld/:tableName" element={<MdListOld />} />

              <Route path="mdList/:tableName/:recName" element={<MdList />} />
              <Route path="mdList/:tableName" element={<MdList />} />

              <Route
                path="mdItemEdit/:tableName/:mdIdValue"
                element={<MdItemEdit />}
              />
              <Route path="mdItemEdit/:tableName" element={<MdItemEdit />} />

              {/* Project AppRoutes start */}

              <Route
                path="basesearch/:baseName/:page"
                element={<BaseSearch />}
              />
              <Route path="basesearch/:baseName" element={<BaseSearch />} />
              <Route path="basesearch" element={<BaseSearch />} />

              <Route
                path="root/:rootId/:dbrId/:infId/:ivcId"
                element={<RootDerivationTree />}
              />
              <Route
                path="root/:rootId/:dbrId/:infId"
                element={<RootDerivationTree />}
              />
              <Route
                path="root/:rootId/:dbrId"
                element={<RootDerivationTree />}
              />
              <Route path="root/:rootId" element={<RootDerivationTree />} />

              <Route path="rootEdit/:rootId" element={<RootEdit />} />
              <Route path="rootEdit" element={<RootEdit />} />
              <Route
                path="derivEdit/:dbrId/:rootId"
                element={<DerivationEdit />}
              />

              <Route path="derivEdit/:dbrId" element={<DerivationEdit />} />
              <Route path="derivEdit" element={<DerivationEdit />} />

              <Route
                path="inflEdit/:infId/:dbrId/:rootId"
                element={<InflectionEdit />}
              />
              <Route
                path="inflEdit/:infId/:dbrId"
                element={<InflectionEdit />}
              />

              <Route path="inflEdit/:infId" element={<InflectionEdit />} />
              <Route path="inflEdit" element={<InflectionEdit />} />

              <Route
                path="inflVerbCompEdit/:ivcId/:infId/:dbrId/:rootId"
                element={<InflectionVerbCompositionEdit />}
              />
              <Route
                path="inflVerbCompEdit/:ivcId/:infId/:dbrId"
                element={<InflectionVerbCompositionEdit />}
              />
              <Route
                path="inflVerbCompEdit/:ivcId/:infId"
                element={<InflectionVerbCompositionEdit />}
              />
              <Route
                path="inflVerbCompEdit/:ivcId"
                element={<InflectionVerbCompositionEdit />}
              />
              <Route
                path="inflVerbCompEdit"
                element={<InflectionVerbCompositionEdit />}
              />

              <Route
                path="forConfirmRootsList/:page"
                element={<ForConfirmRootsList />}
              />

              <Route
                path="forConfirmRootsList"
                element={<ForConfirmRootsList />}
              />

              <Route
                path="derivationFormulasOverview/:tabKey/:recName"
                element={<DerivationFormulasOverview />}
              />
              <Route
                path="derivationFormulasOverview/:tabKey"
                element={<DerivationFormulasOverview />}
              />
              <Route
                path="derivationFormulasOverview"
                element={<DerivationFormulasOverview />}
              />
              <Route
                path="derivationFormulaEdit/:dfId"
                element={<DerivationFormulaEdit />}
              />
              <Route
                path="derivationFormulaEdit"
                element={<DerivationFormulaEdit />}
              />

              <Route
                path="morphemesOverview/:tabKey/:recName"
                element={<MorphemesOverview />}
              />
              <Route
                path="morphemesOverview/:tabKey"
                element={<MorphemesOverview />}
              />
              <Route path="morphemesOverview" element={<MorphemesOverview />} />

              <Route path="morphemeEdit/:mrpId" element={<MorphemeEdit />} />
              <Route path="morphemeEdit" element={<MorphemeEdit />} />

              <Route
                path="phoneticsTypesOverview/:tabKey/:recName"
                element={<PhoneticsTypesOverview />}
              />

              <Route
                path="phoneticsTypesOverview/:tabKey"
                element={<PhoneticsTypesOverview />}
              />

              <Route
                path="phoneticsTypesOverview"
                element={<PhoneticsTypesOverview />}
              />
              <Route
                path="phoneticsTypeEdit/:phtId"
                element={<PhoneticsTypeEdit />}
              />
              <Route path="phoneticsTypeEdit" element={<PhoneticsTypeEdit />} />
              <Route
                path="phoneticsOptionEdit/:phoId"
                element={<PhoneticsOptionEdit />}
              />
              <Route
                path="phoneticsOptionEdit"
                element={<PhoneticsOptionEdit />}
              />

              <Route
                path="nounParadigmsOverview/:tabKey/:recName"
                element={<NounParadigmsOverview />}
              />
              <Route
                path="nounParadigmsOverview/:tabKey"
                element={<NounParadigmsOverview />}
              />
              <Route
                path="nounParadigmsOverview"
                element={<NounParadigmsOverview />}
              />
              <Route
                path="nounParadigmFormulas/:paradigmId/:formulaId"
                element={<NounParadigmFormulas />}
              />
              <Route
                path="nounParadigmFormulas/:paradigmId"
                element={<NounParadigmFormulas />}
              />
              <Route
                path="nounParadigmFormulas"
                element={<NounParadigmFormulas />}
              />
              <Route
                path="nounParadigmFormulaEdit/:formulaId"
                element={<NounParadigmFormulaEdit />}
              />
              <Route
                path="nounParadigmFormulaEdit"
                element={<NounParadigmFormulaEdit />}
              />

              <Route
                path="verbRowParadigmsOverview/:tabKey/:recName"
                element={<VerbRowParadigmsOverview />}
              />
              <Route
                path="verbRowParadigmsOverview/:tabKey"
                element={<VerbRowParadigmsOverview />}
              />
              <Route
                path="verbRowParadigmsOverview"
                element={<VerbRowParadigmsOverview />}
              />

              <Route
                path="verbRowParadigmFormulas/:paradigmId/:formulaId"
                element={<VerbRowParadigmFormulas />}
              />
              <Route
                path="verbRowParadigmFormulas/:paradigmId"
                element={<VerbRowParadigmFormulas />}
              />
              <Route
                path="verbRowParadigmFormulas"
                element={<VerbRowParadigmFormulas />}
              />

              <Route
                path="verbRowParadigmFormulaEdit/:formulaId"
                element={<VerbRowParadigmFormulaEdit />}
              />
              <Route
                path="verbRowParadigmFormulaEdit"
                element={<VerbRowParadigmFormulaEdit />}
              />

              <Route
                path="verbPersonMarkersOverview/:tabKey/:recName"
                element={<VerbPersonMarkersOverview />}
              />
              <Route
                path="verbPersonMarkersOverview/:tabKey"
                element={<VerbPersonMarkersOverview />}
              />
              <Route
                path="verbPersonMarkersOverview"
                element={<VerbPersonMarkersOverview />}
              />

              <Route
                path="verbPersonMarkerFormulas/:paradigmId/:formulaId"
                element={<VerbPersonMarkerFormulas />}
              />
              <Route
                path="verbPersonMarkerFormulas/:paradigmId"
                element={<VerbPersonMarkerFormulas />}
              />
              <Route
                path="verbPersonMarkerFormulas"
                element={<VerbPersonMarkerFormulas />}
              />

              <Route
                path="verbPersonMarkerFormulaEdit/:formulaId"
                element={<VerbPersonMarkerFormulaEdit />}
              />
              <Route
                path="verbPersonMarkerFormulaEdit"
                element={<VerbPersonMarkerFormulaEdit />}
              />

              <Route
                path="ActantCombinationsReCounter"
                element={<ActantCombinationsReCounter />}
              />

              <Route
                path="CreateAfterDominantPersonMarkers"
                element={<CreateAfterDominantPersonMarkers />}
              />

              <Route
                path="CreateVerbPersonMarkerCombinations"
                element={<CreateVerbPersonMarkerCombinations />}
              />

              <Route
                path="CreateForRecountVerbPersonMarkers"
                element={<CreateForRecountVerbPersonMarkers />}
              />
              <Route
                path="CreateVerbPersonMarkerCombinationFormulaDetails"
                element={<CreateVerbPersonMarkerCombinationFormulaDetails />}
              />

              <Route path="issues" element={<Issues />} />

              <Route path="issuework/:issueId" element={<IssueWork />} />

              <Route path="recountsDashboard" element={<RecountsDashboard />} />

              {/* Project AppRoutes finish */}

              {/* 👇️ only match this when no other routes match */}
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Route>
          <Route path="login" element={<LoginPage />} />
          <Route path="registration" element={<RegistrationPage />} />
        </Routes>
        {/* </div> */}
      </QueryParamProvider>
    </BrowserRouter>
  );
};

export default App;
