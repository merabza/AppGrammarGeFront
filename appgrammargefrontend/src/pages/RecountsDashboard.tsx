//RecountsDashboard.tsx

import { useState, useEffect, FC, useCallback } from "react";
import { Button, Spinner, ProgressBar } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import { Err } from "../appcarcass/redux/types/errorTypes";
import { setAlertClientRunTimeError } from "../appcarcass/redux/slices/alertSlice";
import { useLocation } from "react-router-dom";
import {
  useCancelCurrentProcessMutation,
  useDatabaseIntegrityCheckMutation,
  useRecountBasesMutation,
  useRecountFindDerivationBranchesWithoutDescendantsMutation,
  useRecountInflectionSamplesMutation,
} from "../redux/api/recountApi";
import { ProgressData } from "./RecountDashboardTypes";
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

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

  const [alertMessage] = useState("");
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

  const [
    DatabaseIntegrityCheck,
    {
      isLoading: rcWorkingOnDatabaseIntegrityCheck,
      isError: failureDatabaseIntegrityCheck,
    },
  ] = useDatabaseIntegrityCheckMutation();

  const [CancelCurrentProcess] = useCancelCurrentProcessMutation();

  const { user } = useAppSelector((state) => state.userState);

  // Set the Hub Connection on mount.
  useEffect(
    () => {
      // Set the initial SignalR Hub Connection.
      const createHubConnection = async () => {
        if (user === null) {
          dispatch(
            setAlertClientRunTimeError({
              errorCode: "hubConnectError",
              errorMessage: "user is not authorised",
            } as Err)
          );
          return;
        }
        // Build new Hub Connection, url is currently hard coded.
        const hubConnect = new HubConnectionBuilder()
          .withUrl(`${baseUrl}/databaserecounter/recountmessages`, {
            transport:
              /*HttpTransportType.WebSockets |*/ HttpTransportType.LongPolling,
            accessTokenFactory: () => user.token,
          })
          .configureLogging(LogLevel.Information)
          .build();
        try {
          await hubConnect.start();
          // console.log("hub Connection successful!");

          // Bind event handlers to the hubConnection.
          hubConnect.on("sendtoall", (receivedData: ProgressData | null) => {
            // console.log("RecountsDashboard receivedMessage=", receivedData);
            if (!receivedData) {
              // setProcName("");
              // setLevelName("");
              // setCheckBase("");
              // setChangedBase("");
              // setErrorMessage("");
              // setProcLength(0);
              // setProcPosition(0);
              // setByLevelLength(0);
              // setByLevelPosition(0);
              return;
            }
            const { StrData, IntData } = receivedData;
            // console.log("RecountsDashboard StrData=", StrData);
            if (StrData) {
              if (StrData.procName) setProcName(StrData.procName);
              if (StrData.levelName) setLevelName(StrData.levelName);
              if (StrData.checkBase) setCheckBase(StrData.checkBase);
              if (StrData.changedBase) setChangedBase(StrData.changedBase);
              if (StrData.error) setErrorMessage(StrData.error);
            }
            // console.log("RecountsDashboard IntData=", IntData);
            if (IntData) {
              if (IntData.procLength) setProcLength(IntData.procLength);
              if (IntData.procPosition) setProcPosition(IntData.procPosition);
              if (IntData.byLevelLength)
                setByLevelLength(IntData.byLevelLength);
              if (IntData.byLevelPosition)
                setByLevelPosition(IntData.byLevelPosition);
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

          // console.log("Error while establishing connection: " + { err });
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

  // console.log("RecountsDashboard procPercentage=", procPercentage);
  // console.log("RecountsDashboard byLevelPosition=", byLevelPosition);
  // console.log("RecountsDashboard byLevelLength=", byLevelLength);
  // console.log("RecountsDashboard byLevelPercentage=", byLevelPercentage);
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

      <Button
        className="mr-1 mb-1"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          DatabaseIntegrityCheck();
        }}
      >
        {rcWorkingOnDatabaseIntegrityCheck && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
        მონაცემთა ბაზის მთლიანობის შემოწმება
      </Button>
      {failureDatabaseIntegrityCheck && (
        <p>
          მონაცემთა ბაზის მთლიანობის შემოწმების ბოლო მცდელობა წარუმატებლად
          დასრულდა.
        </p>
      )}

      <Button
        className="mr-1 mb-1"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          CancelCurrentProcess();
        }}
      >
        პროცესის შეჩერება
      </Button>

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
