//ParadigmTopNavMenu.tsx

import { FC, useState } from "react";
import {
  Navbar,
  Nav,
  ToggleButton,
  Button,
  Spinner,
  DropdownButton,
  Dropdown,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageBox from "../appcarcass/common/MessageBox";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import {
  showFormulas,
  showhyphens,
  swithcIspMorphemeNom,
} from "../redux/slices/rootsSlice";
import { useParadigmSaveSamplesMutation } from "../redux/api/rootsApi";
import { useClearTablesFromRepo } from "../appcarcass/masterdata/masterDataHooks/useClearTablesFromRepo";
// import { actionCreators as DerivTreeActions } from './DerivationTreeStore';
// import { actionCreators as FormulasActions } from '../overviews/FormulasStore';

const ParadigmTopNavMenu: FC = () => {
  // const {
  //   prdShowhyphens,
  //   prdShowFormulas,
  //   prdIspMorphemeNom,
  //   paradigm,
  //   savingParadigmSamples,
  //   user,
  // } = props;

  const { infId } = useParams<string>();

  const [ParadigmSaveSamples, { isLoading: savingParadigmSamples }] =
    useParadigmSaveSamplesMutation();

  const [
    showParadigmSaveAsSampleConfirmMessage,
    setShowParadigmSaveAsSampleConfirmMessage,
  ] = useState(false);

  const { user } = useAppSelector((state) => state.userState);

  const { paradigm, prdIspMorphemeNom, prdShowhyphens, prdShowFormulas } =
    useAppSelector((state) => state.rootsState);

  const dispatch = useAppDispatch();
  const [clearTablesFromRepo] = useClearTablesFromRepo();

  if (!infId || !paradigm || !user) return null;

  let title = "ძირითადი";
  const ispMorpheme = paradigm.ispMorphemes.find(
    (item) => item.ispMorphemeNom === prdIspMorphemeNom
  );
  if (ispMorpheme) title = ispMorpheme.ispMorpheme;

  return (
    <Nav>
      <Navbar.Brand> პარადიგმა </Navbar.Brand>
      <ToggleButton type="checkbox" value="დეფისებით">
        <Form.Check
          type="checkbox"
          checked={prdShowhyphens ? true : false}
          onChange={(val) => {
            dispatch(showhyphens(val.target.checked));
          }}
        />
        <FontAwesomeIcon icon="minus" /> დეფისებით
      </ToggleButton>

      <DropdownButton
        id="select-indirect-speech-particle"
        title={title}
        className="btn-space"
      >
        {paradigm.ispMorphemes.map((element) => {
          return (
            <Dropdown.Item
              key={element.ispMorphemeNom}
              as="button"
              onClick={() => {
                dispatch(swithcIspMorphemeNom(element.ispMorphemeNom));
              }}
            >
              {element.ispMorpheme}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>

      <ToggleButton type="checkbox" value="1">
        <Form.Check
          type="checkbox"
          checked={prdShowFormulas ? true : false}
          onChange={(val) => {
            dispatch(showFormulas(val.target.checked));
          }}
        />
        <FontAwesomeIcon icon="bezier-curve" /> ფორმულები
      </ToggleButton>

      {user.appClaims.some((s) => s === "SaveSamples") && (
        <div>
          <Button
            variant="warning"
            className="btn-space"
            onClick={(e) => {
              e.preventDefault();
              setShowParadigmSaveAsSampleConfirmMessage(true);
            }}
          >
            <FontAwesomeIcon icon="file-export" /> ნიმუშებში
            {savingParadigmSamples && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>

          <MessageBox
            show={showParadigmSaveAsSampleConfirmMessage}
            title="პარადიგმის ნიმუშებად შენახვა"
            text={
              "ძველი ნიმუშების ადგილას მოხდება ამ პარადიგმის ნიმუშებად შენახვა, მაინც გსურთ პარადიგმის ნიმუშებად შენახვა?"
            }
            primaryButtonText="დიახ"
            secondaryButtonText="არა"
            onConfirmed={() => {
              setShowParadigmSaveAsSampleConfirmMessage(false);
              ParadigmSaveSamples(paradigm.inflectionId);
              if (paradigm.nounParadigmId) {
                clearTablesFromRepo(["nounParadigmNamesQuery"], null);
              }
              if (paradigm.verbParadigmId) {
                clearTablesFromRepo(["verbParadigmNamesQuery"], null);
              }
            }}
            onClosed={() => setShowParadigmSaveAsSampleConfirmMessage(false)}
          />
        </div>
      )}
    </Nav>
  );
};

export default ParadigmTopNavMenu;

// function mapStateToProps(state) {
//   const { prdShowhyphens, prdShowFormulas, prdIspMorphemeNom, paradigm, savingParadigmSamples } = state.derivTree;
//   const { user } = state.authentication;
//   return { prdShowhyphens, prdShowFormulas, prdIspMorphemeNom, paradigm, savingParadigmSamples, user };

// }

// function mapDispatchToProps(dispatch) {
//   return {
//     Showhyphens: (val) => dispatch(DerivTreeActions.Showhyphens(val)),
//     ShowFormulas: (val) => dispatch(DerivTreeActions.ShowFormulas(val)),
//     SwithcIspMorphemeNom: (val) => dispatch(DerivTreeActions.SwithcIspMorphemeNom(val)),
//     paradigmSaveSamples: (infId) => dispatch(DerivTreeActions.paradigmSaveSamples(infId)),
//     clearNounParadigmFormulas: (paradigmIdsForClear) => dispatch(FormulasActions.clearNounParadigmFormulas(paradigmIdsForClear)),
//     clearVerbRowParadigmFormulas: (paradigmIdsForClear) => dispatch(FormulasActions.clearVerbRowParadigmFormulas(paradigmIdsForClear))
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(ParadigmTopNavMenu);
