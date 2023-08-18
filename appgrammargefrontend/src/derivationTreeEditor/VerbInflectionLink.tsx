//VerbInflectionLink.tsx

import { FC } from "react";
import { Link } from "react-router-dom";
import { VerbInflectionModel } from "./TypesAndSchemas/InflectionDataTypeAndSchema";
import { ListElement } from "./TextBoxAutoComplete";

export interface VerbInflectionElement extends ListElement {
  verbLink: VerbInflectionModel;
}

interface VerbInflectionLinkProps {
  item: VerbInflectionElement;
}

const VerbInflectionLink: FC<VerbInflectionLinkProps> = (props) => {
  const item = props.item as VerbInflectionElement;
  //console.log("VerbInflectionLink Start props=", props);

  /*make the matching letters bold:*/
  const wparts = item.verbLink.infName.split(item.searchVal);
  const strongpart = <strong>{item.searchVal}</strong>;

  function wrapLink(
    source: JSX.Element[] | JSX.Element,
    href: string | null,
    key: number | undefined = undefined
  ): JSX.Element {
    if (href) {
      if (key)
        return (
          <Link key={key} to={href}>
            {source}
          </Link>
        );
      else
        return (
          <Link key={0} to={href}>
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
        null
      )}
    </span>
  );
};

export default VerbInflectionLink;
