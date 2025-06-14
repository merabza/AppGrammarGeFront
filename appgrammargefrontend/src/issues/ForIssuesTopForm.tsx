//ForIssuesTopForm.tsx

import type { FC } from "react";
import { Form, Button, Nav } from "react-bootstrap";
import { useAppSelector } from "../appcarcass/redux/hooks";

const ForIssuesTopForm: FC = () => {
    const { flatMenu } = useAppSelector((state) => state.navMenuState);

    //console.log("ForIssuesTopForm props=", props);

    // const [rootStartsWith, setRootStartsWith] = useState("");
    // const [createdUserName, setCreatedUserName] = useState("");

    const menLinkKey = "issues";

    function isValidPage() {
        if (!flatMenu) {
            return false;
        }
        return flatMenu.some((f) => f.menLinkKey === menLinkKey);
    }

    if (!isValidPage()) {
        return <div />;
    }

    //console.log("ForIssuesTopForm before return");

    return (
        <Nav>
            <Form>
                <Form.Label className="mr-2">
                    {" "}
                    მოსაგვარებელი საკითხები{" "}
                </Form.Label>
                <Button
                    className="mr-1"
                    onClick={(e) => {
                        e.preventDefault();
                        //history.push(createUrlForConfirmRoots('/forConfirmRootsList', rootStartsWith.trim(), createdUserName));
                    }}
                >
                    ყველა
                </Button>
                <Button
                    className="mr-1"
                    onClick={(e) => {
                        e.preventDefault();
                        //history.push(createUrlForConfirmRoots('/forConfirmRootsList', rootStartsWith.trim(), createdUserName));
                    }}
                >
                    გახსნილი
                </Button>
                <Button
                    className="mr-1"
                    onClick={(e) => {
                        e.preventDefault();
                        //history.push(createUrlForConfirmRoots('/forConfirmRootsList', rootStartsWith.trim(), createdUserName));
                    }}
                >
                    ჩემი
                </Button>
                {/* {true && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />} */}
            </Form>
        </Nav>
    );
};

export default ForIssuesTopForm;
