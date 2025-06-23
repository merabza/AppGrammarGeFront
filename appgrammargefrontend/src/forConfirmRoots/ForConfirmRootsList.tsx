// //ForConfirmRootsList.tsx

// import { useState, useEffect, useCallback, type FC, type JSX } from "react";
// import { useQueryParam, StringParam } from "use-query-params";
// import { Link, useLocation, useParams } from "react-router-dom";
// import { useAppSelector } from "../appcarcass/redux/hooks";
// import WaitPage from "../appcarcass/common/WaitPage";
// import { createUrlForConfirmRoots } from "./ForConfirmRootsListModule";
// // import { useForConfirmRootsByPages } from "./useForConfirmRootsByPages";

// const ForConfirmRootsList: FC = () => {
//     const itemsPerPage: number = 30;
//     const firstPageNom: number = 1;

//     function getPageKey(
//         rootStartsWith: string | null | undefined,
//         createdUserName: string | null | undefined,
//         itemsPerPage: number,
//         currentPage: string | undefined
//     ) {
//         let pageNom: number = firstPageNom;
//         if (currentPage) pageNom = parseInt(currentPage);

//         // console.log("getPageKey => ", {
//         //   rootStartsWith,
//         //   createdUserName,
//         //   itemsPerPage,
//         //   currentPage,
//         // });
//         // console.log("getPageKey => ", { pageNom });
//         // console.log(
//         //   "getPageKey pagekey=",
//         //   (rootStartsWith ?? "") +
//         //     "_" +
//         //     (createdUserName ?? "") +
//         //     "_" +
//         //     itemsPerPage +
//         //     "_" +
//         //     pageNom ?? ""
//         // );

//         return {
//             pageNom,
//             pagekey:
//                 (rootStartsWith ?? "") +
//                 "_" +
//                 (createdUserName ?? "") +
//                 "_" +
//                 itemsPerPage +
//                 "_" +
//                 pageNom,
//         };
//     }

//     const [rootStartsWith] = useQueryParam("rootStartsWith", StringParam);
//     const [createdUserName] = useQueryParam("createdUserName", StringParam);
//     const [currentPageNom, setCurrentPageNom] = useState<number>(firstPageNom);
//     const [currentPageKey, setCurrentPageKey] = useState<string | null>(null);
//     const [currentFilterKey, setCurrentFilterKey] = useState<string | null>(
//         null
//     );

//     const menLinkKey = useLocation().pathname.split("/")[1];

//     const { page } = useParams<string>();

//     const { isMenuLoading, flatMenu } = useAppSelector(
//         (state) => state.navMenuState
//     );

//     const [CheckForConfirmRootsByPages] = useForConfirmRootsByPages();

//     const {
//         memoForConfirmRootsCounts,
//         memoForConfirmRootsPages,
//         forConfirmRootsListPageLoading,
//     } = useAppSelector((state) => state.rootsState);

//     const isValidPage = useCallback(() => {
//         if (!flatMenu) {
//             return false;
//         }
//         return flatMenu.find((f) => f.menLinkKey === menLinkKey);
//     }, [flatMenu, menLinkKey]);

//     useEffect(() => {
//         const menuItem = isValidPage();
//         //console.log("ForConfirmRootsList useEffect menuItem=", menuItem);
//         if (!menuItem) return;

//         const { pageNom, pagekey } = getPageKey(
//             rootStartsWith,
//             createdUserName,
//             itemsPerPage,
//             page
//         );
//         if (currentPageKey !== pagekey) {
//             setCurrentPageNom(pageNom);
//             setCurrentPageKey(pagekey);
//             setCurrentFilterKey(`${rootStartsWith}_${createdUserName}`);
//             if (pageNom)
//                 CheckForConfirmRootsByPages(
//                     rootStartsWith,
//                     createdUserName,
//                     itemsPerPage,
//                     pageNom,
//                     pagekey
//                 );
//         }
//     }, [
//         isMenuLoading,
//         flatMenu,
//         isValidPage,
//         rootStartsWith,
//         createdUserName,
//         page,
//         currentPageKey,
//     ]);

//     function createLink(
//         rootStartsWith: string | null | undefined,
//         createdUserName: string | null | undefined,
//         i: number,
//         linkText: string | null = null
//     ) {
//         const text = linkText ? linkText : i.toString();

