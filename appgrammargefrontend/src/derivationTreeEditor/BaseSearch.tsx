//BaseSearch.tsx

import { useState, useEffect, useCallback, type FC } from "react";
import BaseLink, { type BaseLinkElement } from "./BaseLink";
import { Link, useLocation, useParams } from "react-router-dom";

import "./BaseSearch.css";
import WaitPage from "../appcarcass/common/WaitPage";
import { useAppSelector } from "../appcarcass/redux/hooks";
// import { useBasesByPages } from "./RootsHooks/useBasesByPages";
import { useAlert } from "../appcarcass/hooks/useAlert";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { useBasesByPages } from "./RootsHooks/useBasesByPages";

const itemsPerPage = 30;

const BaseSearch: FC = () => {
    const { isMenuLoading, flatMenu } = useAppSelector(
        (state) => state.navMenuState
    );
    const { memoBaseCounts, memoBasePages } = useAppSelector(
        (state) => state.rootsState
    );
    // console.log(
    //   "BaseSearch useEffect { basesPageLoading, memoBaseCounts, memoBasePages }=",
    //   { memoBaseCounts, memoBasePages }
    // );

    const [loadBasesByPages, isLoadingBases] = useBasesByPages();
    //const [getBasesByPages] = useLazyGetBasesByPagesQuery();

    function getPageKey(
        baseName: string,
        itemsPerPage: number,
        currentPage: string | undefined
    ) {
        var pageNom = 1;
        if (currentPage) pageNom = parseInt(currentPage);
        return {
            pageNom,
            pagekey: baseName + "_" + itemsPerPage + "_" + pageNom,
        };
    }

    const menLinkKey = useLocation().pathname.split("/")[1];

    const { baseName, page } = useParams<string>();

    const [currentBaseName, setCurrentBaseName] = useState<string | undefined>(
        undefined
    );
    const [currentPageNom, setCurrentPageNom] = useState<number>(1);
    const [currentPageKey, setCurrentPageKey] = useState<string | undefined>(
        undefined
    );

    const isValidPage = useCallback(() => {
        if (!flatMenu) {
            return false;
        }
        return flatMenu.find((f) => f.menLinkKey === menLinkKey);
    }, [flatMenu, menLinkKey]);

    useEffect(() => {
        const menuItem = isValidPage();
        // console.log("BaseSearch useEffect menuItem=", menuItem);
        if (!menuItem || !baseName) return;

        const { pageNom, pagekey } = getPageKey(baseName, itemsPerPage, page);
        if (currentPageKey !== pagekey) {
            setCurrentBaseName(baseName);
            setCurrentPageNom(pageNom);
            setCurrentPageKey(pagekey);
            if (baseName && pageNom)
                loadBasesByPages(baseName, itemsPerPage, pageNom, pagekey);
        }
    }, [isMenuLoading, flatMenu, baseName, page, currentPageKey]);

    const [ApiLoadHaveErrors] = useAlert(EAlertKind.ApiLoad);

    function createLink(
        baseName: string,
        i: number,
        linkText: string | null = null
    ) {
        const text = linkText ? linkText : i.toString();
        return (
            <Link
                key={text}
                className="paginglink"
                to={"/basesearch/" + baseName + "/" + i}
            >
                {text}
            </Link>
        );
    }

    function createPageLinks() {
        const pageLinks = [];

        if (
            currentBaseName &&
            memoBaseCounts[currentBaseName] &&
            memoBaseCounts[currentBaseName] > 1
        ) {
            const pagesCount = Math.floor(
                (memoBaseCounts[currentBaseName] - 1) / itemsPerPage + 1
            );

            let startWith = currentPageNom - 4;
            let endWith = currentPageNom + 4;
            if (pagesCount < 10) {
                startWith = 1;
                endWith = pagesCount;
            } else {
                if (currentPageNom < 5) {
                    startWith = 1;
                    endWith = startWith + 8;
                }
                if (currentPageNom > pagesCount - 4) {
                    endWith = pagesCount;
                    startWith = endWith - 8;
                }
            }
            if (currentPageNom > 1)
                pageLinks.push(
                    createLink(currentBaseName, currentPageNom - 1, "<")
                );
            for (let i = startWith; i <= endWith; i++) {
                if (i === currentPageNom)
                    pageLinks.push(
                        <strong key="b">
                            {createLink(currentBaseName, i)}
                        </strong>
                    );
                else pageLinks.push(createLink(currentBaseName, i));
            }
            if (currentPageNom < pagesCount)
                pageLinks.push(
                    createLink(currentBaseName, currentPageNom + 1, ">")
                );
        }
        return pageLinks;
    }

    if (ApiLoadHaveErrors)
        return (
            <div>
                <h5>ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );

    // console.log("BaseSearch before WaitPage {basesPageLoading, isMenuLoading}=", {
    //   isLoadingBases,
    //   isMenuLoading,
    // });

    if (isLoadingBases || isMenuLoading) return <WaitPage />;

    if (!currentBaseName || !currentPageKey || !flatMenu) {
        return <div></div>;
    }

    const pageLinks = createPageLinks();

    if (!memoBaseCounts[currentBaseName]) {
        return (
            <div className="mt-5 row">
                <h5>
                    ფუძე სახელით <strong>{currentBaseName}</strong> არ მოიძებნა
                </h5>
            </div>
        );
    }

    return (
        <div>
            <div className="mt-5 row">
                <h5>
                    ფუძეების ძებნა: <strong>{currentBaseName}</strong> გვერდი:{" "}
                    <strong>{currentPageNom}</strong>
                </h5>
            </div>
            <div id="base-search" className="mt-5 row">
                <ul className="container threecolumns">
                    {memoBasePages[currentPageKey] &&
                        memoBasePages[currentPageKey].map((item, index) => {
                            const baseLinkElement = {
                                baseLink: item,
                                searchVal: currentBaseName,
                            } as BaseLinkElement;
                            return (
                                <li key={index}>
                                    <BaseLink
                                        item={baseLinkElement}
                                        viewLinks
                                    />
                                </li>
                            );
                        })}
                </ul>

                {pageLinks.length && (
                    <div className="text-center container">{pageLinks}</div>
                )}
            </div>
        </div>
    );
};

export default BaseSearch;
