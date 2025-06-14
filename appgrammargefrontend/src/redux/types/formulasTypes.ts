//formulasTypes.ts

// export interface DerivationFormula {
//   npr: NounParadigmRow[];
// }

export interface NounParadigmModel {
    npr: NounParadigmRow[];
}

export interface NounParadigmRow {
    nprId: number;
    nounParadigmId: number;
    nprOrderInParadigm: number;
    grammarCaseId: number;
    nounNumberId: number;
    nprSample: string;
    //nounParadigmFormulaDetails: NounParadigmFormulaDetail[];
}

export interface VerbParadigmodel {
    npr: VerbParadigmRow[];
}

export interface VerbPersonMarkerParadigm {
    vpmpnId: number;
    vpmpnKey: string;
    sortId: number;
}

export interface VerbParadigmRow {
    vprId: number;
    verbTypeId: number;
    verbParadigmId: number;
    verbRowId: number;
    verbPersonMarkerParadigmId: number;
    vprSample: string | null;
    //verbParadigmFormulaDetails: VerbParadigmFormulaDetail[];
}