//         return (
//             <Link
//                 key={text}
//                 className="paginglink"
//                 to={createUrlForConfirmRoots(
//                     `/forConfirmRootsList/${i}`,
//                     rootStartsWith,
//                     createdUserName
//                 )}
//             >
//                 {text}
//             </Link>
//         );
//     }

//     function createPageLinks() {
//         const pageLinks: JSX.Element[] = [];
//         if (!currentFilterKey) return pageLinks;
//         if (
//             memoForConfirmRootsCounts[currentFilterKey] &&
//             memoForConfirmRootsCounts[currentFilterKey] > 1
//         ) {
//             const pagesCount =
//                 memoForConfirmRootsCounts[currentFilterKey] / itemsPerPage;
//             let startWith = currentPageNom - 4;
//             if (startWith < 1) startWith = 1;
//             let endWith = startWith + 9;
//             if (endWith > pagesCount) endWith = pagesCount;
//             if (currentPageNom > 1)
//                 pageLinks.push(
//                     createLink(
//                         rootStartsWith,
//                         createdUserName,
//                         currentPageNom - 1,
//                         "<"
//                     )
//                 );
//             for (let i = startWith; i < endWith; i++) {
//                 if (i === currentPageNom)
//                     pageLinks.push(
//                         <strong key="b">
//                             {createLink(rootStartsWith, createdUserName, i)}
//                         </strong>
//                     );
//                 else
//                     pageLinks.push(
//                         createLink(rootStartsWith, createdUserName, i)
//                     );
//             }
//             if (currentPageNom < pagesCount)
//                 pageLinks.push(
//                     createLink(
//                         rootStartsWith,
//                         createdUserName,
//                         currentPageNom + 1,
//                         ">"
//                     )
//                 );
//         }
//         return pageLinks;
//     }

//     // console.log("ForConfirmRootsList before WaitPage => ", {
//     //   forConfirmRootsListPageLoading,
//     //   isMenuLoading,
//     //   currentFilterKey,
//     //   currentPageNom,
//     //   currentPageKey,
//     //   flatMenu,
//     //   memoForConfirmRootsCounts,
//     //   memoForConfirmRootsPages,
//     // });

//     if (forConfirmRootsListPageLoading || isMenuLoading) return <WaitPage />;

//     if (!currentFilterKey || !currentPageKey || !flatMenu) {
//         return <div></div>;
//     }

//     const pageLinks = createPageLinks();

//     // console.log("ForConfirmRootsList pageLinks=", pageLinks);

//     if (!memoForConfirmRootsCounts[currentFilterKey]) {
//         return (
//             <div className="mt-5 row">
//                 <h5>ჩანაწერები არ მოიძებნა</h5>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <div className="mt-5 row">
//                 <h5>
//                     დასადასტურებელი ძირები&nbsp;
//                     {!!rootStartsWith && (
//                         <span>
//                             რომლებიც იწყება ასოებით -{" "}
//                             <strong>{rootStartsWith}&nbsp;</strong>
//                         </span>
//                     )}
//                     {!!createdUserName && (
//                         <span>
//                             რედაქტორი - <strong>{createdUserName}&nbsp;</strong>
//                         </span>
//                     )}
//                     გვერდი: <strong>{currentPageNom}</strong>
//                 </h5>
//             </div>
//             <div id="base-search" className="mt-5 row">
//                 <ul className="container threecolumns">
//                     {memoForConfirmRootsPages[currentPageKey] &&
//                         memoForConfirmRootsPages[currentPageKey].map(
//                             (item, index) => {
//                                 return (
//                                     <li key={index}>
//                                         <Link to={`/root/${item.rootId}`}>
//                                             {item.rootName}
//                                             {item.rootHomonymIndex > 0 && (
//                                                 <sup>
//                                                     {item.rootHomonymIndex}
//                                                 </sup>
//                                             )}
//                                             {item.rootNote && (
//                                                 <span> ({item.rootNote})</span>
//                                             )}
//                                         </Link>
//                                     </li>
//                                 );
//                             }
//                         )}
//                 </ul>

//                 {pageLinks.length && (
//                     <div className="text-center container">{pageLinks}</div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ForConfirmRootsList;
