//BaseLink.tsx

import { FC } from "react";
import { Link } from "react-router-dom";
import { BaseLinkType } from "../redux/types/rootsTypes";
import { ListElement, listElementComponentProps } from "./TextBoxAutoComplete";

export interface BaseLinkElement extends ListElement {
  baseLink: BaseLinkType;
}

interface BaseLinkProps extends listElementComponentProps {
  item: BaseLinkElement;
  viewLinks: boolean;
}

const BaseLink: FC<BaseLinkProps> = (props) => {
  const viewLinks = props.viewLinks;
  const item = props.item as BaseLinkElement;
  // console.log("BaseLink Start props=", props);

  /*make the matching letters bold:*/
  const wparts = item.baseLink.dbrBaseName.split(item.searchVal);
  const strongpart = <strong>{item.searchVal}</strong>;

  function wrapLink(
    source: JSX.Element[] | JSX.Element,
    href: string | null,
    key: number | undefined = undefined
  ): JSX.Element {
    if (href) {
      if (key)
        return (
          <Link key={href} to={href}>
            {source}
          </Link>
        );
      else
        return (
          <Link key={href} to={href}>
            {source}
          </Link>
        );
    }
    return <span key={key}>{source}</span>;
  }

  return (
    <span>
      {wrapLink(
        wparts.map((itm, indx) => {
          if (indx === 0) return <span key={indx}>{itm}</span>;
          return (
            <span key={indx}>
              {strongpart}
              {itm}
            </span>
          );
        }),
        viewLinks ? getBaseHref(item.baseLink, 0) : null
      )}
      {" ("}
      {item.baseLink.roots &&
        item.baseLink.roots.map((rootItem, indx) => {
          return wrapLink(
            <span key={rootItem.rootId}>
              {indx ? "; " : ""}
              {rootItem.rootName}
              {rootItem.rootHomonymIndex > 0 && (
                <sup>{rootItem.rootHomonymIndex}</sup>
              )}
              {rootItem.rootNote && <span> {rootItem.rootNote}</span>}
            </span>,
            viewLinks ? getBaseHref(item.baseLink, indx) : null,
            indx
          );
        })}
      {")"}
    </span>
  );
};

export default BaseLink;

export function getBaseHref(baseItem: BaseLinkType, rootnom: number) {
  //console.log("BaseLink getBaseHref baseItem=", baseItem);
  //console.log("BaseLink getBaseHref rootnom=", rootnom);
  // return baseItem ? (`/root/${baseItem.roots[rootnom].rootId}/${baseItem.dbrId}`) : "";

  if (baseItem) {
    if (baseItem.roots[rootnom].rootFirstBranchId === baseItem.dbrId)
      return `/root/${baseItem.roots[rootnom].rootId}`;
    else return `/root/${baseItem.roots[rootnom].rootId}/${baseItem.dbrId}`;
  } else return "";
}
