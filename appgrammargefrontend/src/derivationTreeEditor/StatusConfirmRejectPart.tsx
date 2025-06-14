//StatusConfirmRejectPart.ts

import { type FC, useState } from "react";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconName } from "@fortawesome/fontawesome-svg-core";
import OnePlaintextRow from "../appcarcass/editorParts/OnePlaintextRow";
import MessageBox from "../appcarcass/common/MessageBox";
// import OnePlaintextRow from "../editorParts/OnePlaintextRow";

// import MessageBox from "../../carcass/common/MessageBox";

interface StatusConfirmRejectPartProps {
    recordStatusId: number;
    creator: string;
    applier: string | null;
    workingOnConfirmReject: boolean;
    confirmRejectFailure: boolean;
    onConfirmRejectClick: (opIsConfirm: boolean, withAllDesc: boolean) => void;
    onClearConfirmRejectFailure: () => void;
}

interface ButtonDataModel {
    buttonText: string;
    buttonVariant: string;
    buttonIcon: string;
    messageTitle: string;

    errorMessagetext: string;
    messageText: string;
    opIsConfirm: boolean;
    withAllDesc: boolean;
}

interface ButtonRowModel {
    visible: boolean;
    buttonData: ButtonDataModel[];
}

const StatusConfirmRejectPart: FC<StatusConfirmRejectPartProps> = (props) => {
    const {
        recordStatusId,
        creator,
        applier,
        workingOnConfirmReject,
        confirmRejectFailure,
        onConfirmRejectClick,
        onClearConfirmRejectFailure,
    } = props;

    // console.log("StatusConfirmRejectPart props=", props);

    const [buttonRowId, setButtonRowId] = useState(0);
    const [buttonId, setButtonId] = useState(0);
    const [showConfirmRejectMessage, setShowConfirmRejectMessage] =
        useState(false);

    //console.log("StatusConfirmRejectPart buttonRowId=", buttonRowId);
    //console.log("StatusConfirmRejectPart buttonId=", buttonId);
    //console.log("StatusConfirmRejectPart showConfirmRejectMessage=", showConfirmRejectMessage);

    let editStatus = "";
    let editStatusColor = "";
    const buttonRow = [] as ButtonRowModel[];

    switch (recordStatusId) {
        case 0:
            editStatus = "ახალი";
            editStatusColor = "blue";

            buttonRow[0] = {
                visible: true,
                buttonData: [
                    {
                        buttonText: "დადასტურება",
                        buttonVariant: "primary",
                        buttonIcon: "check",
                        messageTitle: "ცვლილებების დადასტურება",
                        errorMessagetext:
                            "ცვლილებების დადასტურებისას მოხდა შეცდომა, დადასტურება ვერ მოხერხდა",
                        messageText:
                            "ამ ცვლილების დადასტურება გამოიწვევს არსებული დაუდასტურებელი წინაპრების დადასტურებასაც. თანახმა ხართ?",
                        opIsConfirm: true,
                        withAllDesc: false,
                    },
                    {
                        buttonText: "უარყოფა",
                        buttonVariant: "danger",
                        buttonIcon: "times",
                        messageTitle: "ცვლილებების უარყოფა",
                        errorMessagetext:
                            "ცვლილებების უარყოფისას მოხდა შეცდომა, უარყოფა ვერ მოხერხდა",
                        messageText:
                            "ამ ცვლილების უარყოფა გამოიწვევს ამ ჩანაწერისა და მისი შთამომავლების წაშლას. თანახმა ხართ?",
                        opIsConfirm: false,
                        withAllDesc: false,
                    },
                ],
            };
            break;
        case 1:
            editStatus = "წაშლის კანდიდატი";
            editStatusColor = "red";
            buttonRow[0] = {
                visible: true,
                buttonData: [
                    {
                        buttonText: "წაშლის დადასტურება",
                        buttonVariant: "primary",
                        buttonIcon: "check",
                        messageTitle: "ცვლილებების დადასტურება",
                        errorMessagetext:
                            "ცვლილებების დადასტურებისას მოხდა შეცდომა, დადასტურება ვერ მოხერხდა",
                        messageText:
                            "ამ ცვლილების დადასტურება გამოიწვევს ამ ჩანაწერისა და მისი შთამომავლების საბოლოოდ წაშლას. თანახმა ხართ?",
                        opIsConfirm: true,
                        withAllDesc: false,
                    },
                    {
                        buttonText: "წაშლის უარყოფა",
                        buttonVariant: "danger",
                        buttonIcon: "times",
                        messageTitle: "ცვლილებების უარყოფა",
                        errorMessagetext:
                            "ცვლილებების უარყოფისას მოხდა შეცდომა, უარყოფა ვერ მოხერხდა",
                        messageText:
                            "ამ ცვლილების უარყოფა გამოიწვევს ამ ჩანაწერისა და მისი წინაპრების სტატუსების შეცვლას. ანუ ყველა ეს ჩანაწერი წაშლის კანდიდატის მაგივრად აღიდგენს დადასტურებულ სტატუსს. თანახმა ხართ?",
                        opIsConfirm: false,
                        withAllDesc: false,
                    },
                ],
            };
            break;
        case 2:
            editStatus = "დამოწმებული";
            editStatusColor = "green";
            buttonRow[0] = {
                visible: false,
                buttonData: [] as ButtonDataModel[],
            };
            break;
        default:
            break;
    }
    buttonRow[1] = {
        visible: true,
        buttonData: [
            {
                buttonText: "მთლიანი დადასტურება",
                buttonVariant: "primary",
                buttonIcon: "check",
                messageTitle: "ცვლილებების მთლიანი დადასტურება",
                errorMessagetext:
                    "ცვლილებების დადასტურებისას მოხდა შეცდომა, დადასტურება ვერ მოხერხდა",
                messageText:
                    "დადასტურდება როგორც ეს ჩანაწერი, ასევე ყველა მისი შთამომავალი თითოეული დადსტურებული ჩანაწერისათვის დადასტურდება ასევე არსებული დაუდასტურებელი წინაპრებიც. თანახმა ხართ?",
                opIsConfirm: true,
                withAllDesc: true,
            },
            {
                buttonText: "მთლიანი უარყოფა",
                buttonVariant: "danger",
                buttonIcon: "times",
                messageTitle: "ცვლილებების მთლიანი უარყოფა",
                errorMessagetext:
                    "ცვლილებების უარყოფისას მოხდა შეცდომა, უარყოფა ვერ მოხერხდა",
                messageText:
                    "მოხდება როგორც ამ ჩანაწერის, ასევე ყველა მისი შთამომავლის ცვლილების უარყოფა. თანახმა ხართ?",
                opIsConfirm: false,
                withAllDesc: true,
            },
        ],
    };

    // console.log("StatusConfirmRejectPart buttonRow=", buttonRow);
    // console.log("StatusConfirmRejectPart editStatus=", editStatus);

    return (
        <div>
            <OnePlaintextRow
                controlId="editStatus"
                label="სტატუსი"
                text={editStatus}
                color={editStatusColor}
            />

            <OnePlaintextRow
                controlId="creator"
                label="შემქმნელი"
                text={creator}
                color={editStatusColor}
            />

            {!!applier && (
                <OnePlaintextRow
                    controlId="applier"
                    label="დამდასტურებელი"
                    text={applier}
                    color={editStatusColor}
                />
            )}

            {buttonRow.map((btnRow, btnRowId) => {
                if (btnRow.visible)
                    return (
                        <Form.Group key={btnRowId} className="mb-1" as={Row}>
                            <Col sm="10" align="right">
                                {btnRow.buttonData.map((btn, btnId) => (
                                    <Button
                                        key={btnId}
                                        variant={btn.buttonVariant}
                                        className="mb-1 mr-1"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setButtonRowId(btnRowId);
                                            setButtonId(btnId);
                                            setShowConfirmRejectMessage(true);
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={btn.buttonIcon as IconName}
                                        />{" "}
                                        {btn.buttonText}
                                        {workingOnConfirmReject &&
                                            buttonRowId === btnRowId &&
                                            buttonId === btnId && (
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                            )}
                                    </Button>
                                ))}
                            </Col>
                        </Form.Group>
                    );
                return <div key={btnRowId}></div>;
            })}

            {buttonRow[buttonRowId].visible && (
                <MessageBox
                    show={showConfirmRejectMessage}
                    title={
                        buttonRow[buttonRowId].buttonData[buttonId].messageTitle
                    }
                    text={
                        buttonRow[buttonRowId].buttonData[buttonId].messageText
                    }
                    primaryButtonText="დიახ"
                    secondaryButtonText="არა"
                    onConfirmed={() => {
                        setShowConfirmRejectMessage(false);
                        onConfirmRejectClick(
                            buttonRow[buttonRowId].buttonData[buttonId]
                                .opIsConfirm,
                            buttonRow[buttonRowId].buttonData[buttonId]
                                .withAllDesc
                        );
                    }}
                    onClosed={() => setShowConfirmRejectMessage(false)}
                />
            )}

            {buttonRow[buttonRowId].visible && (
                <MessageBox
                    show={confirmRejectFailure}
                    title="შეცდომა"
                    text={
                        buttonRow[buttonRowId].buttonData[buttonId]
                            .errorMessagetext
                    }
                    primaryButtonText="კარგი"
                    onConfirmed={() => onClearConfirmRejectFailure()}
                    onClosed={() => onClearConfirmRejectFailure()}
                />
            )}
        </div>
    );
};
//{ userHasConfirmRight &&
export default StatusConfirmRejectPart;
