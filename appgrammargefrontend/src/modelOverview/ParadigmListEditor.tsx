//ParadigmListEditor.tsx

import { FC } from "react";
import { Link } from "react-router-dom";
import { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import { ParadigmNameModel } from "../masterData/mdTypes";
import { useAppDispatch } from "../appcarcass/redux/hooks";
import { setTablesForClearAfterCrudOperations } from "../appcarcass/redux/slices/masterdataSlice";

type ParadigmListEditorProps = {
  dataType: DataTypeFfModel;
  paradigmNamesTable: ParadigmNameModel[];
  paradigmNamesTableName: string;
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
    paradigmNamesTableName,
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

  const dispatch = useAppDispatch();

  // console.log(
  //   "ParadigmListEditor paradigmNamesTableSorted=",
  //   paradigmNamesTableSorted
  // );

  return (
    <div>
      <h4>
        {caption} ({paradigmNamesTableSorted.length}){" "}
        {dataType.create && (
          <Link
            to={`/mdItemEdit/${tableName}`}
            onClick={(e) => {
              dispatch(
                setTablesForClearAfterCrudOperations([paradigmNamesTableName])
              );
              saveReturnPageName();
            }}
          >
            {" "}
            +{" "}
          </Link>
        )}
      </h4>
      <span>
        რიგითი ნომერი. პარადიგმის სახელი (ფორმულების რაოდენობა) (შემთხვევების
        რაოდენობა)
      </span>
      <ol>
        {paradigmNamesTableSorted
          .sort((a, b) => a.sortId - b.sortId)
          .map((m) => {
            const bl =
              curscrollTo.tabKey === tableName &&
              (curscrollTo.recId === m.prdId ||
                curscrollTo.recName === m.prdName);
            return (
              <li key={m.prdId.toString()} ref={bl ? backLigth : null}>
                {!dataType.update && !dataType.delete && (
                  <div>
                    {m.prdName} ({m.formulasCount}) ({m.inflectionsCount})
                  </div>
                )}
                {(dataType.update || dataType.delete) && (
                  <div>
                    <Link
                      to={`/mdItemEdit/${tableName}/${m.prdId}`}
                      className={bl ? "backLigth" : undefined}
                      onClick={(e) => {
                        // e.preventDefault(); ეს საჭირო არ არის, რადგან ლინკზე აღარ გადადის
                        //ვინახავთ გვერდის სახელს, საიდანაც მოხდა რედაქტორის გახსნა. იმისათვისმ რომ კორექტულად მოხდეს უკან დაბრუნება
                        //props.saveReturnPageName(props.match.url.split('/')[1]);
                        dispatch(
                          setTablesForClearAfterCrudOperations([
                            paradigmNamesTableName,
                          ])
                        );
                        saveReturnPageName();
                      }}
                    >
                      {m.prdName}{" "}
                    </Link>
                    <Link
                      to={`/${formulasTableName}/${m.prdId}`}
                      className={bl ? "backLigth" : undefined}
                    >
                      ({m.formulasCount}) ({m.inflectionsCount})
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
      </ol>
      <span>
        {"ფორმულების საერთო რაოდენობა: "}
        {paradigmNamesTableSorted.reduce((accumulator, object) => {
          return accumulator + object.formulasCount;
        }, 0)}
      </span>
      <span>
        {" შემთხვევების საერთო რაოდენობა: "}
        {paradigmNamesTableSorted.reduce((accumulator, object) => {
          return accumulator + object.inflectionsCount;
        }, 0)}
      </span>
    </div>
  );
};

export default ParadigmListEditor;
