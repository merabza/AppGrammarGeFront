//LinkColumn.tsx

import { FC } from "react";
import { Link } from "react-router-dom";
import { IRecord } from "./IssueTypes";

type LinkColumnProps = {
  linkBase?: string;
  idFieldName?: string;
  value?: string;
  index?: number;
  offset?: number;
  showRows?: number;
  record?: any;
  children?: React.ReactNode | string;
  onGetLink?: (record?: IRecord) => string;
  onGetLinkText?: (record?: IRecord) => string;
  onClick?: (
    record?: any,
    index?: number,
    offset?: number,
    showRows?: number
  ) => void;
};

const LinkColumn: FC<LinkColumnProps> = (props) => {
  const {
    linkBase,
    idFieldName,
    value,
    index,
    offset,
    showRows,
    record,
    onGetLink,
    onGetLinkText,
    onClick,
  } = props;

  //console.log("LinkColumn props=", props);
  //console.log("LinkColumn value=", value);
  //console.log("LinkColumn onGetLink=", onGetLink);

  let linkTo: string | null = null;
  let linkText = value;

  if (onGetLink) {
    linkTo = onGetLink(record);
  }

  if (onGetLinkText) {
    linkText = onGetLinkText(record);
  }

  if (!linkTo && linkBase && idFieldName && record && idFieldName in record) {
    linkTo = linkBase;
    if (!linkTo.startsWith("/")) linkTo = "/" + linkTo;
    if (!linkTo.endsWith("/")) linkTo = linkTo + "/";
    linkTo = linkTo + record[idFieldName];
  }

  if (linkTo)
    return (
      <Link
        to={linkTo}
        onClick={(e) => {
          // e.preventDefault(); ეს საჭირო არ არის, რადგან კლინკზე აღარ გადადის
          if (onClick) onClick(record, index, offset, showRows);
        }}
      >
        {linkText}
      </Link>
    );

  return <>{linkText}</>;
};

export default LinkColumn;
