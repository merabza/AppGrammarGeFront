//NameListEditor.tsx

import type { FC } from "react";
import { Link } from "react-router-dom";
import type { DataTypeFfModel } from "../appcarcass/redux/types/dataTypesTypes";
import AlertMessages from "../appcarcass/common/AlertMessages";
import { EAlertKind } from "../appcarcass/redux/slices/alertSlice";
import { useAppDispatch } from "../appcarcass/redux/hooks";
import { setTablesForClearAfterCrudOperations } from "../appcarcass/redux/slices/masterdataSlice";

type NameListEditorProps = {
    dataType: DataTypeFfModel;
    tableForEdit: any[];
    curscrollTo?:
        | {
              tabKey: string | undefined;
              recId: number;
              recName: string | undefined;
          }
        | undefined
        | null;
    backLigth: (node: HTMLElement | HTMLLIElement | null) => void;
    saveReturnPageName: () => void;
};

const NameListEditor: FC<NameListEditorProps> = (props) => {
    const {
        dataType,
        tableForEdit,
        curscrollTo,
        backLigth,
        saveReturnPageName,
    } = props;

    //console.log("NameListEditor props=", props);

    const dispatch = useAppDispatch();

    const tableName = dataType.dtTable;
    const { idFieldName, nameFieldName, keyFieldName } = dataType;
    const caption = dataType.dtName;

    if (!nameFieldName || !keyFieldName) {
        return (
            <div>
                <h5>ჩატვირთვის პრობლემა</h5>
                <AlertMessages alertKind={EAlertKind.ApiLoad} />
            </div>
        );
    }

    const tableForEditSorted = tableForEdit
        .slice()
        .sort((a, b) => a.sortId - b.sortId);

    return (
        <div>
            <h4>
                {caption} ({tableForEditSorted.length}){" "}
                {dataType.create && (
                    <Link
                        to={`/mdItemEdit/${tableName}`}
                        onClick={(e) => {
                            dispatch(
                                setTablesForClearAfterCrudOperations([
                                    dataType.dtTable,
                                ])
                            );
                            saveReturnPageName();
                        }}
                    >
                        {" "}
                        +{" "}
                    </Link>
                )}
            </h4>
            <ol>
                {tableForEditSorted.map((m) => {
                    const bl =
                        curscrollTo?.tabKey === tableName &&
                        curscrollTo?.recName === m[idFieldName];
                    //console.log("NameListEditor map m=", m);
                    //console.log("NameListEditor map idFieldName=", idFieldName);
                    return (
                        <li
                            key={m[idFieldName].toString()}
                            ref={bl ? backLigth : null}
                        >
                            {!dataType.update &&
                                !dataType.delete &&
                                (m[nameFieldName] ?? m[keyFieldName])}
                            {(dataType.update || dataType.delete) && (
                                <Link
                                    to={`/mdItemEdit/${tableName}/${m[idFieldName]}`}
                                    className={bl ? "backLigth" : undefined}
                                    onClick={(e) => {
                                        // e.preventDefault(); ეს საჭირო არ არის, რადგან ამ ინსტრუქციის არსებობისას ლინკზე აღარ გადადის.
                                        //ვინახავთ გვერდის სახელს, საიდანაც მოხდა რედაქტორის გახსნა. იმისათვის, რომ კორექტულად მოხდეს უკან დაბრუნება
                                        //props.saveReturnPageName(props.match.url.split('/')[1]);
                                        dispatch(
                                            setTablesForClearAfterCrudOperations(
                                                [dataType.dtTable]
                                            )
                                        );
                                        saveReturnPageName();
                                    }}
                                >
                                    {m[nameFieldName] ?? m[keyFieldName]}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default NameListEditor;
