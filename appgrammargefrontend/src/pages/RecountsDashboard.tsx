//RecountsDashboard.tsx

//RecountsDashboard
import { useState, useEffect, FC, useCallback } from "react";
import { Button, Spinner, ProgressBar } from "react-bootstrap";
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { Err } from "../appcarcass/redux/types/errorTypes";
import { setAlertClientRunTimeError } from "../appcarcass/redux/slices/alertSlice";
import { useLocation } from "react-router-dom";
import {
  useRecountBasesMutation,
  useRecountFindDerivationBranchesWithoutDescendantsMutation,
  useRecountInflectionSamplesMutation,
} from "../redux/api/recountApi";

const RecountsDashboard: FC = () => {
  // const {
  //   flatMenu,
  //   rcWorkingOnRecountBases,
  //   failureRecountBases,
  //   RecountBases,
  //   rcWorkingOnRecountInflectionSamples,
  //   failureRecountInflectionSamples,
  //   RecountInflectionSamples,
  //   rcWorkingOnRecountFindDerivationBranchesWithoutDescendants,
  //   failureFindDerivationBranchesWithoutDescendants,
  //   RecountFindDerivationBranchesWithoutDescendants,
  // } = props;
  //console.log("RecountsDashboard props=", props);
  const dispatch = useAppDispatch();

  const [procName, setProcName] = useState("");
  const [levelName, setLevelName] = useState("");
  const [checkBase, setCheckBase] = useState("");
  const [changedBase, setChangedBase] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [procLength, setProcLength] = useState(0);
  const [procPosition, setProcPosition] = useState(0);

  const [byLevelLength, setByLevelLength] = useState(0);
  const [byLevelPosition, setByLevelPosition] = useState(0);

  const [alertMessage, setAlertMessage] = useState("");
  const [hubConnection, setHubConnection] = useState<HubConnection>();
  const { baseUrl } = useAppSelector((state) => state.appParametersState);

  const [
    RecountBases,
    { isLoading: rcWorkingOnRecountBases, isError: failureRecountBases },
  ] = useRecountBasesMutation();

  const [
    RecountInflectionSamples,
    {
      isLoading: rcWorkingOnRecountInflectionSamples,
      isError: failureRecountInflectionSamples,
    },
  ] = useRecountInflectionSamplesMutation();

  const [
    RecountFindDerivationBranchesWithoutDescendants,
    {
      isLoading: rcWorkingOnRecountFindDerivationBranchesWithoutDescendants,
      isError: failureFindDerivationBranchesWithoutDescendants,
    },
  ] = useRecountFindDerivationBranchesWithoutDescendantsMutation();

  // Set the Hub Connection on mount.
  useEffect(
    () => {
      // Set the initial SignalR Hub Connection.
      const createHubConnection = async () => {
        // Build new Hub Connection, url is currently hard coded.
        const hubConnect = new HubConnectionBuilder()
          .withUrl(`${baseUrl}/recountmessages`)
          .build();
        try {
          await hubConnect.start();
          //console.log('hub Connection successful!');

          // Bind event handlers to the hubConnection.
          hubConnect.on("sendtoall", (receivedData) => {
            //console.log("RecountsDashboard receivedMessage=", receivedData);
            if (receivedData == null) {
              setProcName("");
              setLevelName("");
              setCheckBase("");
              setChangedBase("");
              setErrorMessage("");
              setProcLength(0);
              setProcPosition(0);
              setByLevelLength(0);
              setByLevelPosition(0);
              return;
            }
            const { strData, intData } = receivedData;
            if (strData !== null) {
              if (strData.procName || strData.procName === "")
                setProcName(strData.procName);
              if (strData.levelName || strData.levelName === "")
                setLevelName(strData.levelName);
              if (strData.checkBase || strData.checkBase === "")
                setCheckBase(strData.checkBase);
              if (strData.changedBase || strData.changedBase === "")
                setChangedBase(strData.changedBase);
              if (strData.error || strData.error === "")
                setErrorMessage(strData.error);
            }
            if (intData !== null) {
              if (intData.procLength || intData.procLength === "")
                setProcLength(intData.procLength);
              if (intData.procPosition || intData.procPosition === "")
                setProcPosition(intData.procPosition);
              if (intData.byLevelLength || intData.byLevelLength === "")
                setByLevelLength(intData.byLevelLength);
              if (intData.byLevelPosition || intData.byLevelPosition === "")
                setByLevelPosition(intData.byLevelPosition);
            }
            //setLastMessage(receivedMessage);
          });

          // hubConnect.on('newuserconnected', () => {
          //   console.log("RecountsDashboard newuserconnected");
          // });

          // hubConnect.off('userdisconnected', () => {
          //   console.log("RecountsDashboard newuserconnected");
          // });
        } catch (err: any) {
          // setAlertMessage(err.message);
          const errorMessage = err.message;
          dispatch(
            setAlertClientRunTimeError({
              errorCode: "hubConnectError",
              errorMessage: errorMessage,
            } as Err)
          );

          //console.log('Error while establishing connection: ' + { err });
        }
        setHubConnection(hubConnect);
      };

      createHubConnection();

      return () => {
        hubConnection && hubConnection.stop();
      };
    },

    //async () => { hubConnection && await hubConnection.stop(); },
    // eslint-disable-next-line
    [baseUrl]
  ); //hubConnection,

  const menLinkKey = useLocation().pathname.split("/")[1];

  const { isMenuLoading, flatMenu } = useAppSelector(
    (state) => state.navMenuState
  );

  const isValidPage = useCallback(() => {
    if (!flatMenu) {
      return false;
    }
    return flatMenu.find((f) => f.menLinkKey === menLinkKey);
  }, [flatMenu, menLinkKey]);

  if (!isValidPage()) return <h3>ინფორმაციის ჩატვირთა ვერ მოხერხდა</h3>;

  const procPercentage = Math.round((procPosition / procLength) * 100);
  const byLevelPercentage = Math.round((byLevelPosition / byLevelLength) * 100);

  //console.log("RecountsDashboard procPercentage=", procPercentage);
  //console.log("RecountsDashboard byLevelPosition=", byLevelPosition);
  //console.log("RecountsDashboard byLevelLength=", byLevelLength);
  //console.log("RecountsDashboard byLevelPercentage=", byLevelPercentage);
  return (
    <div>
      <h3>გადაანგარიშებები</h3>
      <Button
        className="mr-1 mb-1"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          RecountBases();
        }}
      >
        {rcWorkingOnRecountBases && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
        ფუძეების გადათვლა
      </Button>
      {failureRecountBases && (
        <p>ფუძეების გადათვლის გაშვების ბოლო მცდელობა წარუმატებლად დასრულდა.</p>
      )}
      <Button
        className="mr-1 mb-1"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          RecountInflectionSamples();
        }}
      >
        {rcWorkingOnRecountInflectionSamples && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
        ფლექსიის ნიმუშების გადათვლა
      </Button>
      {failureRecountInflectionSamples && (
        <p>
          ფლექსიის ნიმუშების გადათვლის გაშვების ბოლო მცდელობა წარუმატებლად
          დასრულდა.
        </p>
      )}
      <Button
        className="mr-1 mb-1"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          RecountFindDerivationBranchesWithoutDescendants();
        }}
      >
        {rcWorkingOnRecountFindDerivationBranchesWithoutDescendants && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
        უშვილო დერივაციების პოვნა
      </Button>
      {failureFindDerivationBranchesWithoutDescendants && (
        <p>
          უშვილო დერივაციების პოვნის პროცესის გაშვების ბოლო მცდელობა
          წარუმატებლად დასრულდა.
        </p>
      )}
      {!!procName && (
        <div>
          <p className="mt-1 mb-0">{procName}</p>
          {!!procLength && (
            <ProgressBar now={procPercentage} label={`${procPercentage}%`} />
          )}
          <p className="mt-3 mb-0">{levelName}</p>
          {!!byLevelLength && (
            <ProgressBar
              now={byLevelPercentage}
              label={`${byLevelPercentage}%`}
            />
          )}
          <p>{checkBase}</p>
          <p>{changedBase}</p>
          <p>{errorMessage}</p>
        </div>
      )}
      <p>{alertMessage}</p>
    </div>
  );
};

export default RecountsDashboard;

// function mapStateToProps(state) {
//   const { rcWorkingOnRecountBases, failureRecountBases,
//     rcWorkingOnRecountInflectionSamples, failureRecountInflectionSamples,
//     rcWorkingOnRecountFindDerivationBranchesWithoutDescendants, failureFindDerivationBranchesWithoutDescendants } = state.recountsStore;
//   const { flatMenu } = state.navMenu;
//   return { flatMenu, rcWorkingOnRecountBases, failureRecountBases,
//     rcWorkingOnRecountInflectionSamples, failureRecountInflectionSamples,
//     rcWorkingOnRecountFindDerivationBranchesWithoutDescendants, failureFindDerivationBranchesWithoutDescendants };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     RecountBases: () => dispatch(RecountsActions.RecountBases()),
//     RecountInflectionSamples: () => dispatch(RecountsActions.RecountInflectionSamples()),
//     RecountFindDerivationBranchesWithoutDescendants: () => dispatch(RecountsActions.RecountFindDerivationBranchesWithoutDescendants())
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(RecountsDashboard);
