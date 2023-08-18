//PhoneticsTypeModule.ts

import {
  PhoneticsOptionDetail,
  PhoneticsTypeProhibition,
} from "../masterData/mdTypes";

export function GetOnephoneticsOptionDetailDescription(
  phoda: PhoneticsOptionDetail
) {
  let count = phoda.phodCount;
  let objectId = phoda.phodObject;
  //0;იკარგება/ჩაენაცვლება;1;ჩნდება
  let actionName = "ჩნდება";
  if (phoda.phodActId === 1) {
    //თუ ჩნდება ე.ი. რიცხვები ამოსაყრელებზე არ მიუთითებს
    count = 0;
    objectId = 0; //გაჩენის შემთხვევაში მხოლოდ ბგერების გადათვლაა გათვალისწინებული
  } else {
    actionName = "იკარგება";
    if (phoda.phodNew) actionName = "ჩაენაცვლება";
  }

  //0;ბგერა;1;ხმოვანი;2;თანხმოვანი
  //0;ბგერიდან;1;ხმოვნიდან;2;თანხმოვნიდან
  //0;ბგერიის;1;ხმოვნის;2;თანხმოვნის
  let objectName = "ბგერა";
  if (objectId === 1) {
    objectName = "ხმოვანი";
  } else if (objectId === 2) {
    objectName = "თანხმოვანი";
  }

  if (phoda.phodActId === 1) {
    //ჩნდება
    let newName = `${phoda.phodNew} ბგერა`;
    if (phoda.phodNew && phoda.phodNew.length > 1)
      newName = `${phoda.phodNew} ბგერები`;
    if (phoda.phodOrient === 1) {
      //თავიდან
      if (phoda.phodStart === 0) actionName = `თავში ჩნდება ${newName}`;
      else if (phoda.phodStart === 1)
        actionName = `პირველი ბგერის შემდეგ ემატება ${newName}`;
      else
        actionName = `მე-${phoda.phodStart} ბგერის შემდეგ ემატება ${newName}`;
    } else {
      //ბოლოდან
      if (phoda.phodStart === 0) actionName = `ბოლოში ემატება ${newName}`;
      else if (phoda.phodStart === 1)
        actionName = `ბოლო ბგერის წინ ჩნდება ${newName}`;
      else actionName = `ბოლო ${phoda.phodStart} ბგერის წინ ჩნდება ${newName}`;
    }
  } else {
    if (phoda.phodNew) {
      //ჩაენაცვლება
      let newName = `${phoda.phodNew} ბგერით`;
      if (phoda.phodNew.length > 1) newName = `${phoda.phodNew} ბგერებით`;

      if (phoda.phodOrient === 1) {
        //თავიდან
        if (phoda.phodStart === 0)
          actionName = `პირველი ${
            count > 1 ? count.toString() : ""
          } ${objectName} იცვლება ${newName}`;
        else
          actionName = `მე-${(
            phoda.phodStart + 1
          ).toString()}-დან დაწყებული ${count} ${objectName} იცვლება ${newName}`;
      } else {
        //ბოლოდან
        if (phoda.phodStart === 0)
          actionName = `ბოლო ${
            count > 1 ? count.toString() : ""
          } ${objectName} იცვლება ${newName}`;
        else if (phoda.phodStart === 1)
          actionName = `ბოლოს წინა${
            count > 1 ? `დან დაწყებული ${count}` : ""
          } ${objectName} იცვლება ${newName}`;
        else
          actionName = `ბოლო მე-${(
            phoda.phodStart + 1
          ).toString()}-დან დაწყებული ${count} ${objectName} იცვლება ${newName}`;
      }
    } else {
      //იკარგება
      if (phoda.phodOrient === 1) {
        //თავიდან
        if (phoda.phodStart === 0)
          actionName = `იკარგება პირველი ${
            count > 1 ? count.toString() : ""
          } ${objectName}`;
        else
          actionName = `იკარგება მე-${(
            phoda.phodStart + 1
          ).toString()}-დან დაწყებული ${count} ${objectName}`;
      } else {
        //ბოლოდან
        if (phoda.phodStart === 0)
          actionName = `იკარგება ბოლო ${
            count > 1 ? count.toString() : ""
          } ${objectName}`;
        else if (phoda.phodStart === 1)
          actionName = `იკარგება ბოლოს წინა${
            count > 1 ? `დან დაწყებული ${count}` : ""
          } ${objectName}`;
        else
          actionName = `იკარგება ბოლო მე-${(
            phoda.phodStart + 1
          ).toString()}-დან დაწყებული ${count} ${objectName}`;
      }
    }
  }

  return actionName;
}

