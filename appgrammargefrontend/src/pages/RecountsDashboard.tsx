//RecountsDashboard.tsx

import { useState, useEffect, type FC, useCallback } from "react";
import { Button, Spinner, ProgressBar, Row, Col, Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../appcarcass/redux/hooks";
import type { Err } from "../appcarcass/redux/types/errorTypes";
import { setAlertClientRunTimeError } from "../appcarcass/redux/slices/alertSlice";
import { useLocation } from "react-router-dom";
import {
    useCancelCurrentProcessMutation,
    // useDatabaseIntegrityCheckMutation,
    useDatabaseRecounterMutation,
    // useRecountBasesMutation,
    // useRecountFindDerivationBranchesWithoutDescendantsMutation,
    // useRecountInflectionSamplesMutation,
} from "../redux/api/recountApi";
import type { ProgressData } from "./RecountDashboardTypes";
import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
    type IHttpConnectionOptions,
} from "@microsoft/signalr";
import {
    csrfHeaderName,
    csrfHeaderValue,
    isSsoMode,
} from "../appcarcass/common/authMode";

const RecountsDashboard: FC = () => {
    const dispatch = useAppDispatch();

    const [procName, setProcName] = useState("");
    const [levelName, setLevelName] = useState("");
    const [checkBase, setCheckBase] = useState("");
    const [changedBase, setChangedBase] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [curRecounterName, setCurRecounterName] = useState("recountbases");

    const [procLength, setProcLength] = useState(0);
    const [processRun, setProcessRun] = useState(false);

    const [procPosition, setProcPosition] = useState(0);

    const [byLevelLength, setByLevelLength] = useState(0);
    const [byLevelPosition, setByLevelPosition] = useState(0);

    const [alertMessage] = useState("");
    const [hubConnection, setHubConnection] = useState<HubConnection>();
    const { baseUrl } = useAppSelector((state) => state.appParametersState);

    const [
        databaseRecounter,
        {
            isLoading: rcWorkingOnDatabaseRecounter,
            isError: failureDatabaseRecounter,
        },
    ] = useDatabaseRecounterMutation();

    // const [
    //   RecountBases,
    //   { isLoading: rcWorkingOnRecountBases, isError: failureRecountBases },
    // ] = useRecountBasesMutation();

    // const [
    //   RecountInflectionSamples,
    //   {
    //     isLoading: rcWorkingOnRecountInflectionSamples,
    //     isError: failureRecountInflectionSamples,
    //   },
    // ] = useRecountInflectionSamplesMutation();

    // const [
    //   RecountFindDerivationBranchesWithoutDescendants,
    //   {
    //     isLoading: rcWorkingOnRecountFindDerivationBranchesWithoutDescendants,
    //     isError: failureFindDerivationBranchesWithoutDescendants,
    //   },
    // ] = useRecountFindDerivationBranchesWithoutDescendantsMutation();

    // const [
    //   DatabaseIntegrityCheck,
    //   {
    //     isLoading: rcWorkingOnDatabaseIntegrityCheck,
    //     isError: failureDatabaseIntegrityCheck,
    //   },
    // ] = useDatabaseIntegrityCheckMutation();

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
                // hub-ი backend-ში api/v1/recounter/messages-ზეა (SsoLtgGe#16). Sso რეჟიმში ის იმავე origin-ის
                // სესიის cookie-თი და CSRF-ის header-ით შედის, Local რეჟიმში — ტოკენით
                const authOptions: IHttpConnectionOptions = isSsoMode()
                    ? { headers: { [csrfHeaderName]: csrfHeaderValue } }
                    : { accessTokenFactory: () => user.token };
                const hubConnect = new HubConnectionBuilder()
                    .withUrl(`${baseUrl}/recounter/messages`, {
                        transport:
                            /*HttpTransportType.WebSockets |*/ HttpTransportType.LongPolling,
                        ...authOptions,
                    })
                    .configureLogging(LogLevel.Information)
                    .build();
                try {
                    await hubConnect.start();
                    console.log("hub Connection successful!");

                    // Bind event handlers to the hubConnection.
                    // სერვერის typed hub-ი (IProgressDataMessenger) კლიენტის მეთოდს SendProgressData-ს იძახებს.
                    // PropertyNamingPolicy = null-ის გამო ველებიც და ლექსიკონის გასაღებებიც PascalCase-შია
                    // (ReCounterConstants, AppGrammarGeProcDataConstants). სერვერი ყოველ ჯერზე სრულ დაგროვილ
                    // მდგომარეობას აგზავნის, ნულოვანი რიცხვები და ცარიელი სტრიქონები კი ლექსიკონიდან იშლება,
                    // ამიტომ გამოტოვებული გასაღები ნიშნავს 0-ს ან ცარიელ სტრიქონს
                    hubConnect.on(
                        "SendProgressData",
                        (receivedData: ProgressData | null) => {
                            if (!receivedData) return;
                            const { BoolData, IntData, StrData } = receivedData;
                            //BoolData Clear-ის შემდეგ ცარიელია, ამიტომ ProcessRun მხოლოდ მაშინ იცვლება, როცა მოვიდა
                            if (typeof BoolData?.ProcessRun === "boolean")
                                setProcessRun(BoolData.ProcessRun);
                            setProcLength(IntData?.ProcLength ?? 0);
                            setProcPosition(IntData?.ProcPosition ?? 0);
                            setByLevelLength(IntData?.ByLevelLength ?? 0);
                            setByLevelPosition(IntData?.ByLevelPosition ?? 0);
                            setProcName(StrData?.ProcName ?? "");
                            setLevelName(StrData?.LevelName ?? "");
                            setCheckBase(StrData?.CheckBase ?? "");
                            setChangedBase(StrData?.ChangedBase ?? "");
                            setErrorMessage(StrData?.ReCounterError ?? "");
                        }
                    );

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

                    console.log(
                        "Error while establishing connection: " + { err }
                    );
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

    const { flatMenu } = useAppSelector(
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
    const byLevelPercentage = Math.round(
        (byLevelPosition / byLevelLength) * 100
    );

    // console.log("RecountsDashboard procPercentage=", procPercentage);
    // console.log("RecountsDashboard byLevelPosition=", byLevelPosition);
    // console.log("RecountsDashboard byLevelLength=", byLevelLength);
    // console.log("RecountsDashboard byLevelPercentage=", byLevelPercentage);
    return (
        <div>
            <h3>გადაანგარიშებები</h3>
            <Row className="ml-1 mb-1 mt-1">
                <Col sm="4">
                    <Form.Select
                        id={"RecounterSelect"}
                        disabled={processRun}
                        onChange={(e) => {
                            e.preventDefault();
                            const newValue = e.target.value;
                            setCurRecounterName(newValue);
                        }}
                    >
                        <option key={"recountbases"} value={"recountbases"}>
                            {"ფუძეების გადათვლა"}
                        </option>
                        <option
                            key={"recountinflectionsamples"}
                            value={"recountinflectionsamples"}
                        >
                            {"ფლექსიის ნიმუშების გადათვლა"}
                        </option>
                        <option
                            key={"findderivationbrancheswithoutdescendants"}
                            value={"findderivationbrancheswithoutdescendants"}
                        >
                            {"უშვილო დერივაციების პოვნა"}
                        </option>
                        <option
                            key={"databaseintegritycheck"}
                            value={"databaseintegritycheck"}
                        >
                            {"მონაცემთა ბაზის მთლიანობის შემოწმება"}
                        </option>
                        <option
                            key={"uploadlanguagemodel"}
                            value={"uploadlanguagemodel"}
                        >
                            {"ენის მოდელის ატვირთვა"}
                        </option>
                    </Form.Select>
                </Col>
                <Col sm="2">
                    <Button
                        disabled={processRun}
                        className="mr-1 mb-1"
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            console.log("curRecounterName=", curRecounterName);
                            databaseRecounter(curRecounterName);
                        }}
                    >
                        {rcWorkingOnDatabaseRecounter && (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        )}
                        დაწყება
                    </Button>
                </Col>
                <Col sm="2">
                    <Button
                        disabled={!processRun}
                        className="mr-1 mb-1"
                        type="button"
                        variant="danger"
                        onClick={(e) => {
                            e.preventDefault();
                            CancelCurrentProcess();
                        }}
                    >
                        გაჩერება
                    </Button>
                </Col>
            </Row>
            <Row className="ml-1 mb-1 mt-1">
                {failureDatabaseRecounter && (
                    <p>
                        გადათვლის გაშვების ბოლო მცდელობა წარუმატებლად დასრულდა.
                    </p>
                )}
            </Row>
            {/* <Row className="ml-1 mb-1 mt-1">
        <Col sm="2">
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
        </Col>
        {failureRecountBases && (
          <p>
            ფუძეების გადათვლის გაშვების ბოლო მცდელობა წარუმატებლად დასრულდა.
          </p>
        )}
      </Row>
      <Row className="ml-1 mb-1 mt-1">
        <Col sm="2">
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
        </Col>

        {failureRecountInflectionSamples && (
          <p>
            ფლექსიის ნიმუშების გადათვლის გაშვების ბოლო მცდელობა წარუმატებლად
            დასრულდა.
          </p>
        )}
      </Row>
      <Row className="ml-1 mb-1 mt-1">
        <Col sm="2">
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
        </Col>
        {failureFindDerivationBranchesWithoutDescendants && (
          <p>
            უშვილო დერივაციების პოვნის პროცესის გაშვების ბოლო მცდელობა
            წარუმატებლად დასრულდა.
          </p>
        )}
      </Row>

      <Row className="ml-1 mb-1 mt-1">
        <Col sm="2">
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
        </Col>

        {failureDatabaseIntegrityCheck && (
          <p>
            მონაცემთა ბაზის მთლიანობის შემოწმების ბოლო მცდელობა წარუმატებლად
            დასრულდა.
          </p>
        )}
      </Row>

      <Row className="ml-1 mb-1 mt-1">
        <Col sm="2">
          <Button
            className="mr-1 mb-1"
            type="button"
            variant="danger"
            onClick={(e) => {
              e.preventDefault();
              CancelCurrentProcess();
            }}
          >
            პროცესის შეჩერება
          </Button>
        </Col>
      </Row> */}

            {!!procName && (
                <div>
                    <p className="mt-1 mb-0">{procName}</p>
                    {!!procLength && (
                        <ProgressBar
                            now={procPercentage}
                            label={`${procPercentage}%`}
                        />
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
