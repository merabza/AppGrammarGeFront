// //ForConfirmRootsListTopForm.tsx

// import { useState, type FC } from "react";
// import { Form, Button, Spinner, Nav, Navbar } from "react-bootstrap";
// import { useAppSelector } from "../appcarcass/redux/hooks";
// import { useNavigate } from "react-router-dom";
// import { useGetUsersListForConfirmQuery } from "../redux/api/rootsApi";
// import { createUrlForConfirmRoots } from "./ForConfirmRootsListModule";

// const ForConfirmRootsListTopForm: FC = () => {
//     const [rootStartsWith, setRootStartsWith] = useState("");
//     const [createdUserName, setCreatedUserName] = useState("ყველა");

//     const menLinkKey = "forConfirmRootsList";

//     const { flatMenu } = useAppSelector((state) => state.navMenuState);

//     const {
//         data: UsersListForConfirm,
//         isLoading: UsersListForConfirmDropdownloading,
//     } = useGetUsersListForConfirmQuery();

//     const { forConfirmRootsListPageLoading } = useAppSelector(
//         (state) => state.rootsState
//     );

//     function isValidPage() {
//         if (!flatMenu) {
//             return false;
//         }
//         return flatMenu.some((f) => f.menLinkKey === menLinkKey);
//     }
//     const navigate = useNavigate();

//     if (!isValidPage()) {
//         return <div />;
//     }

//     return (
//         <Nav>
//             <Navbar.Brand className="mr-2"> ძირის დასაწყისი: </Navbar.Brand>
//             <Form.Control
//                 type="text"
//                 value={rootStartsWith ? rootStartsWith : ""}
//                 className="mr-2"
//                 onChange={(e) => {
//                     const newRootStartsWith = e.target.value;
//                     setRootStartsWith(newRootStartsWith);
//                 }}
//                 autoComplete="off"
//             />
//             <Navbar.Brand className="mr-2"> რედაქტორი: </Navbar.Brand>
//             <Form.Control
//                 as="select"
//                 value={createdUserName}
//                 onChange={(e) => {
//                     e.preventDefault();
//                     const newCreatedUserName = e.target.value;
//                     setCreatedUserName(newCreatedUserName);
//                 }}
//             >
//                 <option>ყველა</option>
//                 {!!UsersListForConfirm &&
//                     UsersListForConfirm.map((item) => (
//                         <option key={item}>{item}</option>
//                     ))}
//             </Form.Control>
//             <Button
//                 variant="outline-success"
//                 onClick={(e) => {
//                     e.preventDefault();
//                     navigate(
//                         createUrlForConfirmRoots(
//                             "/forConfirmRootsList",
//                             rootStartsWith.trim(),
//                             createdUserName
//                         )
//                     );
//                 }}
//             >
//                 ჩატვირთვა
//             </Button>
//             {(forConfirmRootsListPageLoading ||
//                 UsersListForConfirmDropdownloading) && (
//                 <Spinner
//                     as="span"
//                     animation="border"
//                     size="sm"
//                     role="status"
//                     aria-hidden="true"
//                 />
//             )}
//         </Nav>
//     );
// };

// export default ForConfirmRootsListTopForm;
