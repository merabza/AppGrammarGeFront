//StatusPart.tsx

import { FC } from "react";

interface StatusPartProps {
  recordStatusId: number;
  creator: string;
}

const StatusPart: FC<StatusPartProps> = (props) => {
  const { recordStatusId, creator } = props;
  //console.log("StatusPart props=", props);

  let editStatusColor = "";
  switch (recordStatusId) {
    case 0:
      editStatusColor = "blue";
      break;
    case 1:
      editStatusColor = "red";
      break;
    case 2:
      editStatusColor = "green";
      break;
    default:
      break;
  }

  return <span style={{ color: `${editStatusColor}` }}>({creator})</span>;
};

export default StatusPart;