export function GetOnePhoneticsTypeProhibitionDescription(
  phtp: PhoneticsTypeProhibition
) {
  //phtpProhId 0;იყოს;1;იყოს ერთ-ერთი;2;არ იყოს
  //phtpOrient 0;ბოლოდან;1;თავიდან
  //phtpObject 0;ბგერა;1;ხმოვანი;2;თანხმოვანი

  //0;ბოლოდან;1;თავიდან
  let OrientationName = "ბოლოში";
  if (phtp.phtpOrient === 1) {
    OrientationName = "თავში";
  }

  let count = phtp.phtpCount;
  if (phtp.phtpProhId !== 1) {
    if (phtp.phtpNew) count = phtp.phtpNew.length;
  }

  if (count === 1) {
    if (phtp.phtpStart === 0) {
      OrientationName = "ბოლო ბგერა";
      if (phtp.phtpOrient === 1) {
        OrientationName = "პირველი ბგერა";
      }
    } else if (phtp.phtpStart === 1) {
      OrientationName = "ბოლოს წინა ბგერა";
      if (phtp.phtpOrient === 1) {
        OrientationName = "მეორე ბგერა";
      }
    } else {
      OrientationName = `ბოლოდან მე-${phtp.phtpStart} ბგერის წინა ბგერა`;
      if (phtp.phtpOrient === 1) {
        OrientationName = `მე-${(phtp.phtpStart + 1).toString()} ბგერა`;
      }
    }
  } else {
    if (phtp.phtpStart === 0) {
      OrientationName = `ბოლო ${count} ბგერა`;
      if (phtp.phtpOrient === 1) {
        OrientationName = `პირველი ${count} ბგერა`;
      }
    } else if (phtp.phtpStart === 1) {
      OrientationName = `ბოლოს წინა ${count} ბგერა`;
      if (phtp.phtpOrient === 1) {
        OrientationName = `მეორედან დაწყებული ${count} ბგერა`;
      }
    } else {
      OrientationName = `ბოლოდან მე-${phtp.phtpStart} ბგერის წინა ${count} ბგერა`;
      if (phtp.phtpOrient === 1) {
        OrientationName = `მე-${(
          phtp.phtpStart + 1
        ).toString()} ბგერიდან დაწყებული ${count} ბგერა`;
      }
    }
  }

  let mustbe = phtp.phtpNew;
  if (!phtp.phtpNew) mustbe = phtp.phtpObject === 1 ? "ხმოვანი" : "თანხმოვანი";

  let prohText = "";
  switch (phtp.phtpProhId) {
    case 0:
      prohText = `${OrientationName} უნდა იყოს: "${mustbe}"`;
      break;
    case 1:
      prohText = `${OrientationName} უნდა იყოს ერთ-ერთი ამ ბგერებიდან: "${mustbe}"`;
      break;
    case 2:
      prohText = `${OrientationName} არ უნდა იყოს: "${mustbe}"`;
      break;
    default:
      prohText = "არ ვიცი რა უნდა იყოს";
  }

  //console.log("PhoneticsTypeModule.js GetOnePhoneticsTypeProhibitionDescription phtp=", phtp);
  //console.log("PhoneticsTypeModule.js GetOnePhoneticsTypeProhibitionDescription prohText=", prohText);

  return prohText;
}
