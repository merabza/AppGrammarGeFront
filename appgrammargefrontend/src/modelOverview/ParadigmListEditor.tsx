//ParadigmListEditor.tsx

import { FC } from "react";
import { Link } from "react-router-dom";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import { ParadigmNameModel } from "../masterData/mdTypes";

type ParadigmListEditorProps = {
  dataType: DataTypeFfModel;
  paradigmNamesTable: ParadigmNameModel[];
  formulasTableName: string;
  curscrollTo: {
    tabKey: string | undefined;
    recId: number;
    recName: string | undefined;
  };
  backLigth: (node: HTMLElement | HTMLLIElement | null) => void;
  saveReturnPageName: () => void;
};

const ParadigmListEditor: FC<ParadigmListEditorProps> = (props) => {
  //const { caption, paradigmNamesTable, tableName, formulasTableName, curscrollTo, backLigth, saveReturnPageName } = props;
  const {
    dataType,
    paradigmNamesTable,
    formulasTableName,
    curscrollTo,
    backLigth,
    saveReturnPageName,
  } = props;

  //console.log("ParadigmListEditor props=", props);

  const tableName = dataType.dtTable;
  //const {idFieldName, nameFieldName, keyFieldName} = dataType;
  const caption = dataType.dtName;

  const paradigmNamesTableSorted = paradigmNamesTable
    .slice()
    .sort((a, b) => a.sortId - b.sortId);

  return (
    <div>
      <h4>
        {caption} ({paradigmNamesTableSorted.length}){" "}
        {dataType.create && <Link to={`/mdItemEdit/${tableName}`}> + </Link>}
      </h4>
      <ol>
        {paradigmNamesTableSorted
          .sort((a, b) => a.sortId - b.sortId)
          .map((m) => {
            const bl =
              curscrollTo.tabKey === tableName &&
              (curscrollTo.recId === m.id || curscrollTo.recName === m.name);
            return (
              <li key={m.id.toString()} ref={bl ? backLigth : null}>
                {!dataType.update && !dataType.delete && (
                  <div>
                    {m.name} ({m.formulasCount})
                  </div>
                )}
                {(dataType.update || dataType.delete) && (
                  <div>
                    <Link
                      to={`/mdItemEdit/${tableName}/${m.id}`}
                      className={bl ? "backLigth" : undefined}
                      onClick={(e) => {
                        // e.preventDefault(); ეს საჭირო არ არის, რადგან ლინკზე აღარ გადადის
                        //ვინახავთ გვერდის სახელს, საიდანაც მოხდა რედაქტორის გახსნა. იმისათვისმ რომ კორექტულად მოხდეს უკან დაბრუნება
                        //props.saveReturnPageName(props.match.url.split('/')[1]);
                        saveReturnPageName();
                      }}
                    >
                      {m.name}{" "}
                    </Link>
                    <Link
                      to={`/${formulasTableName}/${m.id}`}
                      className={bl ? "backLigth" : undefined}
                    >
                      ({m.formulasCount})
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
      </ol>
    </div>
  );
};

export default ParadigmListEditor;
